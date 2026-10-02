const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'buildmate_secret_key';

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION MODULE ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword, role: role || 'WORKER' }
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: 'User registration failed or email exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// --- JOB MANAGEMENT MODULE ---
app.get('/api/jobs', async (req, res) => {
  const jobs = await prisma.job.findMany({ include: { postedBy: true } });
  res.json(jobs);
});

app.post('/api/jobs', async (req, res) => {
  const { title, description, budget, location, postedById } = req.body;
  const job = await prisma.job.create({
    data: { title, description, budget: parseFloat(budget), location, postedById }
  });
  res.json(job);
});

// --- WORKER & ATTENDANCE MODULE ---
app.post('/api/attendance', async (req, res) => {
  const { workerId, location } = req.body;
  const log = await prisma.attendance.create({
    data: { workerId, location: location || 'GPS Location Verified' }
  });
  res.json(log);
});

app.get('/api/attendance/:workerId', async (req, res) => {
  const logs = await prisma.attendance.findMany({ where: { workerId: req.params.workerId } });
  res.json(logs);
});

// --- MARKETPLACE MODULE ---
app.get('/api/marketplace', async (req, res) => {
  const listings = await prisma.marketplaceListing.findMany({ include: { seller: true } });
  res.json(listings);
});

app.post('/api/marketplace', async (req, res) => {
  const { title, category, type, price, sellerId } = req.body;
  const listing = await prisma.marketplaceListing.create({
    data: { title, category, type, price: parseFloat(price), sellerId }
  });
  res.json(listing);
});

// --- ANALYTICS DASHBOARD ---
app.get('/api/analytics', async (req, res) => {
  const totalJobs = await prisma.job.count();
  const totalWorkers = await prisma.user.count({ where: { role: 'WORKER' } });
  const totalListings = await prisma.marketplaceListing.count();
  res.json({ totalJobs, totalWorkers, totalListings, activeEscrow: '$45,200' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`BuildMate API server active on port ${PORT}`));
