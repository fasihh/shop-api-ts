import { Request, Response } from 'express';
import ItemService from '../services/item';
import { RequestQuery, ReturnResponse } from '../types';
import Item from '../models/item';
import RequestError from '../exceptions/request_error';
import { ExceptionType } from '../exceptions/exceptions';

class ItemController {
    async getAll(req: Request, res: Response): Promise<ReturnResponse> {
        const {
            search,
            limit,
            offset
        }: RequestQuery = req.queryParams;

        const items: Item[] = await ItemService.getAll(search, limit, offset);
        return res.status(200).json({
            message: 'Items fetched successfully',
            count: items.length,
            items: items.map(item => ({
                id: item.id,
                itemname: item.itemname,
                creator_id: item.creator_id
            }))
        })
    }

    async getById(req: Request, res: Response): Promise<ReturnResponse> {
        const id: number = parseInt(req.params.id);

        if (isNaN(id)) throw new RequestError(ExceptionType.INVALID_ID);

        const item: Item = await ItemService.getById(id);
        return res.status(200).json({
            message: 'Item fetched successfully',
            item: {
                id: item.id,
                itemname: item.itemname,
                price: item.price,
                description: item.description,
                creator: {
                    id: item.creator_id,
                    username: item.creator?.username
                },
                timestamps: {
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            }
        });
    }

    async create(req: Request, res: Response): Promise<ReturnResponse> {
        const {
            itemname,
            price,
            description
        }: {
            itemname: string | undefined,
            price: string | undefined,
            description: string | undefined
        } = req.body;

        if (!itemname || !price) throw new RequestError(ExceptionType.INVALID_REQUEST);

        const price_f: number = parseFloat(price);

        if (isNaN(price_f)) throw new RequestError(ExceptionType.INVALID_REQUEST);

        const item: Item = await ItemService.create(itemname, price_f, req.user?.id, description);
        return res.status(201).json({
            message: 'Item created successfully',
            item_id: item.id
        });
    }
}

const ItemControllerInst = new ItemController;

export default ItemControllerInst;
