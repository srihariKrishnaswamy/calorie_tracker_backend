import express from 'express';
import  { updatePassword, getUsersForTimezone, updatePinnedUsers, getAllUsers, updateUser, deleteUser, getUsers, getUser, createUser } from '../controllers/usersController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

router.route('/').post(createUser)

router.route('/timezone').get(getUsersForTimezone)

router.route('/all/').get(getAllUsers)

// router.use(verifyJWT)

router.route('/')
    .get(getUsers)
    .delete(deleteUser)
    .patch(updateUser)

router.route('/pinned').patch(updatePinnedUsers)
router.route('/password').patch(updatePassword)

router.route('/:id').get(getUser)

export default router;