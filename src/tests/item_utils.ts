import request, { Response } from 'supertest';
import type { TestItem } from '../api/types';
import app from '../app';

export const items: { [key: string]: TestItem } = {
    item: {
        itemname: 'test_item',
        price: 7.27
    }
};

export const createItem = async (test_item: TestItem, auth_token: string | undefined): Promise<Response> => {
    const response = await request(app)
    .post('/items')
    .set({
        Authorization: auth_token    
    })
    .send({
        ...test_item
    });

    return response;
}
