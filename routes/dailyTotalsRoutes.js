import express from 'express';
import  {  deleteTotal, getTodaysTotal, getAllDailyTotals, createTotal } from '../controllers/dailyTotalsController.js';

const router = express.Router();

router.route('/')
    .post(createTotal)
    .get(getAllDailyTotals)
    .delete(deleteTotal)

router.route('/:id').get(getTodaysTotal)

export default router;