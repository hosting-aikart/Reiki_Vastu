import { Router } from 'express';
import { getPublicCatalog } from '../controllers/catalog.controller.js';
import { serveMedia } from '../controllers/media.controller.js';

export const catalogRouter = Router();
catalogRouter.get('/', getPublicCatalog);

export const mediaRouter = Router();
mediaRouter.get('/:id', serveMedia);

export default catalogRouter;
