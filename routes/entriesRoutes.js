import express from 'express';
import  { deleteEntry, updateEntry, getTodaysEntries, createEntry } from '../controllers/entriesController.js';

const router = express.Router();

router.route('/')
    .post(createEntry)
    .get(getTodaysEntries)
    .patch(updateEntry)
    .delete(deleteEntry)

export default router;