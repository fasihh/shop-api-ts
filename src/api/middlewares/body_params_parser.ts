import type { NextFunction, Request, Response } from "express";
import requestHandler from "./async_handler";
import { ExceptionType } from "../exceptions/exceptions";
import RequestError from "../exceptions/request_error";

const paramsParser = requestHandler((req: Request, res: Response, next: NextFunction) => {
    const { price }: { price: string | undefined } = req.body;

    if (price === undefined) next();

    const price_f: number = parseFloat(price as string);
    if (isNaN(price_f)) throw new RequestError(ExceptionType.INVALID_REQUEST);
    req.body.price = price_f;

    next();
});

export default paramsParser;
