import { prisma } from '../app';

beforeAll(async () => {
  // Connect to the database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from the database
  await prisma.$disconnect();
}); 