import { Router } from 'express';
import UserController from '../controllers/user';
import asyncHandler from '../middlewares/async_handler';

import queryParser from '../middlewares/query_parser';
import authHandler from '../middlewares/auth_handler';

const router: Router = Router();

/* User endpoints */

// get all users
router.get('/', queryParser, asyncHandler(UserController.getAll.bind(UserController)));

// get user by id
router.get('/id/:id', asyncHandler(UserController.getById.bind(UserController)));

// get user by name
router.get('/username/:username', asyncHandler(UserController.getByName.bind(UserController)));

// create user
router.post('/', asyncHandler(UserController.create.bind(UserController)));
router.post('/login', asyncHandler(UserController.login.bind(UserController)));

// update user
router.patch('/', authHandler, asyncHandler(UserController.update.bind(UserController)));

// delete user
router.delete('/', authHandler, asyncHandler(UserController.delete.bind(UserController)));

export default router;
