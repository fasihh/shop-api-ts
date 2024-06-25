import { Request, Response } from 'express';
import type { ReturnResponse } from '../types';
import CartService from '../services/cart';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';
import type Cart from '../models/cart';

class CartController {
    async create(req: Request, res: Response): Promise<ReturnResponse> {
        const cart: Cart = await CartService.create(req.user?.id);

        return res.status(201).json({
            message: 'Cart created successfully',
            cart_id: cart.id
        });
    }
}

const CartControllerInst = new CartController;

export default CartControllerInst;
