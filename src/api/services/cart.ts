import CartDAO from '../daos/cart';
import CartItemDAO from '../daos/cart_item';
import { ExceptionType } from '../exceptions/exceptions';
import RequestError from '../exceptions/request_error';
import type Cart from '../models/cart';
import CartItem from '../models/cart_item';
import type { CartInfo } from '../types';

class CartService {
    async getByUserId(user_id: number): Promise<CartInfo> {
        // even tho there will always be a user with a cart, this should tackle VERY small edge cases
        const cart: Cart | null = await CartDAO.getByUserId(user_id);
        if (!cart) throw new RequestError(ExceptionType.CART_NOT_FOUND);

        // get all cart items by cart_id
        const cart_items: CartItem[] = await CartItemDAO.getByCartId(cart.id);

        return {
            cart,
            cart_items
        };
    }

    async checkout(user_id: number): Promise<Record<string, unknown>> {
        // get cart and cart items of user
        const cart_info: CartInfo = await this.getByUserId(user_id);

        // if cart is empty, throw error
        if (cart_info.cart_items.length === 0)
            throw new RequestError(
                ExceptionType.INVALID_REQUEST,
                'Cart is empty'
            );

        // create bill
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
        // again, the edge case
        const cart: Cart | null = await CartDAO.getByUserId(user_id);
        if (!cart) throw new RequestError(ExceptionType.CART_NOT_FOUND);

        // create cart item with the cart_id and item_id along with quantity
        const cart_item: CartItem = await CartItemDAO.create(item_id, cart.id, quantity);

        return cart_item.id;
    }

    // updateCartItem and removeFromCart methods perform same checks and require almost the same thing
    // will need to make it cleaner later

    async removeFromCart(user_id: number, cart_item_id: number): Promise<number> {
        // check if cart item exists
        const cart_item: CartItem | null = await CartItemDAO.getById(cart_item_id);
        if (!cart_item) throw new RequestError(ExceptionType.CART_ITEM_NOT_FOUND);

        // yep...
        const cart: Cart | null = await CartDAO.getByUserId(user_id);
        if (!cart) throw new RequestError(ExceptionType.CART_NOT_FOUND);

        // if cart_id and cart_item's cart_id don't match, throw error
        if (cart_item.cart_id !== cart.id) throw new RequestError(ExceptionType.UNAUTHORIZED);

        // delete cart item
        return await CartItemDAO.delete(cart_item_id);
    }

    async updateCartItem(user_id: number, cart_item_id: number, quantity: number): Promise<void> {
        // check if cart item exists
        const cart_item: CartItem | null = await CartItemDAO.getById(cart_item_id);
        if (!cart_item) throw new RequestError(ExceptionType.CART_ITEM_NOT_FOUND);

        // yep...
        const cart: Cart | null = await CartDAO.getByUserId(user_id);
        if (!cart) throw new RequestError(ExceptionType.CART_NOT_FOUND);

        // if cart_id and cart_item's cart_id don't match, throw error
        if (cart_item.cart_id !== cart.id) throw new RequestError(ExceptionType.UNAUTHORIZED);

        await CartItemDAO.updateQuantity(cart_item_id, quantity);
    }

    async create(user_id: number): Promise<Cart> {
        // two active carts should never exist together but this, again, is for an edge case
        // in case there is already a cart, this should prevent from another cart's creation
        const exists: Cart | null = await CartDAO.getByUserId(user_id);
        if (exists) throw new RequestError(ExceptionType.CART_CONFLICT);

        const cart: Cart = await CartDAO.create(user_id);
        return cart;
    }
}

const CartServiceInst = new CartService;

export default CartServiceInst;
