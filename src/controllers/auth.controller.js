const USER_MODEL = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config =require('../config/config')
const saltRounds = 10
const SECRET_KEY =config.JWT_SECRET



exports.register=async(req,res)=>{
    try {
const {username,email,password}=req.body

        const isAvailable = await USER_MODEL.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if (isAvailable){
            res.status(409).json({
                message:"Email or Username is already exist"
            })
        }

const salt = await bcrypt.genSalt(saltRounds)
const hashedPassword = await bcrypt.hash(password,salt)
const user = await USER_MODEL.create({
           username:username,
           email:email,
           password:hashedPassword
        })
const token = jwt.sign({userId:user._id},SECRET_KEY,{expiresIn:'1d'})

res.status(201).json({
    message:"user registered successfully",
    user:user,
    token
})
} catch (error) {
    res.status(500).json({
        message:"unable to register user",
        err:error.message

    })
        
    }
}

exports.getUser = async (req,res)=>{
    const token =req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(401).json({
            message:"token not found"
        })
    }

    const decode = jwt.verify(token,SECRET_KEY)
const user = await USER_MODEL.findById({_id:decode.userId})

    res.status(200).json({
        data:user
    })
}