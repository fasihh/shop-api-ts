import app from '../app';
import { describe, test, expect, beforeAll } from '@jest/globals';
import request, { Response } from 'supertest';
import User from '../api/models/user';

type TestUser = { username: string, password: string, auth_token?: string };

const users: { [key: string]: TestUser } = {
    user1: {
        username: 'TEST_USER1',
        password: 'TEST_PASSWORD1'
    },
    user2: {
        username: 'TEST_USER2',
        password: 'TEST_PASSWORD2'
    },
    updated_user1: {
        username: 'UPDATED_TEST_USER1',
        password: 'UPDATED_TEST_PASSWORD1'
    }
};

beforeAll(async () => {
    await User.destroy({
        where: {
            username: Object.values(users).map((user: TestUser) => user.username)
        }
    });
});

const createUser = async (test_user: TestUser): Promise<Response> => {
    const response: Response = await request(app)
    .post('/users')
    .send({ ...test_user });

    return response;
}

const loginUser = async (test_user: TestUser): Promise<Response> => {
    const response: Response = await request(app)
    .post('/users/login')
    .send({ ...test_user });

    return response;
}

const deleteUser = async (test_user: TestUser): Promise<Response> => {
    const response: Response = await request(app)
    .delete('/users')
    .set({ Authorization: test_user.auth_token });

    return response;
}

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
        const response: Response = await request(app)
        .get('/users')
        .set({
            limit: '2',
            offset: '0'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('users');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('count');
    });
});

describe('Update users', () => {
    // update user with another user's username
    test('Update username of User#1 to username of User#2: should respond with status 409', async () => {
        const response: Response = await request(app)
        .patch('/users')
        .set({ Authorization: users.user1.auth_token })
        .send({ username: users.user2.username });

        expect(response.statusCode).toBe(409);
    });

    // update both values of user1
    test('Update User#1: should respond with status 200', async () => {
        const response: Response = await request(app)
        .patch('/users')
        .set({ Authorization: users.user1.auth_token })
        .send({ ...users.updated_user1 });

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
