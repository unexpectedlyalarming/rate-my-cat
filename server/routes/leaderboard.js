//The leaderboard wil fetch the top cats of the day, month, and all time. The leaderboard will also fetch the top users of the day, month, and all time. The leaderboard will be sorted by average rating.

const express = require("express");
const router = express.Router();
const Cat = require("../models/Cat");
const Rating = require("../models/Rating");
const user = require("../models/User");

// Get top cats by average rating for a specific date range
router.get("/cats/:dateRange", async (req, res) => {
  try {
    const dateRange = req.params.dateRange; // "day", "month", or "all"

    // Calculate the start date based on the date range
    let startDate;
    if (dateRange === "day") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
    } else if (dateRange === "month") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    // Create the pipeline
    //In retrospect, I should've had a ref to ratings in the cat model.
    //This would've made this query much easier, but I'm too lazy to change it now.
    //Get top cats by average rating for a specific date range, weigh by number of ratings

    const topCats = await Cat.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "catId",
          as: "catPosts",
        },
      },
      {
        $unwind: "$catPosts",
      },
      {
        $lookup: {
          from: "ratings",
          localField: "catPosts._id",
          foreignField: "postId",
          as: "ratingDetails",
        },
      },
      {
        $unwind: "$ratingDetails",
      },
      {
        $match: {
          "ratingDetails.date": { $gte: new Date(startDate) },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          averageRating: { $avg: "$ratingDetails.rating" },
          numRatings: { $sum: 1 },
        },
      },
      {
        $sort: { averageRating: -1 },
        $sort: { numRatings: -1 },
      },
      {
        $limit: 10, // Make into a variable later?
      },
    ]);

    res.status(200).json(topCats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
