//Cat schema. Includes information like name, breed, color, age, reference to users, and image.
const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  color: { type: String, required: true },
  age: { type: Number, required: true },
  image: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follower" }],
});

const Cat = mongoose.model("Cat", catSchema);

module.exports = Cat;
