// import express, { Express, NextFunction, Request, Response } from 'express';
import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './api/utils/error_handler';
import UserRouter from './api/routes/user';

const app: Express = express();

// request logs
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/users', UserRouter);

// main error handler
app.use(errorHandler);

export default app;
