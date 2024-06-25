import { Router } from 'express';
import asyncHandler from '../middlewares/async_handler';
import CartController from '../controllers/cart';
import authHandler from '../middlewares/auth_handler';

const router: Router = Router();

router.post('/', authHandler, asyncHandler(CartController.create.bind(CartController)));

export default router;
