//The leaderboard wil fetch the top cats of the day, month, and all time. The leaderboard will also fetch the top users of the day, month, and all time. The leaderboard will be sorted by average rating.

const express = require("express");
const router = express.Router();
const cat = require("../models/Cat");
const rating = require("../models/Rating");
const user = require("../models/User");

//Old code, might not be efficient

//Fetch cats for x date
// async function getCats(date) {
//   return async function (req, res, next) {
//     try {
//       const currentDate = new Date();
//       const inputDate = currentDate.setDate(currentDate.getDate() - date);
//       const newDate = new Date(inputDate);
//       const ratings = await rating.find({ createdAt: { $gte: newDate } });
//       const cats = await cat.find({ $in: ratings.catId });
//       const topCats = [];
//       cats.forEach((cat) => {
//         const catRatings = ratings.filter((rating) => rating.catId === cat._id);
//         const catRatingSum = catRatings.reduce((acc, rating) => {
//           return acc + rating.rating;
//         }, 0);
//         const catRatingAverage = catRatingSum / catRatings.length;
//         topCats.push({ cat, catRatingAverage });
//       });
//       topCats.sort((a, b) => b.catRatingAverage - a.catRatingAverage);
//       req.topCats = topCats.slice(0, 10);
//       next();
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
// }
// const oneDayDate = 1;

// const oneMonthDate = 30;

// //Get top cats of the day

// router.get("/cats/day", getCats(oneDayDate), async (req, res) => {
//   try {
//     res.status(200).json(req.topCats);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Get top cats of the month

// router.get("/cats/month", getCats(oneMonthDate), async (req, res) => {
//   try {
//     res.status(200).json(req.topCats);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //Get top cats of all time

// router.get("/cats/all", async (req, res) => {
//   try {
//     const ratings = await rating.find();
//     const cats = await cat.find({ $in: ratings.catId });
//     const topCats = [];
//     cats.forEach((cat) => {
//       const catRatings = ratings.filter((rating) => rating.catId === cat._id);
//       const catRatingSum = catRatings.reduce((acc, rating) => {
//         return acc + rating.rating;
//       }, 0);
//       const catRatingAverage = catRatingSum / catRatings.length;
//       topCats.push({ cat, catRatingAverage });
//     });
//     topCats.sort((a, b) => b.catRatingAverage - a.catRatingAverage);
//     res.status(200).json(topCats.slice(0, 10));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

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
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$catId",
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "cats",
          localField: "_id",
          foreignField: "_id",
          as: "cat",
        },
      },
      {
        $unwind: "$cat",
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          cat: 1,
          averageRating: 1,
        },
      },
    ];

    const topCats = await rating.aggregate(pipeline);

    res.status(200).json(topCats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
