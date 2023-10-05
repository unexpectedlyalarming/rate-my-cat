//Profiles are for a user
const express = require("express");
const router = express.Router();
const cat = require("../models/Cat");
const user = require("../models/User");
const verifyToken = require("./auth");
const review = require("../models/Rating");

//Get all users

router.get("/", async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one user by userId

router.get("/:userId", async (req, res) => {
  try {
    const users = await user.findById(req.params.userId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get user profile (Fetch user, and all cats, posts, and reviews associated with user)

router.get("/profile/:userId", async (req, res) => {
  try {
    const users = await user.findById(req.params.userId);
    const cats = await cat.find({ userId: req.params.userId });
    const reviews = await review.find({ userId: req.params.userId });
    res.status(200).json({ users, cats, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update user profile (Only allow bio and profile picture to be updated)

router.patch("/profile/:userId", async (req, res) => {
  try {
    const users = await user.findById(req.params.userId);
    //Check for bio
    if (req.body.bio) {
      users.bio = req.body.bio;
    }
    //Check for profile picture
    if (req.body.image) {
      users.image = req.body.image;
    }
    await users.save();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
