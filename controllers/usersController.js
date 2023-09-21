import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: 'calorietracker'
}).promise()

export const getUsers = asyncHandler(async (req, res) => {
    const {email} = req.query
    const response = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    console.log("user get with email");
    if (response[0].length === 0) {
        res.status(404).json({message: "user not found"})
    }
    res.status(200).json(response[0][0])
})

export const getUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE user_id = ?
    `, [id])
    console.log("single user got")
    res.status(200).json(rows[0])
})

export const createUser = asyncHandler (async (req, res) => {
    const {email, password, first_name, last_name, birth_day, sex, weight, height, target_calories, timezone} = req.body;
    const hashedPwd = await bcrypt.hash(password, 10); 
    const [result] = await pool.query(`
    INSERT INTO users (email, hashedPW, first_name, last_name, birth_day, sex, weight, height, target_calories, timezone, pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [email, hashedPwd, first_name, last_name, birth_day, sex, weight, height, target_calories, timezone, null, null, null, null, null])
    const id = result.insertId

    const [newTotal] = await pool.query(`
    INSERT INTO daily_totals (user_id, num_calories, desired_calories, percent, curr_date, timezone)
    VALUES (?, 0, ?, 0, DATE(NOW()), ?)
    `, [id, target_calories, timezone])
    const dt_id = newTotal.insertId

    await pool.query(`
    UPDATE users SET current_daily_total_id = ? WHERE user_id = ?
    `, [dt_id, id])

    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE user_id = ?
    `, [id])
    console.log("new user created")
    res.status(201).json(rows[0])
})

export const updateUser = asyncHandler (async (req, res) => {
    const {user_id, password, sex, weight, height, target_calories, timezone, pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id} = req.body;
    const hashedPwd = await bcrypt.hash(password, 10); 
    const [result] = await pool.query(`
    UPDATE users
    SET hashedPW = ?, sex = ?, weight = ?, height = ?, target_calories = ?, timezone = ?, pinned_user_1_id = ?, pinned_user_2_id = ?, pinned_user_3_id = ?, pinned_user_4_id = ?, pinned_user_5_id = ?
    WHERE user_id = ?
    `, [hashedPwd, sex, weight, height, target_calories, timezone, pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id, user_id])
    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE user_id = ?
    `, [user_id])
    console.log("user updated")
    res.status(201).json(rows[0])
})

export const deleteUser = asyncHandler (async (req, res) => {
    const {user_id} = req.body;
    await pool.query(`
    DELETE FROM users
    WHERE user_id = ?
    `, [user_id])
    console.log("user deleted")
    res.status(201).json({message: "user deleted"})
})