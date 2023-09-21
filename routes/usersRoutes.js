import express from 'express';
import  { updateUser, deleteUser, getUsers, getUser, createUser } from '../controllers/usersController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

router.route('/').post(createUser)

router.use(verifyJWT)

router.route('/')
    .get(getUsers)
    .delete(deleteUser)
    .patch(updateUser)

router.route('/:id').get(getUser)

export default router;