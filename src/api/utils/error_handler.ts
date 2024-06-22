import { NextFunction, Request, Response } from 'express';
import RequestError from '../exceptions/request_error';

const errorHandler = (error: RequestError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(error.status || 500).json({
        error: {
            name: error.name || 'Server Error',
            message: error.message || 'Internal Server Error',
            info: error.info
        }
    });
}

export default errorHandler;
