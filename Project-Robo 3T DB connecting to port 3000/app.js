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

////////////////Request Targeting all Articles//////////////

app.route("/articles")
    .get(async (req, res) => {
        try {
            const foundArticles = await Article.find();
            res.send(foundArticles);
        } catch (err) {
            res.status(500).json({ message: "Error fetching articles" });
        }
    })
    .post(async (req, res) => {
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
    })
    .delete(async (req, res) => {
        try {
            await Article.deleteMany();
            res.send("Successfully deleted all articles");
        } catch (err) {
            res.send(err);
        }
    });
////////////////Request Targeting a Specific Articles//////////////

app.route("/articles/:articleTitle").get(async (req, res) => {
    try {
        const foundArticle = await Article.findOne({ title: req.params.articleTitle });
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title were found.");
        }
    } catch (err) {
        res.send(err);
    }
});





app.listen(3000, function () {
    console.log("server started on port 3000");
});
