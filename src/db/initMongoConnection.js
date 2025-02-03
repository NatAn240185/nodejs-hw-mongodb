import mongoose from 'mongoose';
import 'dotenv/config';

export async function initMongoConnection() {
    try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(url);
    console.log("Mongo connection successfully established!");     
    } catch (error) {
        console.error(error);
    }
};
