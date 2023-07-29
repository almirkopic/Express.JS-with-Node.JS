const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
    Item.find({})
        .then(foundItems => {
            if (foundItems.length === 0) {
                return Item.insertMany(defaultItems);
            } else {
                return foundItems;
            }
        })
        .then(items => {
            if (items.length === 0) {
                res.redirect("/");
            } else {
                res.render("list", { listTitle: "Today", newListItems: items });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/", function(req, res) {
    let itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    const checkedItemID = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemID)
        .then(() => {
            console.log("successfully deleted checked item");
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/"); // Redirect on error as well
        });
});


// Define workItems array here
let workItems = [];

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Starting server at port 3000");
});
