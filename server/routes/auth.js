//Self explanatory authentication routes using the user schema

const express = require("express");
const router = express.Router();
const user = require("../models/User");
const jwt = require("jsonwebtoken");

//Function that signs token whenever user is verified, takes in user object
async function giveToken(user) {
  //Signs token with user, expires in 30 minutes
  const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
    expiresIn: 1800,
  });
  req.user = user;
  return token;
}
//Middleware to check if token is valid, reissues token if about to expire

async function verifyToken(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (verified) {
      //If token is about to expire, reissue token
      if (verified.exp - Date.now() / 1000 < 60 * 5) {
        const token = await giveToken(verified);
        res.cookie("accessToken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 30,
        });
      }
      req.user = user.findOne({ username: verified.username });
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

//Register route

router.post("/register", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    //If fields are empty
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    //Check if user exists
    const query = user.findOne({ username: username });
    if (query) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Else, create new user
    const newUser = new User({
      username: username,
      password: password,
    });
    const user = await newUser.save();
    return res.status(200).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Login route

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password === req.body.password) {
      const token = await giveToken(user);
      //Set token as httponly cookie, expires in 30m
      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
      return res.status(200).json({ token: token });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Logout route

router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("accessToken");
    req.user = null;
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
