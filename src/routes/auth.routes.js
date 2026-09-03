const express = require('express');
const controller = require('../controllers/auth.controller')
const authController = require('../Middleware/authMiddleware')

const Routes = express.Router()

Routes.post('/register',controller.register)
Routes.post('/login',controller.logIn)
Routes.get('/get-me',authController.verifyAuthUser,controller.getUser)
Routes.get('/refresh',controller.refresh)
Routes.get('/logout',controller.logout)
Routes.get('/logout-all',controller.logoutAll)
Routes.post('/verify-email',controller.verifyEmail)
Routes.post('/resend-otp',controller.resendOtp)


module.exports = Routes