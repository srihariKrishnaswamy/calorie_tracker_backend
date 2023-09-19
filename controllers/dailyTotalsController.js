import mysql from 'mysql2'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: 'calorietracker'
}).promise()


export const getAllDailyTotals = asyncHandler(async (req, res) => {
    const response = await pool.query("SELECT * FROM daily_totals");
    console.log("all daily_totals get")
    res.status(200).json(response[0])
})

export const getTodaysTotal = asyncHandler(async (req, res) => {
    const id = req.params.id
    const [rows] = await pool.query(`
    SELECT *
    FROM daily_totals
    WHERE daily_total_id = ?
    `, [id])
    console.log("single total get")
    res.status(200).json(rows[0])
})

export const createTotal = asyncHandler(async (req, res) => {
    const {user_id, desired_calories, timezone} = req.body
    const [result] = await pool.query(`
    INSERT INTO daily_totals (user_id, num_calories, desired_calories, percent, curr_date, timezone)
    VALUES (?, 0, ?, 0, DATE(NOW()), ?)
    `, [user_id, desired_calories, timezone])
    const id = result.insertId
    const [rows] = await pool.query(`
    SELECT *
    FROM daily_totals
    WHERE daily_total_id = ?
    `, [id])
    console.log("new daily_total created")
    res.status(201).json(rows[0])
})

// NEED METHODS FOR
// UPDATE UPDATETOTAL
// DELETE TOTAL
