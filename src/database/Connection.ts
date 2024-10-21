import { connect, connection } from "mongoose";
import { HooksRegistry, Symbols } from "../hooks/Registry";

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
        const DB = await connect(DBURI, {});

        console.log('MongoDB connected successfully.');

        HooksRegistry.set(Symbols.Database, DB);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const CloseDatabase = async () => {
    try {
        await connection.close();

        console.log('MongoDB disconnected successfully.');
    } catch (error) {
        console.error('Error closing MongoDB:', error);
        process.exit(1);
    }
}

export { ConnectDatabase, CloseDatabase };