import request, { Response } from 'supertest';
import app from '../app';
import type { TestUser } from '../api/types';

export const users: { [key: string]: TestUser } = {
    user1: {
        username: 'TEST_USER1',
        password: 'TEST_PASSWORD1'
    },
    user2: {
        username: 'TEST_USER2',
        password: 'TEST_PASSWORD2'
    },
    user3: {
        username: 'TEST_USER3',
        password: 'TEST_PASSWORD3'  
    },
    updated_user1: {
        username: 'UPDATED_TEST_USER1',
        password: 'UPDATED_TEST_PASSWORD1'
    }
};

export const createUser = async (test_user: TestUser): Promise<Response> => {
    const response: Response = await request(app)
    .post('/users')
    .send({ ...test_user });

    return response;
}

export const loginUser = async (test_user: TestUser): Promise<Response> => {
    const response: Response = await request(app)
    .post('/users/login')
    .send({ ...test_user });

    return response;
}

export const getUsers = async (options?: { limit?: string, offset?: string, username?: string }) => {
    const response: Response = await request(app)
    .get('/users')
    .query({
        username: options?.username,
        limit: options?.limit,
        offset: options?.offset
    });

    return response;
}

export const deleteUser = async (test_user: TestUser): Promise<Response> => {
    const response: Response = await request(app)
    .delete('/users')
    .set({ Authorization: test_user.auth_token });

    return response;
}

export const updateUser = async (current_user: TestUser, new_user: Partial<TestUser>): Promise<Response> => {
    const response: Response = await request(app)
    .patch('/users')
    .set({ Authorization: current_user.auth_token })
    .send({ ...new_user });

    return response;
}
