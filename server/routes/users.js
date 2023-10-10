//Profiles are for a user
const express = require("express");
const router = express.Router();
const Cat = require("../models/Cat");
const User = require("../models/User");
const verifyToken = require("./auth");
const Rating = require("../models/Rating");
const Post = require("../models/Post");
//Get all users

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one user by userId

router.get("/:userId", async (req, res) => {
  try {
    const users = await User.findById(req.params.userId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get user profile (Fetch user, and all cats, posts, and ratings associated with user)

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const cats = await Cat.find({ userId: req.params.userId });
    const ratings = await Rating.find({ userId: req.params.userId });
    //Posts are stored under catId, so we need to find all posts where catId is in cats array
    const posts = await Post.find({ catId: { $in: cats } });
    res.status(200).json({ user, cats, ratings, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update user profile (Only allow bio and profile picture to be updated)

router.patch("/profile/:userId", async (req, res) => {
  try {
    const users = await User.findById(req.params.userId);
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

//TODO: Update password or add email
module.exports = router;
