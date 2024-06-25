import Cart from "../models/cart";

class CartDAO {
    

    async create(user_id: number): Promise<Cart> {
        const cart: Cart = await Cart.create({ user_id });
        return cart;
    }
}

const CartDAOInst = new CartDAO;

export default CartDAOInst;
