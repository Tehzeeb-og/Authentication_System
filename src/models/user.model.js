const mongoose = require("mongoose");

const User = new mongoose.Schema({
  username: {
    type: "string",
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
  },
  email: {
    type: "string",
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
  },
  password: {
    type: "string",
    required: [true, "Username is required"],
  },
  verified:{
    type:"boolean",
    default:false
  }
});

const userSchema = mongoose.model("users",User)

module.exports = userSchema
