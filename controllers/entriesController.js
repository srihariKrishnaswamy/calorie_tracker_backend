import mysql from 'mysql2'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.CURRENT_DB
}).promise()

export const getTodaysEntries = asyncHandler(async (req, res) => {
    const { user_id }= req.query
    const [ getDTID ] = await pool.query(`SELECT current_daily_total_id FROM users WHERE user_id = ?`, [user_id])
    console.log(getDTID)
    const daily_total_id = getDTID[0]['current_daily_total_id']

    const [rows] = await pool.query(`
    SELECT *
    FROM entry
    WHERE daily_total_id = ?
    `, [daily_total_id])
    console.log("Today's entries get")
    res.status(200).json(rows)
})

export const createEntry = asyncHandler(async (req, res) => {
    const {user_id, food_name, description, num_calories} = req.body

    const [gettingDTID] = await pool.query(`
    SELECT current_daily_total_id, timezone
    FROM users
    WHERE user_id = ?
    `, [user_id])

    var daily_total_id = gettingDTID[0]['current_daily_total_id']
    var timezone = gettingDTID[0]['timezone']

    const [result] = await pool.query(`
    INSERT INTO entry (user_id, food_name, description, num_calories, daily_total_id, created_at, timezone)
    VALUES (?, ?, ?, ?, ?, NOW(), ?)
    `, [user_id, food_name, description, num_calories, daily_total_id, timezone])
    const id = result.insertId
    const [rows] = await pool.query(`
    SELECT *
    FROM entry
    WHERE entry_id = ?
    `, [id])
    const [calsPerc] = await pool.query(`
    SELECT num_calories, percent, desired_calories FROM daily_totals
    WHERE daily_total_id = ?
    `, [daily_total_id])
    var cals = calsPerc[0]['num_calories']
    var percent = calsPerc[0]['percent']
    var desiredCals = calsPerc[0]['desired_calories']
    cals += num_calories
    percent = (cals / desiredCals) * 100
    await pool.query(`
    UPDATE daily_totals
    SET num_calories = ?, percent = ?
    WHERE daily_total_id = ?
    `, [cals, percent, daily_total_id])
    const [updatedTotal] = await pool.query(`
    SELECT * FROM daily_totals WHERE daily_total_id = ?
    `, [daily_total_id])
    console.log("new entry created and daily total updated")
    console.log(updatedTotal[0])
    res.status(201).json(rows[0])
})

export const updateEntry = asyncHandler (async (req, res) => {
    const {entry_id, food_name, description, num_calories} = req.body;

    const [verifyExists] = await pool.query(` SELECT * FROM entry WHERE entry_id = ?`, [entry_id])
    if (verifyExists.length === 0) { 
        console.log("tried to modify nonexistent entry")
        res.status(400).json({message: "Entry not found"})
        return
    }

    const [currCals] = await pool.query(`
    SELECT num_calories, daily_total_id FROM entry
    WHERE entry_id = ?
    `, [entry_id])
    var calsNow = currCals[0]['num_calories']
    var daily_total_id = currCals[0]['daily_total_id']

    const [calsPerc] = await pool.query(`
    SELECT num_calories, desired_calories FROM daily_totals
    WHERE daily_total_id = ?
    `, [daily_total_id])
    var cals = calsPerc[0]['num_calories']
    var desiredCals = calsPerc[0]['desired_calories']
    cals -= calsNow
    cals += num_calories
    var newPercent = (cals / desiredCals) * 100
    await pool.query(`
    UPDATE daily_totals
    SET num_calories = ?, percent = ?
    WHERE daily_total_id = ?
    `, [cals, newPercent, daily_total_id])

    const [updatedTotal] = await pool.query(`
    SELECT * FROM daily_totals WHERE daily_total_id = ?
    `, [daily_total_id])

    await pool.query(`
    UPDATE entry
    SET food_name = ?, description = ?, num_calories = ?
    WHERE entry_id = ?
    `, [food_name, description, num_calories, entry_id])
    const [rows] = await pool.query(`
    SELECT *
    FROM entry
    WHERE entry_id = ?
    `, [entry_id])
    console.log("entry & daily total updated")
    console.log(updatedTotal[0])
    res.status(201).json(rows[0])
})

export const deleteEntry = asyncHandler (async (req, res) => {
    const {entry_id} = req.body;

    const [verifyExists] = await pool.query(` SELECT * FROM entry WHERE entry_id = ?`, [entry_id])
    if (verifyExists.length === 0) { 
        console.log("tried to delete nonexistent entry")
        res.status(400).json({message: "Entry not found"})
        return
    }

    const [currCals] = await pool.query(`
    SELECT num_calories, daily_total_id FROM entry
    WHERE entry_id = ?
    `, [entry_id])
    var entryCals = currCals[0]['num_calories']
    var daily_total_id = currCals[0]['daily_total_id']

    const [oldDailyCals] = await pool.query(`
    SELECT num_calories, desired_calories FROM daily_totals
    WHERE daily_total_id = ?
    `, [daily_total_id])
    var calsNow = oldDailyCals[0]['num_calories']
    var desiredCals = oldDailyCals[0]['desired_calories']
    calsNow -= entryCals
    var newPercent = (calsNow / desiredCals) * 100

    await pool.query(`
    UPDATE daily_totals
    SET num_calories = ?, percent = ?
    WHERE daily_total_id = ?
    `, [calsNow, newPercent, daily_total_id])

    const [updatedTotal] = await pool.query(`
    SELECT * FROM daily_totals WHERE daily_total_id = ?
    `, [daily_total_id])

    await pool.query(`
    DELETE FROM entry
    WHERE entry_id = ?
    `, [entry_id])
    console.log("entry deleted and total updated")
    console.log(updatedTotal[0])
    res.status(201).json({message: "entry deleted"})
})