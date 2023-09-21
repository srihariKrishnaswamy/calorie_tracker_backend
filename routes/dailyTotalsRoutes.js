import express from 'express';
import  {  deleteTotal, getTodaysTotal, getPastWeekTotals, createTotal } from '../controllers/dailyTotalsController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();
router.use(verifyJWT)
router.route('/')
    .post(createTotal)
    .get(getPastWeekTotals)
    .delete(deleteTotal)

router.route('/:id').get(getTodaysTotal)

export default router;