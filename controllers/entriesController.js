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

export const getTodaysEntries = asyncHandler(async (req, res) => {
    const { daily_total_id, user_id }= req.query
    const [rows] = await pool.query(`
    SELECT *
    FROM entry
    WHERE daily_total_id = ?
    AND user_id = ?
    `, [daily_total_id, user_id])
    console.log("Today's entries get")
    res.status(200).json(rows[0])
})

export const createEntry = asyncHandler(async (req, res) => {
    const {user_id, food_name, description, num_calories, daily_total_id, timezone} = req.body
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
    console.log("new entry created")
    res.status(201).json(rows[0])
})

// NEED METHODS FOR
// UPDATE UPDATETOTAL
// DELETE TOTAL
