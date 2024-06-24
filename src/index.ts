import http, { Server } from 'http';
import sequelize from './config/db';
import redis from './config/redis';
import app from './app';

import dotenv from 'dotenv';
dotenv.config();

const port: string = process.env.PORT || '3001';
const server: Server = http.createServer(app);

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: process.env.MODE === 'dev' })
        console.log('Connected to DB');

        await redis.connect();
        console.log('Connected to Redis');
        
        server.listen(port);
        console.log(`Server running on: http://localhost:${port}`);
    } catch (error: unknown) {
        console.error(error);
    }
}

start();
