import express from 'express'
import cors from 'cors'
import usersRoutes from './routes/usersRoutes.js'
import dailyTotalsRoutes from './routes/dailyTotalsRoutes.js'
import entriesRoutes from './routes/entriesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import corsOptions from './config/corsOptions.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

const PORT = 8080

const app = express()
// app.set('trust proxy', true); // for dev
app.use(express.json())
app.use(cookieParser()) 
app.use(cors(corsOptions))

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/dailytotals', dailyTotalsRoutes)
app.use('/entries', entriesRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!")
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`The server is running on port ${process.env.PORT}`)
})