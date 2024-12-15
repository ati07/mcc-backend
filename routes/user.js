import { Router } from 'express';
import { deleteUser, getUsers, editUserDetails, addUser } from '../controllers/user.js';
import auth from '../middleware/auth.js';

const userRouter = Router();

// userRouter.post('/', auth, addUser)
userRouter.get('/', auth, getUsers);
// userRouter.patch('/:userId', auth, deleteUser);
// userRouter.put('/:userId', auth, editUserDetails);
// userRouter.patch('/status/:userId', auth, editUserDetails);


export default userRouter;
