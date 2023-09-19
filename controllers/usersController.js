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
    const response = await pool.query("SELECT * FROM users");
    console.log("all users get")
    res.status(200).json(response[0])
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
    const [result] = await pool.query(`
    INSERT INTO users (email, hashedPW, first_name, last_name, birth_day, sex, weight, height, target_calories, timezone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [email, password, first_name, last_name, birth_day, sex, weight, height, target_calories, timezone])
    const id = result.insertId
    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE user_id = ?
    `, [id])
    console.log("new user created")
    res.status(201).json(rows[0])
})

export const updateUser = asyncHandler (async (req, res) => {
    const {user_id, password, sex, weight, height, target_calories, timezone, current_daily_total_id, pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id} = req.body;
    const [result] = await pool.query(`
    UPDATE users
    SET hashedPW = ?, sex = ?, weight = ?, height = ?, target_calories = ?, timezone = ?, current_daily_total_id = ?, pinned_user_1_id = ?, pinned_user_2_id = ?, pinned_user_3_id = ?, pinned_user_4_id = ?, pinned_user_5_id = ?
    WHERE user_id = ?
    `, [password, sex, weight, height, target_calories, timezone, current_daily_total_id, pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id, user_id])
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