const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config/config")
const USER_MODEL = require("../models/user.model")

exports.verifyAuthUser = async(req,res)=>{

 const accessToken =req.headers.authorization?.split(" ")[1]

 if (!accessToken){
    res.status(401).json({message:"Token not found"})
 }

 const decoded = jwt.verify(accessToken,JWT_SECRET)

 const user = await USER_MODEL.findById({_id:decoded.userId})
 res.status(200).json({
    data:user,
    success:true
 })
 if (!user){
    res.status(404).json({
        message:"user not found"
    })
 }

}