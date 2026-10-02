const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const contractor = await prisma.user.upsert({
    where: { email: 'contractor@buildmate.com' },
    update: {},
    create: { name: 'Apex Builders', email: 'contractor@buildmate.com', phone: '9876543210', password, role: 'CONTRACTOR' }
  });

  const worker = await prisma.user.upsert({
    where: { email: 'worker@buildmate.com' },
    update: {},
    create: { name: 'John Mason', email: 'worker@buildmate.com', phone: '9123456789', password, role: 'WORKER' }
  });

  await prisma.job.create({
    data: {
      title: 'Commercial Structural Framework',
      description: 'Need 10 certified steel workers for high-rise commercial site.',
      budget: 15000,
      location: 'Downtown Site A',
      postedById: contractor.id
    }
  });

  await prisma.marketplaceListing.create({
    data: {
      title: 'CAT Excavator 320 (For Rent)',
      category: 'Equipment',
      type: 'Rent',
      price: 450,
      sellerId: contractor.id
    }
  });

  console.log('Database successfully seeded with BuildMate initial data!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
