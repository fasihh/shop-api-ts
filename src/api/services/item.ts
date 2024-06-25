import { Op } from 'sequelize';
import ItemDAO from '../daos/item';
import Item from '../models/item';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';
import User from '../models/user';

class ItemService {
    async getAll(itemname: string | undefined, limit: number | undefined, offset: number | undefined): Promise<Item[]> {
        const items: Item[] = await ItemDAO.getAll({
            where: {
                ...(itemname && {
                    itemname: {
                        [Op.like]: `%${itemname}%`
                    }
                })
            },
            limit,
            offset
        });
        return items;
    }

    async getById(id: number): Promise<Item> {
        const item: Item | null = await ItemDAO.getById(id, {
            include: [{
                model: User,
                as: 'creator'
            }]
        });
        if (!item) throw new RequestError(ExceptionType.ITEM_NOT_FOUND);

        return item;
    }

    async create(itemname: string, price: number, creator_id: number, description?: string): Promise<Item> {
        const item: Item = await ItemDAO.create(
            itemname,
            price,
            description,
            creator_id
        );
        return item;
    }

    async update(
        creator_id: number,
        id: number,
        itemname: string | undefined,
        price: number | undefined,
        description: string | undefined
    ): Promise<void> {
        const item: Item | null = await ItemDAO.getById(id);
        if (!item) throw new RequestError(ExceptionType.ITEM_NOT_FOUND);

        if (item.creator_id !== creator_id) throw new RequestError(ExceptionType.UNAUTHORIZED);

        await ItemDAO.update(id, itemname, price, description);
    }

    async delete(creator_id: number, id: number): Promise<void> {
        const item: Item | null = await ItemDAO.getById(id);
        if (!item) throw new RequestError(ExceptionType.ITEM_NOT_FOUND);

        if (item.creator_id !== creator_id) throw new RequestError(ExceptionType.UNAUTHORIZED);

        await ItemDAO.delete(id);
    }
}

const ItemServiceInst = new ItemService;

export default ItemServiceInst;
