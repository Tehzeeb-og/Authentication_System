const express = require('express');
const controller = require('../controllers/auth.controller')

const Routes = express.Router()

Routes.post('/register',controller.register)
Routes.post('/login',controller.logIn)
Routes.get('/get-me',controller.getUser)
Routes.get('/refresh',controller.refresh)
Routes.get('/logout',controller.logout)
Routes.get('/logout-all',controller.logoutAll)
Routes.post('/verify-email',controller.verifyEmail)


module.exports = Routes