import { Router } from 'express';
import UserController from '../controllers/user';
import asyncHandler from '../utils/async_handler';

import authHandler from '../auth/jwtAuth';

const router: Router = Router();

/* User endpoints */

// get all users
router.get('/', asyncHandler(UserController.getAll.bind(UserController)));

// get user by id
router.get('/id/:id', asyncHandler(UserController.getById.bind(UserController)));

// get user by name
router.get('/username/:username', asyncHandler(UserController.getByName.bind(UserController)));

// create user
router.post('/', asyncHandler(UserController.create.bind(UserController)));
router.post('/login', asyncHandler(UserController.login.bind(UserController)));

// update user
router.patch('/', authHandler, asyncHandler(UserController.updateById.bind(UserController)));

// delete user
router.delete('/', authHandler, asyncHandler(UserController.deleteById.bind(UserController)));

export default router;
