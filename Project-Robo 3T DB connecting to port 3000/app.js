const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/WikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", async (req, res) => {
    try {
        const foundArticles = await Article.find();
        res.send(foundArticles);
    } catch (err) {
        res.status(500).json({ message: "Error fetching articles" });
    }
});

app.post("/articles", async (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    try {
        await newArticle.save();
        res.send("Successfully added a new article.");
    } catch (err) {
        res.send(err);
    }
});


app.listen(3000, function () {
    console.log("server started on port 3000");
});
