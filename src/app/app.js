const express = require('express')
const Routing = require('../routes/auth.routes')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', // Must exactly match your React app's URL
  credentials: true,               // MUST be true to accept cookies
}));
app.use("/auth",Routing)
module.exports = app