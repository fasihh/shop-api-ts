import { Request, Response, NextFunction } from 'express';
import UserDAO from '../daos/user';
import asyncHandler from './async_handler';
import type User from '../models/user';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';

// this middleware exists for item routes that require a user id upon creation
// this was needed for cases where a token is valid but the may not exist

const checkUserExists = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: User | null = await UserDAO.getById(req.user?.id);

    if (!user || user.username !== req.user?.username) throw new RequestError(ExceptionType.UNAUTHORIZED);
    next();
});

export default checkUserExists;
