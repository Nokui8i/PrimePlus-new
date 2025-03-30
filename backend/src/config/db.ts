import { prisma } from '../app';

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Successfully connected to PostgreSQL database');
    
    // Verify connection by querying the database
    await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log('Database connection verified');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 