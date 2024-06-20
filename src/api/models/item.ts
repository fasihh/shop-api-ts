import { InferAttributes, InferCreationAttributes, Model, CreationOptional, ForeignKey, DataTypes } from "sequelize";
import User from "./user";
import sequelize from "../../config/db";

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
    declare id: CreationOptional<number>;
    declare itemname: string;
    declare description: CreationOptional<string>;
    declare creatorId: ForeignKey<User['id']>;
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
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        creatorId: {
            type: DataTypes.INTEGER.UNSIGNED,
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
)