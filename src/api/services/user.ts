import UserDAO from '../daos/user';
import UserAlreadyExists from '../exceptions/user_exists';
import UserNotFound from '../exceptions/user_not_found';
import type User from '../models/user';
import bcrypt from 'bcrypt';

class UserService {
    async getAll(): Promise<User[]> {
        const users: User[] = await UserDAO.getAll();
        return users;
    }

    async getById(id: number): Promise<User> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new UserNotFound;
        return user;
    }

    async create(username: string, password: string): Promise<void> {
        const user: User | null = await UserDAO.getByName(username);

        if (user) throw new UserAlreadyExists;
        await UserDAO.create(username, await bcrypt.hash(password, 10));
    }

    async update(id: number, username: string | undefined, password: string | undefined): Promise<void> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new UserNotFound;
        await UserDAO.update(id, username, password);
    }
}

const UserServiceInst = new UserService;

export default UserServiceInst;
