import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: 'calorietracker'
}).promise()

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({message: 'All fields are required'})
    }
    const [getUNPW] = await pool.query(`
    SELECT hashedPW FROM users WHERE email = ?
    `, [email])
    if (getUNPW.length === 0) {
        return res.status(400).json({message: 'Invalid email'})
    }
    var correctPW = getUNPW[0]['hashedPW']
    const match = await bcrypt.compare(password, correctPW)
    if (!match) return res.status(401).json({message: 'wrong password'})
    const accessToken = jwt.sign(
        {
            "UserInfo": { // this info is getting injected into the access token, gotta pull this info outta it in the frontend
                "email": email,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2h'}
    )
    const refreshToken = jwt.sign(
        {"email": email},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // important: only accessible by web server, so its secure
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 // one day
    })
    res.json({accessToken}) // we give react the access token in the front end
    // whenever react sends a request to refresh endpoint, accessToken will come along with it
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' }); // error fires right here
    var email = null;
    var accessToken = null;
    const refreshToken = cookies.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            email = decoded.email
            accessToken = jwt.sign(
                {
                    UserInfo: {
                        email: decoded.email
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '2h' }
            );
        }
    );
    const [verifyEmail] = await pool.query(`
    SELECT email FROM users WHERE email = ?
    `, [email])
    console.log(verifyEmail)
    if (verifyEmail.length === 0) return res.status(402).json({message: "Invalid token email"})
    res.json({ accessToken });
});


// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'None', 
        secure:false
    })
    res.json({message: 'Cookie cleared'}) // by default a 200 status msg
}

export default {logout, refresh, login}