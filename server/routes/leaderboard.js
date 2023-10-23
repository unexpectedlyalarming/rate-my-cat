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

    const topCats = Cats.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "cat",
          as: "ratings",
        },
      },
      {
        $unwind: "$ratings",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          image: { $first: "$image" },
          ratings: { $push: "$ratings" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          averageRating: {
            $avg: "$ratings.rating",
          },
          numRatings: {
            $size: "$ratings",
          },
        },
      },
      {
        $sort: {
          averageRating: -1,
          numRatings: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json(topCats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
