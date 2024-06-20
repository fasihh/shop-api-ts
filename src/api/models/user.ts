import { InferAttributes, InferCreationAttributes, Model, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/db";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare createdAt: CreationOptional<Date>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: DataTypes.DATE
    },
    {
        sequelize,
        tableName: 'users',
        updatedAt: false
    }
);

export default User;
