//Self explanatory authentication routes using the user schema

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const jwtKey = process.env.SECRET_CODE;

//Function that signs token whenever user is verified, takes in user object
async function giveToken(user) {
  try {
    const token = jwt.sign({ user: user }, jwtKey, {
      expiresIn: 1800,
    });
    return token;
  } catch (err) {
    return new Error(err.message);
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
    //Check if username already exists
    const queryUser = await User.findOne({ username: username });
    if (queryUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    //Username must be 5 characters
    if (username.length < 5) {
      return res
        .status(400)
        .json({ message: "Username must be at least 5 characters" });
    }

    //Password must be 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //Encrypt password

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      const newUser = new User({
        username: username,
        password: hash,
      });
      await newUser.save();
      return res.status(200).json({ message: "User created" });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Login route

router.post("/login", async (req, res) => {
  try {
    // Find user by username, case insensitive
    const user = await User.findOne({
      username: { $regex: new RegExp("^" + req.body.username + "$", "i") },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    bcrypt.compare(req.body.password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result) {
        const newUser = {
          username: user.username,
          id: user._id,
          image: user.image,
        };
        const token = await giveToken(newUser);
        //Set token as httponly cookie, expires in 30m
        res.cookie("accessToken", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 30,
        });
        req.user = newUser;
        //Return token, and user object that contains basic user info (username, id, profile picture)
        return res.status(200).json({
          cookies: req.cookies,
          user: newUser,
        });
      } else {
        return res.status(400).json({ message: "Incorrect password" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Logout route

router.get("/logout", async (req, res) => {
  try {
    //set cookie to expire immediately

    res.cookie("accessToken", "", { maxAge: 1 });
    res.clearCookie("accessToken");
    req.user = null;
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Validate session (check if user is already logged in)

router.get("/validate-session", async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      console.log("no token");
      return res.status(401).json();
    }
    const decoded = jwt.verify(token, jwtKey);

    const user = decoded?.user;
    if (!user) {
      return res.status(401).json();
    }

    return res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
