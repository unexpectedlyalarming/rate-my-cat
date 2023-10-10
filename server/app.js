//Create an express app with authentication
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const secretCode = require("./secretCode");

app.use(morgan("tiny"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
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

app.use(
  session({
    secret: secretCode,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
//Routes

//Register and login routes

app.use("/auth", require("./routes/auth"));

//Verify token middleware
const verifyToken = require("./routes/verifyToken");

//Post routes

app.use("/posts", verifyToken, require("./routes/posts"));

//Rating routes

app.use("/ratings", verifyToken, require("./routes/ratings"));

//Profile routes

app.use("/users", verifyToken, require("./routes/users"));

//Cat routes

app.use("/cats", verifyToken, require("./routes/cats"));

//Leaderboard routes

app.use("/leaderboard", verifyToken, require("./routes/leaderboard"));

//Start the server
app.listen(4005, () => {
  console.log("Server has started");
});
