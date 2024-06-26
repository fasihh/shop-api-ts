import { Router } from 'express';
import ItemController from '../controllers/item';
import asyncHandler from '../middlewares/async_handler';
import queryParser from '../middlewares/query_parser';
import paramsParser from '../middlewares/body_params_parser';
import authHandler from '../middlewares/auth_handler';
import idParser from '../middlewares/id_parser';

const router: Router = Router();

/* Item endpoints */

// get all items
router.get('/', queryParser, asyncHandler(ItemController.getAll.bind(ItemController)));

// get item by id
router.get('/id/:id', idParser, asyncHandler(ItemController.getById.bind(ItemController)));

// create item
router.post('/', authHandler, paramsParser, asyncHandler(ItemController.create.bind(ItemController)));

// patch item
router.patch('/:id', authHandler, idParser, paramsParser, asyncHandler(ItemController.update.bind(ItemController)));

// delete item
router.delete('/:id', authHandler, idParser, asyncHandler(ItemController.delete.bind(ItemController)));

export default router;
