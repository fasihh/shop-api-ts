import { Attributes, FindOptions } from 'sequelize';
import User from '../models/user';

class UserDAO {
    // find user by id
    async getById(id: number): Promise<User | null> {
        const user: User | null = await User.findOne({ where: { id } });
        return user;
    }

    // find user by name
    async getByName(username: string): Promise<User | null> {
        const user: User | null = await User.findOne({ where: { username } });
        return user;
    }

    // get all users
    async getAll(options?: FindOptions<Attributes<User>>): Promise<User[]> {
        const users: User[] = await User.findAll(options);
        return users;
    }

    // create a user record
    async create(username: string, password: string): Promise<User> {
        const user: User = await User.create({
            username,
            password
        });
        return user;
    }

    // update user by id
    async update(id: number | undefined, username: string | undefined, password: string | undefined): Promise<number> {
        const [count]: [affectedCount: number] = await User.update({
            username,
            password
        }, { where: { id } });
        return count;
    }

    // deletes user by id
    async delete(id: number): Promise<number> {
        const count: number = await User.destroy({ where: { id } });
        return count;
    }
}

const UserDAOInst = new UserDAO;

export default UserDAOInst;
