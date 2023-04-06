//jshint esversion:6

const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const express = require("express");
const app = express();
const https = require("https");
const {
    log
} = require('console');

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

const topCategoryCardSchema = new mongoose.Schema({
    category: String,
    tag: String,
    image: String
});

const newUserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    newsletter: Boolean,
});

const User = mongoose.model('User', newUserSchema);

const Card = mongoose.model("Card", featuredCardSchema, "FeaturedCards");

const TcCard = mongoose.model("TcCard", topCategoryCardSchema, "TopCategoryCards");

function validateForm() {
    const password = document.getElementById('floatingPassword').value;
    const confirmPassword = document.getElementById('floatingConfirmPassword').value;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a symbol');
        return false;
    }

    return true;
}

app.get('/', async (req, res) => {
    const cards = await Card.find().limit(4);
    const tcCards = await TcCard.find().limit(6);
    res.render("home", {
        content: heroTitle,
        message: heroMessage,
        cards: cards,
        tcCards: tcCards
    });
});

app.get("/sign-up", function (req, res) {
    res.render("sign-up");
});

app.post("/", function (req, res) {

});

app.post("/sign-up", async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        newsletter: req.body.newsletter === "on",
    });

    try {
        await newUser.save();
        console.log("User saved to database");
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving user to database");
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Sever 3000 up and running!");
});