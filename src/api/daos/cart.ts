import { Attributes, FindOptions, Op } from "sequelize";
import Cart from "../models/cart";

class CartDAO {
    async getAll(options?: FindOptions<Attributes<Cart>>): Promise<Cart[]> {
        const carts: Cart[] = await Cart.findAll(options);
        return carts;
    }

    async getByUserId(user_id: number): Promise<Cart | null> {
        const cart: Cart | null = await Cart.findOne({
            where: {
                [Op.and]: {
                    user_id: user_id,
                    checkedOut: false
                }
            }
        });
        return cart;
    }

    async create(user_id: number): Promise<Cart> {
        const cart: Cart = await Cart.create({ user_id });
        return cart;
    }

    async update(cart_id: number, checkedOut?: boolean): Promise<number> {
        const [count]: [affectedCount: number] = await Cart.update({
            checkedOut
        }, { where: { id: cart_id } });
        return count;
    }
}

const CartDAOInst = new CartDAO;

export default CartDAOInst;
