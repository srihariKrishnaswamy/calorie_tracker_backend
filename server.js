import express from 'express'
import cors from 'cors'
import usersRoutes from './routes/usersRoutes.js'
const app = express()

app.use(express.json())

app.use('/users', usersRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!")
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})