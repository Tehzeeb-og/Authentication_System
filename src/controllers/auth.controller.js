const USER_MODEL = require("../models/user.model");
const SESSION_MODEL = require("../models/session.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const saltRounds = 10;
const SECRET_KEY = config.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isAvailable = await USER_MODEL.findOne({
      $or: [{ username }, { email }],
    });
    if (isAvailable) {
      res.status(409).json({
        message: "Email or Username is already exist",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await USER_MODEL.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    
    const refreshToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken,salt)
    const session = await SESSION_MODEL.create({
        user:user._id,
    refreshTokenHash: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    })
    const accessToken = jwt.sign({ userId: user._id,
    sessionId:session._id}, SECRET_KEY, {
      expiresIn: "15m",
    });

    res.cookie("refreshToken", refreshToken);

    res.status(201).json({
      message: "user registered successfully",
      user: user,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "unable to register user",
      err: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }

  const decode = jwt.verify(token, SECRET_KEY);
  const user = await USER_MODEL.findById({ _id: decode.userId });

  res.status(200).json({
    data: user,
  });
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accesToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "refresh token not found",
      });
    }

    const decode = jwt.verify(refreshToken, SECRET_KEY);

    const newAccessToken = jwt.sign({ userId: decode.userId }, SECRET_KEY, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign({ userId: decode.userId }, SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("refreshToken", newRefreshToken);

    res.status(200).json({
      message: "Token refreshed successfully",
      accesToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
