import type User from "../models/user";
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserDAO from '../daos/user';
import RequestError from "../exceptions/request_error";
import { ExceptionType } from "../exceptions/exceptions";

import dotenv from 'dotenv';
dotenv.config();

class AuthService {
    generate(user: User): Record<string, string> {
        return {
            access_token: this.generate_access(user),
            refresh_token: this.generate_refresh(user)
        };
    }

    generate_refresh(user: User): string {
        const refresh_token: string = jwt.sign({
                username: user.username
            },
            process.env.JWT_REFRESH_KEY || 'refresh_secret',
            {
                ...(process.env.MODE !== 'dev' && {
                    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
                })
            }
        );
        
        return refresh_token;
    }

    generate_access(user: User): string {
        const access_token: string = jwt.sign({
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            },
            process.env.JWT_ACCESS_KEY || 'access_secret',
            {
                ...(process.env.MODE !== 'dev' && {
                    expiresIn: process.env.JWT_ACCESS_EXPIRY || '10m'
                })
            }
        );
        return access_token;
    }

    validate_refresh(user: User, refresh_token: string): string {
        jwt.verify(
            refresh_token,
            process.env.JWT_REFRESH_KEY || 'refresh_secret'
        ) as JwtPayload;

        const acces_token: string = this.generate_access(user);
        return acces_token;
    }

    async validate_access(access_token: string): Promise<JwtPayload> {
        const decoded_access: JwtPayload = jwt.verify(
            access_token,
            process.env.JWT_ACCESS_KEY || 'access_secret'
        ) as JwtPayload;

        const user: User | null = await UserDAO.getById(decoded_access.id);

        if (!user || user.username !== decoded_access.username) throw new RequestError(ExceptionType.UNAUTHORIZED);

        return decoded_access;
    }

    // add user id to blacklist
    // async blacklist(token: string): Promise<void> {
    //     // set expiry as refresh token's
    //     // done so that it expires exactly when or after the refresh token expires);
    //     await redis.set(`blacklist_${token}`, 'true', 'EX', parseInt(process.env.JWT_REFRESH_EXPIRY || '1200'));
    // }

    // // check from blacklist
    // async isBlacklisted(token: string): Promise<boolean> {
    //     const isBlacklisted: string | null = await redis.get(`blacklist_${token}`);
    //     return isBlacklisted === 'true';
    // }
}

const AuthServiceInst = new AuthService;

export default AuthServiceInst;
