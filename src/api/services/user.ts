import UserDAO from '../daos/user';
import AlreadyExistsException from '../exceptions/already_exists';
import NotFoundException from '../exceptions/not_found';
import type User from '../models/user';
import bcrypt from 'bcrypt';

class UserService {
    // gets all users
    async getAll(): Promise<User[]> {
        const users: User[] = await UserDAO.getAll();
        return users;
    }

    // gets user by id
    // throws exception if DNE
    async getById(id: number): Promise<User> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new NotFoundException('User does not exist');
        return user;
    }

    // creates a user
    // throws exception if conflict
    async create(username: string, password: string): Promise<void> {
        const user: User | null = await UserDAO.getByName(username);

        if (user) throw new AlreadyExistsException('A user with this name already exists');
        await UserDAO.create(username, await bcrypt.hash(password, 10));
    }

    // updates by id of the username and/or password of the user
    // throws exception if already exists
    async update(id: number, username: string | undefined, password: string | undefined): Promise<void> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new NotFoundException('User does not exist');
        await UserDAO.update(id, username, password);
    }

    // deletes user by id
    // throws exception if DNE
    async delete(id: number): Promise<void> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new NotFoundException('User does not exist');
        await UserDAO.delete(id);
    }
}

const UserServiceInst = new UserService;

export default UserServiceInst;
