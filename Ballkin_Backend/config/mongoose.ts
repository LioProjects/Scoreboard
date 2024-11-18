import { connect, set } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;

if (!MONGO_DB_URI) {
  throw new Error('MONGO_DB_URI is not defined in environment variables.');
}

// connection to db
export const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect(MONGO_DB_URI);
    console.log('MongoDB connected to', db.connection.name);
  } catch (error) {
    console.error(error);
  }
};