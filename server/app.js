//Create an express app with authentication
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bcryptjs = require("bcryptjs");

//Log incoming requests

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/rate-my-cat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const secretCode = bcryptjs.genSaltSync(10);
app.use(
  session({
    secret: secretCode,
    resave: true,
    saveUninitialized: true,
  })
);

//Routes

//Register and login routes

app.use("/auth", require("./routes/auth"));

//Post routes

app.use("/posts", require("./routes/posts"));

//Rating routes

app.use("/ratings", require("./routes/ratings"));

//Profile routes

app.use("/profile", require("./routes/profile"));

//Cat routes

app.use("/cats", require("./routes/cats"));

//Leaderboard routes

app.use("/leaderboard", require("./routes/leaderboard"));

//Start the server
app.listen(5000, () => {
  console.log("Server has started");
});
