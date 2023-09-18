import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "JuiceWrld999",
    database: 'calorietracker'
}).promise()

const response = await pool.query("SELECT * FROM users");
console.log(response[0])