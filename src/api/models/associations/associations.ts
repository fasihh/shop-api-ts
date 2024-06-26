import Cart from "../cart";
import CartItem from "../cart_item";
import User from "../user";
import Item from "../item";

const setupAssociations = () => {
    Item.belongsTo(User, {
        foreignKey: 'creator_id',
        onDelete: 'CASCADE',
        as: 'creator'
    });
    
    Cart.hasMany(CartItem, {
        foreignKey: 'cart_id',
        onDelete: 'CASCADE',
        as: 'items'
    });
    
    Cart.belongsTo(User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
    });
    
    CartItem.belongsTo(Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE'
    });
}

export default setupAssociations;
