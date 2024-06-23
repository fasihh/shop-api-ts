import { InferAttributes, InferCreationAttributes, Model, CreationOptional, ForeignKey, DataTypes } from "sequelize";
import User from "./user";
import sequelize from "../../config/db";

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
    declare id: CreationOptional<number>;
    declare itemname: string;
    declare price: number;
    declare description: CreationOptional<string>;
    declare creator_id: ForeignKey<User['id']>;
    declare creator?: User;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        itemname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        creator_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
        }
    },
    {
        sequelize,
        tableName: 'items'
    }
);

Item.belongsTo(User, {
    foreignKey: 'creator_id',
    onDelete: 'CASCADE',
    as: 'creator'
});

// User.hasMany(Item, {
//     foreignKey: 'creator_id',
//     onDelete: 'CASCADE'
// });

export default Item;
