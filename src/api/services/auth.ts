import User from "../models/user";
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import redis from '../../config/redis';

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
                expiresIn: process.env.JWT_REFRESH_EXPIRY || '1200'
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
                expiresIn: process.env.JWT_ACCESS_EXPIRY || '600'
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

    validate_access(access_token: string): JwtPayload {
        const decoded_access: JwtPayload = jwt.verify(
            access_token,
            process.env.JWT_ACCESS_KEY || 'secret'
        ) as JwtPayload;

        return decoded_access;
    }

    // add user id to blacklist
    async blacklist(token: string): Promise<void> {
        // set expiry as refresh token's
        // done so that it expires exactly when or after the refresh token expires);
        await redis.set(`blacklist_${token}`, 'true', 'EX', parseInt(process.env.JWT_REFRESH_EXPIRY || '1200'));
    }

    // check from blacklist
    async isBlacklisted(token: string): Promise<boolean> {
        const isBlacklisted: string | null = await redis.get(`blacklist_${token}`);
        return isBlacklisted === 'true';
    }
}

const AuthServiceInst = new AuthService;

export default AuthServiceInst;
