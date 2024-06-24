import User from "../models/user";
import jwt, { JwtPayload } from 'jsonwebtoken';
import redis from '../../config/redis';

import dotenv from 'dotenv';
dotenv.config();

class TokenService {
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
    async blacklist(id: number): Promise<void> {
        await redis.set(`blacklist_${id}`, 'true', {
            // set expiry as refresh token's
            // done so that it expires exactly when or after the refresh token expires
            EX: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY || '86400')
        });
    }

    async isBlacklisted(id: number): Promise<boolean> {
        const isBlacklisted: string | null = await redis.get(`blacklist_${id}`);
        // this isn't really needed since anything that exists, regardless of value, is blacklisted 
        return isBlacklisted === 'true';
    }
}

const TokenServiceInst = new TokenService;

export default TokenServiceInst;
