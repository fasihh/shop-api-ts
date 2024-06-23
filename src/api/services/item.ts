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

        console.log(item);
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
}

const ItemServiceInst = new ItemService;

export default ItemServiceInst;
