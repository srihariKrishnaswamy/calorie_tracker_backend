import express from 'express';
import  { updatePinnedUsers, getAllUsers, updateUser, deleteUser, getUsers, getUser, createUser } from '../controllers/usersController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

router.route('/').post(createUser)

// router.use(verifyJWT)

router.route('/all/').get(getAllUsers)

router.route('/')
    .get(getUsers)
    .delete(deleteUser)
    .patch(updateUser)

router.route('/pinned').patch(updatePinnedUsers)

router.route('/:id').get(getUser)

export default router;