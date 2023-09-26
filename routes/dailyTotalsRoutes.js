import express from 'express';
import  {  getAllTotals, deleteTotal, getTodaysTotal, getPastWeekTotals, createTotal } from '../controllers/dailyTotalsController.js';
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router();

router.route('/').post(createTotal)

router.route('/all').get(getAllTotals)

// router.use(verifyJWT)

router.route('/')
    .get(getPastWeekTotals)
    .delete(deleteTotal)

router.route('/:id').get(getTodaysTotal)


export default router;