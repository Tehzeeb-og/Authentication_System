const express = require('express')
const Routing = require('../routes/auth.routes')


const app = express()
app.use(express.json())
app.use("/auth",Routing)

module.exports = app