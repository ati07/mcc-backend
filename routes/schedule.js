import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createSchedules, getSchedules } from '../controllers/schedules.js';

const scheduleRouter = Router();

scheduleRouter.post('/', auth, createSchedules);
scheduleRouter.get('/',  getSchedules);

export default scheduleRouter;