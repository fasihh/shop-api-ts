import { NextFunction, Request, Response, RequestHandler } from "express";

const asyncHandler = (callback: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => 
    Promise.resolve(callback(req, res, next)).catch((error: unknown) => {
        console.error(error);
        next(error);
    });

export default asyncHandler;
