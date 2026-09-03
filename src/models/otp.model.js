const mongoose = require("mongoose");

const otp = new mongoose.Schema({
  email:{
    type:"string",
    required:[true,"Email is required"]
},
user:{ type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "User is required"]
    },
otpHash:{
    type:"string",
    required:[true,"OTP is required"]
},
expiresAt: {
    type: Date,
    required: [true, "OTP expiry time is required"],
    default: () => new Date(Date.now() + 60 * 1000),
  }
},{timestamps:true});

const otpSchema = mongoose.model("otp",otp)

module.exports = otpSchema
