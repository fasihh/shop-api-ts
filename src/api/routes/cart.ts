import { Router } from 'express';
import asyncHandler from '../middlewares/async_handler';
import CartController from '../controllers/cart';
import authHandler from '../middlewares/auth_handler';
import queryParser from '../middlewares/query_parser';
import idParser from '../middlewares/id_parser';

const router: Router = Router();

/* Cart endpoints */

// get current active cart
router.get('/', authHandler, asyncHandler(CartController.getActiveCart.bind(CartController)));

// checkout cart
router.get('/checkout', authHandler, asyncHandler(CartController.checkout.bind(CartController)));

// add item to cart
router.post('/:id', authHandler, idParser, queryParser, asyncHandler(CartController.addToCart.bind(CartController)));

// remove item from cart
router.delete('/:id', authHandler, idParser, asyncHandler(CartController.removeFromCart.bind(CartController)));

// update quantity of cart item
router.patch('/:id', authHandler, idParser, queryParser, asyncHandler(CartController.updateCartItem.bind(CartController)));

export default router;
