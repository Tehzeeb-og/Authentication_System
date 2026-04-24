const USER_MODEL = require("../models/user.model");
const SESSION_MODEL = require("../models/session.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const saltRounds = 10;
const SECRET_KEY = config.JWT_SECRET;

// REGISTER MIDDLEWARE

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isAvailable = await USER_MODEL.findOne({
      $or: [{ username }, { email }],
    });
    if (isAvailable) {
      return res.status(409).json({
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

    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    const session = await SESSION_MODEL.create({
      user: user._id,
      refreshTokenHash: refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

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
// LOG IN

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await USER_MODEL.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      message: "user not found with this email",
    });
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(404).json({
      message: "email or password is wrong",
    });
  }
  const accessToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const salt = await bcrypt.genSalt(saltRounds);
  const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

  const session = await SESSION_MODEL.create({
    user: user._id,
    refreshTokenHash: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
res.status(200).json({
  message:"Logged in successfully",
  USER:user,
  accessToken
})

};

// GET USER
exports.getUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }

  try {
    const decode = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
      err: error.message,
    });
  }
  const user = await USER_MODEL.findById({ _id: decode.userId });

  res.status(200).json({
    data: user,
  });
};

// REFRESH TOKEN MIDDLEWARE
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
    
    const session = await SESSION_MODEL.findOne({
      user: decode.userId,
      revoke: false,
    });

    if (!session) {
      return res.status(400).json({
        message: "Invalid refresh Token",
      });
    }
    const compareRefreshTokenHash = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!compareRefreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign({ userId: decode.userId }, SECRET_KEY, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign({ userId: decode.userId }, SECRET_KEY, {
      expiresIn: "7d",
    });
    const salt = await bcrypt.genSalt(saltRounds);
    const NewrefreshTokenHash = await bcrypt.hash(newRefreshToken, salt);
    session.refreshTokenHash = NewrefreshTokenHash;
    await session.save();

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

// LOG OUT MIDDLEWARE

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
      err: error.message,
    });
  }

  const session = await SESSION_MODEL.findOne({
    user: decoded.userId,
    revoke: false,
  });
  if (!session) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
  const compareRefreshToken = await bcrypt.compare(
    refreshToken,
    session.refreshTokenHash,
  );
  if (!compareRefreshToken) {
    return res.status(401).json({
      message: "uncomparedable Token",
    });
  }

  session.revoke = true;
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({
    compareRefreshToken,
    data2: session,
    message: "Logged out successfully",
  });
};

exports.logoutAll = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  const decode = jwt.verify(refreshToken, SECRET_KEY);

  const session = await SESSION_MODEL.updateMany(
    {
      user: decode.userId,
      revoke: false,
    },
    { revoke: true },
  );
  res.status(200).json({
    message: "Log-out from all devices",
  });
};
