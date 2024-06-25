import CartDAO from '../daos/cart';
import type Cart from '../models/cart';

class CartService {
    async create(user_id: number): Promise<Cart> {
        const cart: Cart = await CartDAO.create(user_id);
        return cart;
    }
}

const CartServiceInst = new CartService;

export default CartServiceInst;
