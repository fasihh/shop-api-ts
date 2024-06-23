import { Router } from 'express';
import ItemController from '../controllers/item';
import asyncHandler from '../utils/async_handler';
import queryParser from '../utils/query_parser';
import authHandler from '../auth/jwtAuth';

const router: Router = Router();

/* Item endpoints */

// get all items
router.get('/', queryParser, asyncHandler(ItemController.getAll.bind(ItemController)));

// get item by id
router.get('/id/:id', asyncHandler(ItemController.getById.bind(ItemController)));

// create item
router.post('/', authHandler, asyncHandler(ItemController.create.bind(ItemController)));

export default router;
