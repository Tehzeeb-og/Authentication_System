const express = require('express');
const controller = require('../controllers/auth.controller')

const Routes = express.Router()

Routes.post('/register',controller.register)
Routes.get('/get-me',controller.getUser)


module.exports = Routes