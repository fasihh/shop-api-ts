import { describe, test, afterAll, expect } from '@jest/globals'; 
import { createUser, loginUser, deleteUser, users } from "./user_utils";
import { createItem, items } from "./item_utils";
import Item from '../api/models/item';

afterAll(async () => {
    Item.destroy({
        where: {
            itemname: Object.values(items).map(item => item.itemname)
        }
    });
});

describe('Create a user, login and delete it', () => {
    test('Creates user: should respond with status 201', async () => {
        const response = await createUser(users.user3);

        expect(response.statusCode).toBe(201);
    });

    test('Login user: should respond with status 200', async () => {
        const response = await loginUser(users.user3);
        users.user3.auth_token = `${response.body.token_type} ${response.body.token}`

        expect(response.statusCode).toBe(200);
    });

    test('Deletes user: should respond with status 200', async () => {
        const response = await deleteUser(users.user3);

        expect(response.statusCode).toBe(200);
    });

    test('Create an item using the deleted user\'s access token: should respond with status 403', async () => {
        const response = await createItem(items.item, users.user3.auth_token);

        expect(response.statusCode).toBe(403);
    });
});
