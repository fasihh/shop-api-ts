import { Request, Response } from 'express';
import type { CartInfo, ReturnResponse } from '../types';
import CartService from '../services/cart';
import type CartItem from '../models/cart_item';

class CartController {
    async getActiveCart(req: Request, res: Response): Promise<ReturnResponse> {
        const cart_info: CartInfo = await CartService.getByUserId(req.user?.id);

        return res.status(200).json({
            message: 'Cart fetched successfully',
            cart: {
                cart_id: cart_info.cart.id,
                cart_items: cart_info.cart_items.map((cart_item: CartItem) => ({
                    id: cart_item.id,
                    item_id: cart_item.item_id,
                    quantity: cart_item.quantity,
                }))
            }
        });
    }

    async addToCart(req: Request, res: Response): Promise<ReturnResponse> {
        const id: number = req.id as number;
        const quantity: number | undefined = req.queryParams.quantity;

        const cart_item_id: number = await CartService.addToCart(id, req.user?.id, quantity);

        return res.status(200).json({
            message: 'Item added to cart successfully',
            cart_item_id
        })
    }

    async removeFromCart(req: Request, res: Response): Promise<ReturnResponse> {
        const id: number = req.id as number;

        await CartService.removeFromCart(req.user?.id, id);

        return res.status(200).json({
            message: 'Cart item removed successfully',
        });
    }

    async updateCartItem(req: Request, res: Response): Promise<ReturnResponse> {
        const id: number = req.id as number;
        const quantity: number = req.queryParams.quantity as number;

        await CartService.updateCartItem(req.user?.id, id, quantity);

        return res.status(200).json({
            message: 'Cart item updated successfully'
        });
    }

    async checkout(req: Request, res: Response): Promise<ReturnResponse> {
        const bill: Record<string, unknown> = await CartService.checkout(req.user?.id);

        return res.status(200).json({
            message: 'Cart checkout complete',
            checkout_info: {
                ...bill
            }
        });
    }
}

const CartControllerInst = new CartController;

export default CartControllerInst;
