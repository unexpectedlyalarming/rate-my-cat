//user schema. Includes information like username, password, profile picture, and reference to cats.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  cats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cat" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});
