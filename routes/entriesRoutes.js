import express from 'express';
import  { getAllEntries, deleteEntry, updateEntry, getTodaysEntries, createEntry } from '../controllers/entriesController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();
// router.use(verifyJWT)

router.route('/')
    .post(createEntry)
    .get(getTodaysEntries)
    .patch(updateEntry)
    .delete(deleteEntry)

router.route('/all').get(getAllEntries) // only for development

export default router;