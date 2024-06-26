import { NextFunction, Request, Response } from "express";

const queryParser = (req: Request, res: Response, next: NextFunction) => {
    const {
        search,
        limit,
        offset,
        quantity
    }: {
        search?: string,
        limit?: string,
        offset?: string,
        quantity?: string
    } = req.query;
    
    req.queryParams = {
        search,
        limit: Math.abs(Number(limit ?? '20')) || 20,
        offset: Math.abs(Number(offset ?? '0')) || 0,
        quantity: Math.abs(Number(quantity ?? '1')) || 1 
    };

    next();
}

export default queryParser;
