import { Request, Response } from 'express';
import UserService from '../services/user';
import type User from '../models/user';
import InvalidID from '../exceptions/invalid_id';

type ReturnResponse = Response<any, Record<string, any>>;

class UserController {
    async getAll(req: Request, res: Response): Promise<ReturnResponse> {
        // getting users
        const users: User[] = await UserService.getAll();

        // send users
        return res.status(200).json({
            message: 'Users fetched successfully',
            // send count as 0 and 'users' empty if no users
            count: users.length,
            users: users.map((user: User) => ({
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            }))
        });
    }

    async getById(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing id
        const id: number = parseInt(req.params.id);

        // checking if id valid
        if (isNaN(id)) throw new InvalidID;

        // getting user
        const user: User = await UserService.getById(id);

        // 404 if user DNE
        if (!user) return res.status(404).json({
            message: 'User not found'
        });

        // send user
        return res.status(200).json({
            message: 'User fetched successfully',
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            }
        });
    }

    async create(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing body
        const { username, password }: { username: string, password: string } = req.body;

        await UserService.create(username, password);
        return res.status(201).json({ message: 'User created successfully' });
    }

    async updateById(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing id
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) throw new InvalidID;

        // parsing body
        const { username, password }: { username?: string, password?: string } = req.body;
        // updating user
        await UserService.update(id, username, password);

        // success status
        return res.status(200).json({ message: 'User updated successfully' });
    }
}

const UserControllerInst = new UserController;

export default UserControllerInst;
