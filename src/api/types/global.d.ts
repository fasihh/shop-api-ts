import type { Response } from 'express';

export type ReturnResponse = Response<any, Record<string, any>>;

export type CartInfo = { cart: Cart, cart_items: CartItem[] };

export interface RequestQuery {
    search?: string;
    limit?: number;
    offset?: number;
    quantity?: number;
}
