//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require ("md5");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", async function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  try {
    await newUser.save();
    res.render("secrets");
  } catch (err) {
    console.log(err);
    res.send("An error occurred while registering the user.");
  }
});

app.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
  
    try {
      const foundUser = await User.findOne({ email: username });
  
      if (foundUser && foundUser.password === password) {
        res.render("secrets");
      } else {
        // User not found or password doesn't match
        res.send("Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      res.send("An error occurred while logging in.");
    }
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
