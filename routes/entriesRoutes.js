import express from 'express';
import  { getTodaysEntries, createEntry } from '../controllers/entriesController.js';

const router = express.Router();

router.route('/')
    .post(createEntry)
    .get(getTodaysEntries)

export default router;