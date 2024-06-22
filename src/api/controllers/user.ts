import { Request, Response, } from 'express';
import UserService from '../services/user';
import type User from '../models/user';
import type { ReturnResponse, RequestParams } from '../types';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';

class UserController {
    async getAll(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing query
        const {
            username,
            limit,
            offset 
        }: RequestParams = req.query;

        // getting users
        const users: User[] = await UserService.getAll(username, limit, offset);

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
        if (isNaN(id)) throw new RequestError(ExceptionType.INVALID_ID);

        // getting user
        const user: User = await UserService.getById(id);

        return res.status(200).json({
            message: 'User fetched successfully',
            user: {
                id: user.id,
                username: user.username,
                timestamps: {
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    }

    async getByName(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing username
        const username: string = req.params.username;

        // getting user
        const user: User = await UserService.getByName(username);

        return res.status(200).json({
            message: 'User fetched successfully',
            user: {
                id: user.id,
                username: user.username,
                timestamps: {
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        })
    }

    async create(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing body
        const { username, password }: { username: string | undefined, password: string | undefined } = req.body;

        if (!username || !password) throw new RequestError(ExceptionType.INVALID_REQUEST);

        // creating user
        const id: number = await UserService.create(username, password);

        return res.status(201).json({
            message: 'User created successfully',
            user_id: id
        });
    }

    async login(req: Request, res: Response): Promise<ReturnResponse> {
        // parsing body
        const { username, password }: { username: string | undefined, password: string | undefined } = req.body;

        if (!username || !password) throw new RequestError(ExceptionType.INVALID_REQUEST);

        const token: string = await UserService.login(username, password);

        return res.status(200).json({
            message: 'Login successful',
            token_type: 'Bearer',
            token
        });
    }

    async updateById(req: Request, res: Response): Promise<ReturnResponse> {
        // getting id from token
        const id: number = req.user?.id;

        // parsing body
        const { username, password }: { username?: string, password?: string } = req.body;
        // updating user
        await UserService.update(id, username, password);

        return res.status(200).json({
            message: 'User updated successfully'
        });
    }

    async deleteById(req: Request, res: Response): Promise<ReturnResponse> {
        const id: number = req.user?.id;
        
        // deleting user
        await UserService.delete(id);

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    }
}

const UserControllerInst = new UserController;

export default UserControllerInst;
