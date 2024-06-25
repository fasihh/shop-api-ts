import { InferAttributes, InferCreationAttributes, Model, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../config/db";
import bcrypt from 'bcrypt';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        }
    },
    {
        sequelize,
        tableName: 'users',
        hooks: {
            beforeCreate: async (user: User, options: unknown) => {
                try {
                    console.log(options);
                    const hashed = await bcrypt.hash(user.password, 10);
                    user.password = hashed;
                } catch(err: unknown) {
                    console.error('Password could not be hashed: ', err);
                }
            }
        }
    }
);

export default User;
