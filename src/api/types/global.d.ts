import type { Response } from 'express';

export type ReturnResponse = Response<any, Record<string, any>>;

export interface RequestParams {
    username?: string;
    limit?: string;
    offset?: string;
}
