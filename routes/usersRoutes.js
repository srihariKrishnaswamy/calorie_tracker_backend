import express from 'express';
import  { updateUser, deleteUser, getUsers, getUser, createUser } from '../controllers/usersController.js';

const router = express.Router();

router.route('/')
    .post(createUser)
    .get(getUsers)
    .delete(deleteUser)
    .patch(updateUser)

router.route('/:id').get(getUser)

export default router;