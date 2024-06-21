import UserDAO from '../daos/user';
import type User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';

import dotenv from 'dotenv';

dotenv.config();

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

        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        return user;
    }

    async getByName(username: string): Promise<User> {
        const user: User | null = await UserDAO.getByName(username);

        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        return user;
    }

    // creates a user
    // throws exception if conflict
    async create(username: string, password: string): Promise<void> {
        const user: User | null = await UserDAO.getByName(username);

        if (user) throw new RequestError(ExceptionType.USER_CONFLICT);
        await UserDAO.create(username, await bcrypt.hash(password, 10));
    }

    // logs in user
    // throws Auth failure exceptions
    async login(username: string, password: string): Promise<string> {
        // checking if user exixts
        const user: User | null = await UserDAO.getByName(username);
        if (!user) throw new RequestError(ExceptionType.AUTH_FAILURE);

        // checking password
        const status: boolean = await bcrypt.compare(password, user.password);
        if (!status) throw new RequestError(ExceptionType.AUTH_FAILURE);

        // creating auth token
        const token: string = jwt.sign({
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            },
            process.env.JWT_KEY || 'secret',
            {
                expiresIn: process.env.MODE === 'dev' ? '1y' : '1d'
            }
        );

        return token;
    }

    // updates by id of the username and/or password of the user
    // throws exception if DNE
    async update(id: number, username: string | undefined, password: string | undefined): Promise<void> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        await UserDAO.update(id, username, password);
    }

    // deletes user by id
    // throws exception if DNE
    async delete(id: number): Promise<void> {
        const user: User | null = await UserDAO.getById(id);

        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        await UserDAO.delete(id);
    }
}

const UserServiceInst = new UserService;

export default UserServiceInst;
