import { describe, test, expect, afterAll } from '@jest/globals';
import type { Response } from 'supertest';
import User from '../api/models/user';
import type { TestUser } from '../api/types';
import { deleteUser, createUser, loginUser, updateUser, getUsers, users } from './user_utils';

afterAll(async () => {
    await User.destroy({
        where: {
            username: Object.values(users).map((user: TestUser) => user.username)
        }
    });
});

describe('Create and Login users', () => {
    test('Creating User#1: should respond with status 201', async () => {
        const response: Response = await createUser(users.user1);
        expect(response.statusCode).toBe(201);
    });
    test('Logging in User#1: should respond with status 200', async () => {
        const response: Response = await loginUser(users.user1);
        expect(response.statusCode).toBe(200);
        users.user1.auth_token = `${response.body.token_type} ${response.body.token}`;
    });

    test('Creating User#2: should respond with status 201', async () => {
        const response: Response = await createUser(users.user2);
        expect(response.statusCode).toBe(201);
    });
    test('Logging in User#2: should respond with status 200', async () => {
        const response: Response = await loginUser(users.user2);
        expect(response.statusCode).toBe(200);
        users.user2.auth_token = `${response.body.token_type} ${response.body.token}`;
    });
});

describe('Get users', () => {
    test('Get all users: should respond with status 200', async () => {
        const response: Response = await getUsers();

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('users');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('count');
    });
});

describe('Update users', () => {
    // update user with another user's username
    test('Update username of User#1 to username of User#2: should respond with status 409', async () => {
        const response: Response = await updateUser(
            users.user1,
            { username: users.user2.username } as TestUser
        );

        expect(response.statusCode).toBe(409);
    });

    // update both values of user1
    test('Update User#1: should respond with status 200', async () => {
        const response: Response = await updateUser(
            users.user1,
            { ...users.updated_user1 } as TestUser
        );

        expect(response.statusCode).toBe(200);
    });
});

describe('Delete users', () => {
    test('Delete User#1: should respond with status 200', async () => {
        const response: Response = await deleteUser(users.user1);

        expect(response.statusCode).toBe(200);
    });

    test('Delete User#2: should respond with status 200', async () => {
        const response: Response = await deleteUser(users.user2);

        expect(response.statusCode).toBe(200);
    });
});
