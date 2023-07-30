const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const defaultItems = [
    { name: "Welcome to your todolist!" },
    { name: "Hit the + button to add a new item." },
    { name: "<-- Hit this to delete an item." }
];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Default list for the homepage
const defaultList = new List({
    name: "Today",
    items: defaultItems
});

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
                res.render("list", { listTitle: defaultList.name, newListItems: items });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(foundList => {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                return list.save();
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

app.post("/", function (req, res) {
    let itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then(foundList => {
                if (!foundList) {
                    // If the custom list doesn't exist, create it with the default items
                    const list = new List({
                        name: listName,
                        items: defaultItems
                    });
                    return list.save();
                } else {
                    // If the custom list already exists, add the new item to it
                    foundList.items.push(item);
                    return foundList.save();
                }
            })
            .then(() => {
                // Redirect to the custom list's route, not to "/"
                res.redirect("/" + listName);
            })
            .catch(err => {
                console.log(err);
                res.redirect("/");
            });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemID)
            .then(() => {
                console.log("successfully deleted checked item");
                res.redirect("/");
            })
            .catch(err => {
                console.log(err);
                res.redirect("/");
            });
    } else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemID } } }
        )
        .then(() => {
            res.redirect("/" + listName);
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
    }
});



app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Starting server at port 3000");
});
