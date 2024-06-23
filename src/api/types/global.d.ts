import type { Response } from 'express';

export type ReturnResponse = Response<any, Record<string, any>>;

export interface RequestQuery {
    search?: string;
    limit?: number;
    offset?: number;
}
