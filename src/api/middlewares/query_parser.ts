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
        limit: parseInt(limit ?? '20', 10) || 20,
        offset: parseInt(offset ?? '0', 10) || 0,
        quantity: parseInt(quantity ?? '1', 10) || 1 
    };

    next();
}

export default queryParser;
