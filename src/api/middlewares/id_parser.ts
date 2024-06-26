import { NextFunction, Request, Response } from "express";
import asyncHandler from "./async_handler";
import RequestError from "../exceptions/request_error";
import { ExceptionType } from "../exceptions/exceptions";

const idParser = asyncHandler((req: Request, res: Response, next: NextFunction) => {
    const id: number = Number(req.params.id);
    if (isNaN(id) || id <= 0) throw new RequestError(ExceptionType.INVALID_ID);
    
    req.id = id;
    next();
});

export default idParser;
