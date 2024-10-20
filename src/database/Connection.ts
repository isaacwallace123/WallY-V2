import { connect } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const DBUser = process.env.DATABASE_USER;
const DBPassword = process.env.DATABASE_PASSWORD;
const DBHost = process.env.DATABASE_HOST;
const DBPort = process.env.DATABASE_PORT;
const DBCollection = process.env.DATABASE_COLLECTION;

const DBURI = `mongodb://${DBUser}:${DBPassword}@${DBHost}:${DBPort}/${DBCollection}`;

const ConnectDatabase = async () => {
    try {
        await connect(DBURI, {});

        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export { ConnectDatabase };