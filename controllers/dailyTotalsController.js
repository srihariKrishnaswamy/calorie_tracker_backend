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

export const getPastWeekTotals = asyncHandler(async (req, res) => {
    const {user_id} = req.query
    const [response] = await pool.query(`
    SELECT *
    FROM daily_totals
    WHERE user_id = ?
    ORDER BY daily_total_id DESC
    LIMIT 7;
    `, [user_id])
    console.log("past week's daily_totals get")
    res.status(200).json(response)
})

export const getTodaysTotal = asyncHandler(async (req, res) => {
    const id = req.params.id
    console.log(id)
    const [rows] = await pool.query(`
    SELECT *
    FROM daily_totals
    WHERE daily_total_id = ?
    `, [id])
    console.log("single total get")
    res.status(200).json(rows[0])
})

export const createTotal = asyncHandler(async (req, res) => {
    const {user_id} = req.body
    const [getTimezone] = await pool.query(`
    SELECT timezone
    FROM users
    WHERE user_id = ?
    `, [user_id])
    var timezone = getTimezone[0]['timezone']
    const [desiredCals] = await pool.query(`SELECT target_calories FROM users WHERE user_id = ?`, [user_id])
    var target = desiredCals[0]['target_calories']
    const [result] = await pool.query(`
    INSERT INTO daily_totals (user_id, num_calories, desired_calories, percent, curr_date, timezone)
    VALUES (?, 0, ?, 0, DATE(NOW()), ?)
    `, [user_id, target, timezone])
    const id = result.insertId
    const [rows] = await pool.query(`
    SELECT *
    FROM daily_totals
    WHERE daily_total_id = ?
    `, [id])
    await pool.query(`
    UPDATE users SET current_daily_total_id = ? WHERE user_id = ?
    `, [id, user_id])
    const [updatedUser] = await pool.query(`
    SELECT * FROM users WHERE user_id = ?
    `, [user_id])
    console.log("new daily_total created and user updated")
    res.status(201).json(rows[0])
})

export const deleteTotal = asyncHandler (async (req, res) => {
    const {user_id} = req.body;
    await pool.query(`
    DELETE FROM daily_totals
    WHERE user_id = ?
      AND daily_total_id < (
        SELECT * FROM (
          SELECT daily_total_id
          FROM daily_totals
          WHERE user_id = ?
          ORDER BY daily_total_id DESC
          LIMIT 1 OFFSET 6
        ) AS subquery
      )
    `, [user_id, user_id])
    console.log("irrelavant daily totals deleted")
    res.status(201).json({message: "totals deleted"})
})