//Mongoose model for followers. Followers can only follow a cat.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  catId: {
    type: Schema.Types.ObjectId,
    ref: "Cat",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Follower = mongoose.model("Follower", followerSchema);

module.exports = Follower;
