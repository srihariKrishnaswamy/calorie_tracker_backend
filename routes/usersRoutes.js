import express from 'express';
import  { getUsers, getUser, createUser } from '../controllers/usersController.js';

const router = express.Router();

router.route('/')
    .post(createUser)
    .get(getUsers)

router.route('/:id').get(getUser)

export default router;