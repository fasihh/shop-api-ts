import { NextFunction, Request, Response } from "express";

const queryParser = (req: Request, res: Response, next: NextFunction) => {
    const { limit, offset }: { limit?: string, offset?: string } = req.query;
    
    req.queryParams = {
        limit: parseInt(limit ?? '20', 10) || 20,
        offset: parseInt(offset ?? '0', 10) || 0
    }

    next();
}

export default queryParser;
