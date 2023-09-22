import express from 'express';
import  { deleteEntry, updateEntry, getTodaysEntries, createEntry } from '../controllers/entriesController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();
// router.use(verifyJWT)

router.route('/')
    .post(createEntry)
    .get(getTodaysEntries)
    .patch(updateEntry)
    .delete(deleteEntry)

export default router;