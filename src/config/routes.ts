import { Express } from 'express';
import UserRoutes from '../api/routes/user';
import ItemRoutes from '../api/routes/item';

const setupRoutes = (app: Express) =>
    app.use('/users', UserRoutes)
       .use('/items', ItemRoutes)

export default setupRoutes;
