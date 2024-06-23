import { Attributes, FindOptions, Op } from 'sequelize';
import Item from '../models/item';

class ItemDAO {
    // get item by id
    async getById(id: number, options?: FindOptions<Attributes<Item>>): Promise<Item | null> {
        console.log(options);
        const item: Item | null = await Item.findByPk(id, options);
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
    async getAll(options?: FindOptions<Attributes<Item>>): Promise<Item[]> {
        const items: Item[] = await Item.findAll(options);
        return items;
    }

    // create new item
    async create(itemname: string, price: number, description: string | undefined, creator_id: number): Promise<Item> {
        const item: Item = await Item.create({
            itemname,
            price,
            description,
            creator_id
        });
        return item;
    }

    // update item by id
    async update(
        id: number,
        itemname: string | undefined,
        price: number | undefined,
        description: string | undefined,
    ): Promise<number> {
        const [count]: [affectedCount: number] = await Item.update({
            itemname,
            price,
            description
        }, { where: { id }});
        return count;
    }

    // delete item by id
    async delete(id: number): Promise<number> {
        const count: number = await Item.destroy({ where: { id } });
        return count;
    }
}

const ItemDAOInst = new ItemDAO;

export default ItemDAOInst;
