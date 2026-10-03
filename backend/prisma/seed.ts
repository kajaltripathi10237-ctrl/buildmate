import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Password123!', 10);

  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'CONTRACTOR' }, update: {}, create: { name: 'CONTRACTOR' } }),
    prisma.role.upsert({ where: { name: 'WORKER' }, update: {}, create: { name: 'WORKER' } }),
    prisma.role.upsert({ where: { name: 'VENDOR' }, update: {}, create: { name: 'VENDOR' } }),
    prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } }),
  ]);

  const defaultPermissions = [
    'jobs:create',
    'jobs:read',
    'jobs:update',
    'workers:read',
    'payments:read',
    'marketplace:read',
    'chat:read',
    'admin:read',
  ];

  for (const permissionName of defaultPermissions) {
    await prisma.permission.upsert({
      where: { name: permissionName },
      update: {},
      create: { name: permissionName },
    });
  }

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@buildmate.com' },
      update: {},
      create: {
        name: 'BuildMate Admin',
        email: 'admin@buildmate.com',
        phone: '+15550000001',
        password: hash,
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'contractor@buildmate.com' },
      update: {},
      create: {
        name: 'Apex Builders',
        email: 'contractor@buildmate.com',
        phone: '+15550000002',
        password: hash,
        role: 'CONTRACTOR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'worker@buildmate.com' },
      update: {},
      create: {
        name: 'Nathan Stone',
        email: 'worker@buildmate.com',
        phone: '+15550000003',
        password: hash,
        role: 'WORKER',
      },
    }),
  ]);

  const contractor = users[1];
  const worker = users[2];

  await Promise.all([
    prisma.contractor.upsert({
      where: { userId: contractor.id },
      update: {},
      create: { userId: contractor.id, companyName: 'Apex Builders', address: 'Boston, MA' },
    }),
    prisma.worker.upsert({
      where: { userId: worker.id },
      update: {},
      create: {
        userId: worker.id,
        trade: 'Masonry',
        skillSet: ['Brickwork', 'Finishing', 'Safety'],
        experienceYears: 6,
        certifications: ['OSHA 30'],
      },
    }),
  ]);

  const job = await prisma.job.create({
    data: {
      title: 'Commercial Structural Framework',
      description: 'Frame and reinforce a multi-story commercial structure for a mixed-use project.',
      tradeType: 'Construction',
      skillsRequired: ['Steel Work', 'Safety Management', 'Site Coordination'],
      wage: 12000,
      budget: 18000,
      location: 'Boston, MA',
      duration: '6 weeks',
      status: 'OPEN',
      postedById: contractor.id,
    },
  });

  await prisma.jobApplication.create({
    data: {
      jobId: job.id,
      workerId: worker.id,
      status: 'PENDING',
    },
  });

  await prisma.wallet.upsert({
    where: { userId: worker.id },
    update: {},
    create: { userId: worker.id, balance: 4200.5 },
  });

  await prisma.analytics.createMany({
    data: [
      { metric: 'revenue', value: 42000, label: 'Q1' },
      { metric: 'attendance', value: 96.4, label: 'This month' },
      { metric: 'jobs', value: 42, label: 'Open jobs' },
    ],
  });

  console.log('BuildMate seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
