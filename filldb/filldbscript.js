const faker = require("faker");
const mongoose = require("mongoose");
const Cat = require("../server/models/Cat");
const User = require("../server/models/User");
const Rating = require("../server/models/Rating");
const Post = require("../server/models/Post");
const bcrypt = require("bcryptjs");

//Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/rate-my-cat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 5,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedDB();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//Create users

async function createUsers() {
  const users = [];
  for (let i = 0; i < 15; i++) {
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const bio = faker.lorem.paragraph();
    const image = faker.image.avatar();
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hash,
      bio: bio,
      image: image,
    });
    users.push(newUser);
  }
  await User.insertMany(users);
  return users;
}

//Create cats

async function createCats() {
  const cats = [];
  for (let i = 0; i < 15; i++) {
    const name = faker.name.firstName();
    const breed = faker.lorem.word();
    const color = faker.commerce.color();
    const age = faker.datatype.number({ min: 0, max: 30 });
    const image = faker.image.avatar();
    //Get userId from previous operation
    const users = await User.find();
    const date = faker.date.past();
    const userId = users[i]._id;
    const newCat = new Cat({
      name: name,
      image: image,
      breed: breed,
      color: color,
      age: age,
      userId: userId,
      date: date,
    });
    cats.push(newCat);
  }
  await Cat.insertMany(cats);
  return cats;
}

//Create posts

async function createPosts() {
  const posts = [];
  for (let i = 0; i < 15; i++) {
    const title = faker.lorem.words();
    const image = faker.image.url();
    //Get userId from previous operation
    const cats = await Cat.find();
    const catId = cats[i]._id;
    const date = faker.date.past();
    const newPost = new Post({
      title: title,
      image: image,
      catId: catId,
      date: date,
    });
    posts.push(newPost);
  }
  await Post.insertMany(posts);
  return posts;
}

//Create ratings

async function createRatings() {
  const ratings = [];
  for (let i = 0; i < 30; i++) {
    const rating = faker.datatype.number({ min: 1, max: 10 });
    const comment = faker.lorem.paragraph();
    //Get userId and postId from previous operation
    const randomUser = getRandomItemFromArray(await User.find());
    const randomPost = getRandomItemFromArray(await Post.find());
    const userId = randomUser._id;
    const postId = randomPost._id;
    const date = faker.date.past();
    const newRating = new Rating({
      rating: rating,
      comment: comment,
      userId: userId,
      postId: postId,
      date: date,
    });

    ratings.push(newRating);
  }
  await Rating.insertMany(ratings);
  return ratings;
}

function getRandomItemFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

//Run all functions

async function seedDB() {
  try {
    await createUsers();
    await createCats();
    await createPosts();
    await createRatings();
    console.log("Database seeded");
  } catch (err) {
    console.error(err);
  }
}
