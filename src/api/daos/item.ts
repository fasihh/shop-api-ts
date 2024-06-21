import { Op } from 'sequelize';
import Item from '../models/item';

class ItemDAO {
    // get item by id
    async getById(id: number): Promise<Item | null> {
        const item: Item | null = await Item.findOne({ where: { id }});
        return item;
    }

    // get all items by name
    async getItemsByName(itemname: string): Promise<Item[]> {
        const items: Item[] = await Item.findAll({
            where: {
                itemname: { [Op.like]: `%${itemname}%` }
            }
        });
        return items;
    }

    // get all items
    async getAll(): Promise<Item[]> {
        const items: Item[] = await Item.findAll();
        return items;
    }

    // create new item
    async create(itemname: string, price: number, description: string | undefined, creatorId: number): Promise<void> {
        await Item.create({
            itemname,
            price,
            description,
            creatorId
        });
    }

    // update item by id
    async update(
        id: number,
        itemname: string | undefined,
        price: number | undefined,
        description: string | undefined,
    ): Promise<void> {
        await Item.update({
            itemname,
            price,
            description
        }, { where: { id }});
    }

    // delete item by id
    async delete(id: number): Promise<void> {
        await Item.destroy({ where: { id } });
    }
}

const ItemDAOInst = new ItemDAO;

export default ItemDAOInst;
