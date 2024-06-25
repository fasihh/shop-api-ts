import { Express } from 'express';
import UserRoutes from '../api/routes/user';
import ItemRoutes from '../api/routes/item';
import CartRoutes from '../api/routes/cart';

const setupRoutes = (app: Express) =>
    app.use('/users', UserRoutes)
       .use('/items', ItemRoutes)
       .use('/carts', CartRoutes)

export default setupRoutes;
