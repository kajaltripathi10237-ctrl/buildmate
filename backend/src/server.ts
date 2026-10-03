import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-buildmate-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecret-buildmate-refresh-key';
const PORT = Number(process.env.PORT || 10000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.disable('x-powered-by');

const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['CONTRACTOR', 'WORKER', 'VENDOR', 'ADMIN']).optional(),
});

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  tradeType: z.string(),
  skillsRequired: z.array(z.string()).default([]),
  wage: z.coerce.number().default(0),
  budget: z.coerce.number().default(0),
  location: z.string(),
  duration: z.string().optional(),
  priority: z.string().default('MEDIUM'),
  postedById: z.string(),
});

const marketplaceSchema = z.object({
  vendorId: z.string(),
  title: z.string().min(3),
  category: z.string(),
  price: z.coerce.number(),
  stock: z.coerce.number().default(0),
  description: z.string().optional(),
  type: z.enum(['MATERIAL', 'EQUIPMENT']).default('MATERIAL'),
});

const generateToken = (user: { id: string; role: string; email: string }) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

const generateRefreshToken = (user: { id: string; role: string; email: string }) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', service: 'buildmate-api' });
  } catch (error) {
    console.error('Health check failed', error);
    res.status(500).json({ status: 'error', service: 'buildmate-api', message: 'Database unavailable' });
  }
});

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const parsed = authSchema.parse(req.body);
    const password = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.name || 'New User',
        email: parsed.email,
        phone: parsed.phone || '',
        password,
        role: parsed.role || 'WORKER',
      },
    });

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role, email: user.email });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(201).json({
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Signup failed', error);
    res.status(400).json({ message: 'Registration failed', error: (error as Error).message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });

    if (!user?.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(parsed.password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role, email: user.email });

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.json({
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login failed', error);
    res.status(400).json({ message: 'Login failed', error: (error as Error).message });
  }
});

app.post('/api/auth/refresh', async (req: Request, res: Response) => {
  try {
    const parsed = z.object({ refreshToken: z.string() }).parse(req.body);
    const payload = jwt.verify(parsed.refreshToken, JWT_REFRESH_SECRET) as { id: string; role: string; email: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || user.refreshToken !== parsed.refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    res.json({ token });
  } catch (error) {
    console.error('Refresh failed', error);
    res.status(401).json({ message: 'Refresh failed' });
  }
});

app.get('/api/jobs', async (_req: Request, res: Response) => {
  const jobs = await prisma.job.findMany({
    include: { applications: true, postedBy: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(jobs);
});

app.post('/api/jobs', async (req: Request, res: Response) => {
  try {
    const parsed = jobSchema.parse(req.body);
    const job = await prisma.job.create({
      data: {
        ...parsed,
        status: 'OPEN',
      },
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Job creation failed', error: (error as Error).message });
  }
});

app.get('/api/workers', async (_req: Request, res: Response) => {
  const workers = await prisma.user.findMany({
    where: { role: 'WORKER' },
    include: { worker: true },
  });
  res.json(workers);
});

app.get('/api/marketplace', async (_req: Request, res: Response) => {
  const listings = await prisma.materialListing.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(listings);
});

app.post('/api/marketplace', async (req: Request, res: Response) => {
  try {
    const parsed = marketplaceSchema.parse(req.body);
    const listing = await prisma.materialListing.create({
      data: {
        vendorId: parsed.vendorId,
        title: parsed.title,
        category: parsed.category,
        price: parsed.price,
        stock: parsed.stock,
        description: parsed.description || '',
      },
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: 'Marketplace item failed', error: (error as Error).message });
  }
});

app.post('/api/attendance/checkin', async (req: Request, res: Response) => {
  try {
    const parsed = z.object({ userId: z.string(), location: z.string().optional() }).parse(req.body);
    const attendance = await prisma.workerAttendance.create({
      data: {
        userId: parsed.userId,
        checkInTime: new Date(),
        location: parsed.location || 'GPS Verified',
        status: 'PRESENT',
      },
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: 'Check-in failed', error: (error as Error).message });
  }
});

app.post('/api/attendance/checkout', async (req: Request, res: Response) => {
  try {
    const parsed = z.object({ userId: z.string() }).parse(req.body);
    const attendance = await prisma.workerAttendance.findFirst({
      where: { userId: parsed.userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No active attendance record found' });
    }

    const updated = await prisma.workerAttendance.update({
      where: { id: attendance.id },
      data: { checkOutTime: new Date(), status: 'APPROVED' },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Check-out failed', error: (error as Error).message });
  }
});

app.get('/api/analytics', async (_req: Request, res: Response) => {
  const [jobs, workers, payments, analytics] = await Promise.all([
    prisma.job.count(),
    prisma.user.count({ where: { role: 'WORKER' } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.analytics.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ]);

  res.json({
    totalJobs: jobs,
    totalWorkers: workers,
    totalPaymentVolume: payments._sum.amount || 0,
    analytics,
  });
});

app.get('/api/chat/rooms', async (_req: Request, res: Response) => {
  const rooms = await prisma.chatRoom.findMany({ include: { messages: true, participants: true } });
  res.json(rooms);
});

app.get('/api/support-tickets', async (_req: Request, res: Response) => {
  const tickets = await prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(tickets);
});

app.post('/api/support-tickets', async (req: Request, res: Response) => {
  try {
    const parsed = z.object({ userId: z.string(), subject: z.string(), description: z.string() }).parse(req.body);
    const ticket = await prisma.supportTicket.create({ data: parsed });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Ticket creation failed', error: (error as Error).message });
  }
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
  });

  socket.on('send-message', async (payload: { roomId: string; senderId: string; content: string }) => {
    const message = await prisma.message.create({
      data: {
        roomId: payload.roomId,
        senderId: payload.senderId,
        content: payload.content,
        messageType: 'TEXT',
      },
    });

    io.to(payload.roomId).emit('new-message', message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`BuildMate API running on http://localhost:${PORT}`);
});
