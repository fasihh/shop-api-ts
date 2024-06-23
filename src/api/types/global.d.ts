import type { Response } from 'express';

export type ReturnResponse = Response<any, Record<string, any>>;

export interface RequestQuery {
    username?: string;
    limit?: number;
    offset?: number;
}
