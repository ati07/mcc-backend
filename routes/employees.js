import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createEmployees, deleteEmployees, getEmployees, updateEmployees } from '../controllers/employees.js';


const employeesRouter = Router();
employeesRouter.post('/', auth, createEmployees);
employeesRouter.get('/', auth, getEmployees);
employeesRouter.delete('/:employeesId', auth, deleteEmployees);
employeesRouter.put('/:employeesId', auth, updateEmployees);

export default employeesRouter;