import UserDAO from '../daos/user';
import type User from '../models/user';
import bcrypt from 'bcrypt';
import AuthService from './auth';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';
import { Op } from 'sequelize';

import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';
dotenv.config();

class UserService {
    // gets all users
    async getAll(username: string | undefined, limit: number | undefined, offset: number | undefined): Promise<User[]> {
        const users: User[] = await UserDAO.getAll({
            where: {
                ...(username && {
                    username: {
                        [Op.like]: `%${username}%` 
                    } 
                })
            },
            limit,
            offset
        });
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
    async create(username: string, password: string): Promise<number> {
        const user: User | null = await UserDAO.getByName(username);
        if (user) throw new RequestError(ExceptionType.USERNAME_CONFLICT);

        const hashed: string = await bcrypt.hash(password, 10);
        return (await UserDAO.create(username, hashed)).id;
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

        if (await AuthService.isBlacklisted(user.id)) throw new RequestError(ExceptionType.UNAUTHORIZED);

        // creating auth token
        const token: string = AuthService.generate(user);
        return token;
    }

    // updates by id of the username and/or password of the user
    // throws exception if DNE
    async update(id: number, username: string | undefined, password: string | undefined): Promise<void> {
        let user: User | null = await UserDAO.getById(id);
        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);

        if (username) {
            user = await UserDAO.getByName(username);
            if (user && user.id !== id) throw new RequestError(ExceptionType.USERNAME_CONFLICT);
        }
        
        let hashed: string | undefined = password;
        if (password) hashed = await bcrypt.hash(password, 10);

        await UserDAO.update(id, username, hashed);
    }

    // deletes user by id
    // throws exception if DNE
    async delete(id: number): Promise<void> {
        const user: User | null = await UserDAO.getById(id);
        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);

        await AuthService.blacklist(id);

        await UserDAO.delete(id);
    }
}

const UserServiceInst = new UserService;

export default UserServiceInst;
