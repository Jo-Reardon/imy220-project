import { MongoClient } from 'mongodb';

// REPLACE THIS WITH YOUR ACTUAL MONGODB ATLAS CONNECTION STRING
const uri = "mongodb+srv://imy220:codeVerse@codeverse.0k5zwz5.mongodb.net/?retryWrites=true&w=majority&appName=codeVerse";

let db;
let client;

export async function connectDB() {
    if (db) return db;
    
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        db = client.db('codeverse');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
}

export async function closeDB() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
}