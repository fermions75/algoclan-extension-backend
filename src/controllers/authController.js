// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const generateTokens = (user) => {
  const tokenPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    personaCount: user.personaCount,
    status: user.status,
    userType: user.userType,
    availableRequest: user.availableRequest,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { token, refreshToken };
};

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error registering user");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const { token, refreshToken } = generateTokens(user);

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        personaCount: user.personaCount,
        status: user.status,
        userType: user.userType,
        availableRequest: user.availableRequest,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error logging in");
  }
};

const refreshToken = async (req, res) => {
  const { token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send("Refresh token required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).send("Invalid refresh token");
    }

    const { token, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error refreshing token");
  }
};

export { register, login, refreshToken };
