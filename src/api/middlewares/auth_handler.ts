import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async_handler';
import AuthService from '../services/auth';
import { ReturnResponse } from '../types';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';
import { JwtPayload } from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const authHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<ReturnResponse | void> => {
    const authHeader: string | undefined = req.headers.authorization;

    // check if token exists
    if (!authHeader) throw new RequestError(ExceptionType.INVALID_TOKEN);

    // get token from header
    const token: string = authHeader.replace('Bearer ', '');

    try {
        // get decoded user data
        const decoded: JwtPayload = AuthService.validate(token);

        // throw error if id is blacklisted
        if (await AuthService.isBlacklisted(token)) throw new RequestError(ExceptionType.UNAUTHORIZED);

        // set it in the request object for the next middleware to use 
        req.user = decoded;
        next();
    } catch (error: unknown) {
        throw new RequestError(ExceptionType.UNAUTHORIZED);
    }
});

export default authHandler;
