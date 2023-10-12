import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
dotenv.config()

const pool = mysql.createPool({
    host: "us-cdbr-east-06.cleardb.net",
    user: "b1d4ddfc60def4",
    password: "40f84ad4",
    database: "heroku_d58c86139c95b3a"
}).promise()

export const getUsersForTimezone = asyncHandler(async (req, res) => {
    const {timezone} = req.query;
    console.log(timezone)
    const [ allUsers ] = await pool.query(`
    SELECT user_id FROM users WHERE timezone = ?
    `, [timezone])
    console.log(allUsers)
    res.status(200).json(allUsers)
})

export const getAllUsers = asyncHandler(async (req, res) => {
    const [ allUsers ] = await pool.query(`
    SELECT * FROM users
    `)
    res.status(200).json(allUsers)
})

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

    const [checkDuplicateEmail] = await pool.query(`
    SELECT * FROM users WHERE email = ?
    `, [email])

    if (checkDuplicateEmail.length > 0) return res.status(400).json({message: "Duplicate email"})

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
    const {user_id, sex, weight, height, target_calories, timezone} = req.body;

    const [currUser] = await pool.query(`
    SELECT * FROM users WHERE user_id = ?
    `, [user_id])
    if (currUser.length === 0) return res.status(400).json({message: "nonexistent user"})

    const [result] = await pool.query(`
    UPDATE users
    SET sex = ?, weight = ?, height = ?, target_calories = ?, timezone = ?
    WHERE user_id = ?
    `, [sex, weight, height, target_calories, timezone, user_id])
    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE user_id = ?
    `, [user_id])
    console.log("user updated")
    res.status(201).json(rows[0])
})

export const updatePassword = asyncHandler (async (req, res) => {
    const {user_id, password} = req.body;

    const [currUser] = await pool.query(`
    SELECT * FROM users WHERE user_id = ?
    `, [user_id])
    if (currUser.length === 0) return res.status(400).json({message: "nonexistent user"})

    const hashedPwd = await bcrypt.hash(password, 10); 
    const [result] = await pool.query(`
    UPDATE users
    SET hashedPW = ?, 
    WHERE user_id = ?
    `, [hashedPwd, user_id])
    const [rows] = await pool.query(`
    SELECT *
    FROM users
    WHERE user_id = ?
    `, [user_id])
    console.log("user updated")
    res.status(201).json(rows[0])
})

export const updatePinnedUsers = asyncHandler (async (req, res) => {
    const {user_id, pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id} = req.body;
    if (pinned_user_1_id) {
        const [pinnedUser1] = await pool.query(`
        SELECT * FROM users WHERE user_id = ?
        `, [pinned_user_1_id])
        if (pinnedUser1.length === 0) return res.status(400).json({message: "Invalid Pinned User 1"})
    }
    if (pinned_user_2_id) {
        const [pinnedUser2] = await pool.query(`
        SELECT * FROM users WHERE user_id = ?
        `, [pinned_user_2_id])
        if (pinnedUser2.length === 0) return res.status(400).json({message: "Invalid Pinned User 2"})
    }
    if (pinned_user_3_id) {
        const [pinnedUser3] = await pool.query(`
        SELECT * FROM users WHERE user_id = ?
        `, [pinned_user_3_id])
        if (pinnedUser3.length === 0) return res.status(400).json({message: "Invalid Pinned User 3"})
    }
    if (pinned_user_4_id) {
        const [pinnedUser4] = await pool.query(`
        SELECT * FROM users WHERE user_id = ?
        `, [pinned_user_4_id])
        if (pinnedUser4.length === 0) return res.status(400).json({message: "Invalid Pinned User 4"})
    }
    if (pinned_user_5_id) {
        const [pinnedUser5] = await pool.query(`
        SELECT * FROM users WHERE user_id = ?
        `, [pinned_user_5_id])
        if (pinnedUser5.length === 0) return res.status(400).json({message: "Invalid Pinned User 5"})
    }
    const [currUser] = await pool.query(`
    SELECT * FROM users WHERE user_id = ?
    `, [user_id])
    if (currUser.length === 0) return res.status(400).json({message: "nonexistent base user"})
    const [result] = await pool.query(`
    UPDATE users
    SET pinned_user_1_id = ?, pinned_user_2_id = ?, pinned_user_3_id = ?, pinned_user_4_id = ?, pinned_user_5_id = ?
    WHERE user_id = ?
    `, [pinned_user_1_id, pinned_user_2_id, pinned_user_3_id, pinned_user_4_id, pinned_user_5_id, user_id])
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