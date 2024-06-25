import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/db";
import Item from "./item";
import Cart from "./cart";

class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
    declare id: CreationOptional<number>;
    declare item_id: ForeignKey<Item['id']>;
    declare cart_id: ForeignKey<Cart['id']>;
    declare quantity: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Item,
                key: 'id'
            }
        },
        cart_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Cart,
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'cartItems',
    }
);

export default CartItem;

