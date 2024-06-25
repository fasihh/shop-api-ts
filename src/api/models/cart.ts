import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "./user";

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
    declare id: CreationOptional<number>;
    declare user_id: ForeignKey<User['id']>;
    declare checkedOut?: boolean;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        checkedOut: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'carts',
    }
);

export default Cart;

