import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize: Sequelize = new Sequelize(
    process.env.SEQUELIZE_DATABASE as string,
    process.env.SEQUELIZE_USERNAME as string,
    process.env.SEQUELIZE_PASSWORD as string, 
    {
        host: process.env.SEQUELIZE_HOST as string,
        dialect: 'mysql',
        logging: false,
    }
);

export default sequelize;
