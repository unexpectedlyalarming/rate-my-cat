//A rating is on a scale of 1-10, with optional descriptions.
const express = require("express");
const router = express.Router();
const rating = require("../models/Rating");
const cat = require("../models/Cat");
const user = require("../models/User");
const verifyToken = require("./auth");

//Get all ratings

router.get("/", async (req, res) => {
  try {
    const ratings = await rating.find();

    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all ratings by catId

router.get("/cat/:catId", async (req, res) => {
  try {
    const ratings = await rating.find({ catId: req.params.catId });
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all ratings by userId

router.get("/user/:userId", async (req, res) => {
  try {
    const ratings = await rating.find({ userId: req.params.userId });
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one rating by ratingId

router.get("/:ratingId", async (req, res) => {
  try {
    const ratings = await rating.findById(req.params.ratingId);
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create new rating

router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const catId = req.body.catId;
    //Check if catId is owned by userid
    const currentCat = await cat.findById(catId);
    if (currentCat.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const rating = req.body.rating;
    const comment = req.body.comment;

    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 10" });
    }

    const newRating = new rating({
      userId: userId,
      catId: catId,
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
    const rating = await rating.findById(ratingId);
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
    await rating.save();
    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete rating

router.delete("/:ratingId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const ratingId = req.params.ratingId;
    const rating = await rating.findById(ratingId);
    //Check if ratingId is owned by userid
    if (rating.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await rating.remove();
    res.status(200).json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
