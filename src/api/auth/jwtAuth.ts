import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import dotenv from 'dotenv';
import { ReturnResponse } from '../types';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../types/exceptions';
dotenv.config();

const authHandler = (req: Request, res: Response, next: NextFunction): ReturnResponse | void => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader) return res.status(401).json({
        message: 'Auth failure: Token not provided'
    });

    const token: string = authHeader.replace('Bearer ', '');

    try {
        const decoded: JwtPayload = jwt.verify(
            token,
            process.env.JWT_KEY || 'secret'
        ) as JwtPayload;

        req.user = decoded;
        next();
    } catch (error) {
        throw new RequestError(ExceptionType.UNAUTHORIZED);
    }
}

export default authHandler;
