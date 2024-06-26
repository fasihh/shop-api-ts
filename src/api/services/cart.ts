import CartDAO from '../daos/cart';
import CartItemDAO from '../daos/cart_item';
import { ExceptionType } from '../exceptions/exceptions';
import RequestError from '../exceptions/request_error';
import type Cart from '../models/cart';
import type CartItem from '../models/cart_item';
import type { CartInfo } from '../types';

class CartService {
    async getByUserId(user_id: number): Promise<CartInfo> {
        const cart: Cart | null = await CartDAO.getByUserId(user_id);
        if (!cart) throw new RequestError(ExceptionType.CART_NOT_FOUND);

        const cart_items: CartItem[] = await CartItemDAO.getByCartId(cart.id);

        return {
            cart,
            cart_items
        };
    }

    async checkout(user_id: number): Promise<Record<string, unknown>> {
        const cart_info: CartInfo = await this.getByUserId(user_id);

        if (cart_info.cart_items.length === 0)
            throw new RequestError(
                ExceptionType.INVALID_REQUEST,
                'Cart is empty'
            );

        const bill: Record<string, unknown> = {
            total_items: cart_info.cart_items.length,
            total_price: cart_info.cart_items.reduce(
                (acc: number, cart_item: CartItem) => acc + (cart_item.item?.price || 0) * cart_item.quantity , 0
            ),
            items: cart_info.cart_items.map((cart_item: CartItem) => ({
                item_id: cart_item.item_id,
                price: cart_item.item?.price
            }))
        };

        // set current cart to checkedOut = true
        await CartDAO.update(cart_info.cart.id, true);

        // create new active cart
        await this.create(user_id);

        return bill;
    }

    async addToCart(item_id: number, user_id: number, quantity?: number): Promise<number> {
        const cart: Cart | null = await CartDAO.getByUserId(user_id);
        if (!cart) throw new RequestError(ExceptionType.CART_NOT_FOUND);

        const cart_item: CartItem = await CartItemDAO.create(item_id, cart.id, quantity);

        return cart_item.id;
    }

    async create(user_id: number): Promise<Cart> {
        const exists: Cart | null = await CartDAO.getByUserId(user_id);
        if (exists) throw new RequestError(ExceptionType.CART_CONFLICT);

        const cart: Cart = await CartDAO.create(user_id);
        return cart;
    }
}

const CartServiceInst = new CartService;

export default CartServiceInst;
