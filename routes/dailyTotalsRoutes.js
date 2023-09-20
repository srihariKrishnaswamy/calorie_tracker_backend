import express from 'express';
import  {  deleteTotal, getTodaysTotal, getPastWeekTotals, createTotal } from '../controllers/dailyTotalsController.js';

const router = express.Router();

router.route('/')
    .post(createTotal)
    .get(getPastWeekTotals)
    .delete(deleteTotal)

router.route('/:id').get(getTodaysTotal)

export default router;