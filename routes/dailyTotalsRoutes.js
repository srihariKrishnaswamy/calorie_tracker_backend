import express from 'express';
import  { getTodaysTotal, getAllDailyTotals, createTotal } from '../controllers/dailyTotalsController.js';

const router = express.Router();

router.route('/')
    .post(createTotal)
    .get(getAllDailyTotals)

router.route('/:id').get(getTodaysTotal)

export default router;