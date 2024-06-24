import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async_handler';
import TokenService from '../services/token';
import { ReturnResponse } from '../types';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';
import { JwtPayload } from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const authHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<ReturnResponse | void> => {
    const authHeader: string | undefined = req.headers.authorization;

    // check if token exists
    if (!authHeader) return res.status(401).json({
        message: 'Auth failure: Token not provided'
    });

    // get token from header
    const token: string = authHeader.replace('Bearer ', '');

    try {
        const decoded: JwtPayload | null = await validate(token);

        if (!decoded) return res.status(401).json({
            message: 'Auth failure: blacklisted token'
        });
        
        // add it to 'user' for next middleware
        req.user = decoded;
        next();
    } catch (error) {
        throw new RequestError(ExceptionType.UNAUTHORIZED);
    }
});

const validate = async (token: string): Promise<JwtPayload | null> => {
    // get decoded token
    // throws error in case token is not validated
    const decoded: JwtPayload = TokenService.validate(token);

    // send null if token blacklisted
    if (await TokenService.isBlacklisted(decoded.id))
        return null;

    return decoded;
}

export default authHandler;
