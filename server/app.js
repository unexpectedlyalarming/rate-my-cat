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

const dotenv = require("dotenv");
dotenv.config();



const PORT = process.env.PORT || 4011;
const dbUsername = process.env.DB_USERNAME || null;
const dbPassword = process.env.DB_PASSWORD || null;
const dbName = process.env.DB_NAME || "rate-my-cat";

const corsOrigin = process.env.CORS_ORIGIN || "https://cats.elynch.co";

const dbURI = dbUsername && dbPassword ? `mongodb://${dbUsername}:${dbPassword}@localhost:27017/${dbName}` : `mongodb://localhost:27017/${dbName}`;

const secretCode = process.env.SECRET_CODE 

app.use(morgan("tiny"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

//Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,

    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    AccessControlAllowHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(
  session({
    secret: secretCode,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));

app.use(cookieParser());

//Routes

//Register and login routes

app.use("/auth", require("./routes/auth"));

//Verify token middleware
const verifyToken = require("./routes/verifyToken");
app.use(verifyToken);

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

//Reactions routes

app.use("/reactions", verifyToken, require("./routes/reactions"));

//Start the server
app.listen(4011, () => {
  console.log("Server has started");
});
