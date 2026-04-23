const express = require('express')
const Routing = require('../routes/auth.routes')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')


const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use("/auth",Routing)
module.exports = app