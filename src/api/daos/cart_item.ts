import CartItem from "../models/cart_item";
import Item from "../models/item";

class CartItemDAO {
    async getById(id: number): Promise<CartItem | null> {
        const cart_item: CartItem | null = await CartItem.findByPk(id);
        return cart_item;
    }

    async getByCartId(cart_id: number): Promise<CartItem[]> {
        const cart_items: CartItem[] = await CartItem.findAll({
            where: {
                cart_id
            },
            include: [{
                model: Item,
                as: 'item'
            }]
        });

        return cart_items;
    }

    async updateQuantity(id: number, quantity: number): Promise<number> {
        const [count]: [affectedCount: number] = await CartItem.update({
            quantity
        }, { where: { id } });
        return count;
    }

    async delete(id: number): Promise<number> {
        const count: number = await CartItem.destroy({ where: { id } });
        return count;
    }

    async create(item_id: number, cart_id: number, quantity: number = 1): Promise<CartItem> {
        const cartItem = await CartItem.create({
            item_id,
            cart_id,
            quantity
        });

        return cartItem;
    }
}

const CartItemDAOInst = new CartItemDAO;

export default CartItemDAOInst;
