//A rating is on a scale of 1-10, with optional descriptions.
const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const Cat = require("../models/Cat");
const User = require("../models/User");
const verifyToken = require("./auth");
const Post = require("../models/Post");
const mongoose = require("mongoose");
//Get all ratings

router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find();

    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all ratings by catId

router.get("/cat/:catId", async (req, res) => {
  try {
    //Have to find all posts by catId, then find all ratings by postId
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all ratings by userId

router.get("/user/:userId", async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId });
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all ratings by postId

router.get("/post/:postId", async (req, res) => {
  try {
    //Aggregate rating, find the username of the userId, and return the rating and username

    const ratings = await Rating.aggregate([
      {
        $match: { postId: new mongoose.Types.ObjectId(req.params.postId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          rating: 1,
          comment: 1,
          _id: 1,
          userId: 1,
          date: 1,
          postId: 1,
          username: "$user.username",
        },
      },
    ]);
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one rating by ratingId

router.get("/:ratingId", async (req, res) => {
  try {
    const ratings = await Rating.findById(req.params.ratingId);
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create new rating

router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.body.postId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 10" });
    }

    const newRating = new Rating({
      userId: userId,
      postId: postId,
      rating: rating,
      comment: comment,
    });
    await newRating.save();
    res.status(200).json(newRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update rating

router.patch("/:ratingId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const ratingId = req.params.ratingId;
    const rating = await Rating.findById(ratingId);
    //Check if ratingId is owned by userid
    if (rating.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Check for rating
    if (req.body.rating) {
      rating.rating = req.body.rating;
    }
    //Check for comment
    if (req.body.comment) {
      rating.comment = req.body.comment;
    }
    await Rating.save();
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete rating

router.delete("/:ratingId", verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const ratingId = req.params.ratingId;
    const rating = await Rating.findById(ratingId);

    //Check if ratingId is owned by userid
    if (rating.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await rating.deleteOne();
    res.status(200).json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
