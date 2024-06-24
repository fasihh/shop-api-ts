import User from "../models/user";
import jwt, { JwtPayload } from 'jsonwebtoken';
import redis from '../../config/redis';

import dotenv from 'dotenv';
dotenv.config();

class AuthService {
    generate(user: User): string {
        const token: string = jwt.sign({
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            },
            process.env.JWT_KEY || 'secret',
            {
                ...(process.env.MODE !== 'dev' && {
                    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '600'
                })
            }
        );
        return token;
    }

    validate(token: string): JwtPayload {
        const decoded: JwtPayload = jwt.verify(
            token,
            process.env.JWT_KEY || 'secret'
        ) as JwtPayload;

        return decoded;
    }

    // add user id to blacklist
    async blacklist(token: string): Promise<void> {
        // set expiry as refresh token's
        // done so that it expires exactly when or after the refresh token expires);
        await redis.set(`blacklist_${token}`, 'true', 'EX', parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY || '86400'));
    }

    // check from blacklist
    async isBlacklisted(token: string): Promise<boolean> {
        const isBlacklisted: string | null = await redis.get(`blacklist_${token}`);
        return isBlacklisted === 'true';
    }
}

const AuthServiceInst = new AuthService;

export default AuthServiceInst;
