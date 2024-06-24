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
        await new Promise((resolve, reject) => {
            redis.on('ready', resolve);
            redis.on('error', reject);
        });
        console.log('Connected to Redis');

        await sequelize.authenticate();
        await sequelize.sync({ alter: process.env.MODE === 'dev' })
        console.log('Connected to DB');
        
        server.listen(port);
        console.log(`Server running on: http://localhost:${port}`);
    } catch (error: unknown) {
        console.error(error);
    }
}

start();
