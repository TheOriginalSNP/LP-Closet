//jshint esversion:6

const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const express = require("express");
const app = express();

const heroTitle = "Check out our new Summer Collection";
const heroMessage = "Get your furry friend ready for summer! Check out our new Summer Selection of stylish dog clothes and accessories today. From cooling vests to trendy bandanas, we've got everything you need to keep your pup looking and feeling great all season long. Shop now and treat your pup to the best summer yet!";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb+srv://KuraiOG:XyHYvVb5Y80KPC6w@cluster0.1nx30vc.mongodb.net/LPCHomeData", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MDB"));

const featuredCardSchema = new mongoose.Schema({
    title: String,
    tag: String,
    image: String
});

const Card = mongoose.model("Card", featuredCardSchema, "FeaturedCards");

app.get('/', async (req, res) => {
    const cards = await Card.find().limit(4);
    res.render("home", {
        content: heroTitle,
        message: heroMessage,
        cards: cards
    });
});

app.post("/", function (req, res) {

});

app.listen(3000, function () {
    console.log("Server 3000 up and running!");
});