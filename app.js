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
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const session = require('express-session');

const heroTitle = "Check out our new Summer Collection";
const heroMessage = "Get your furry friend ready for summer! Check out our new Summer Selection of stylish dog clothes and accessories today. From cooling vests to trendy bandanas, we've got everything you need to keep your pup looking and feeling great all season long. Shop now and treat your pup to the best summer yet!";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'z4xaG98e4d3qJ6Xye8bU5249hA1tC2gW7kQ',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    } // Set the cookie to expire after 24 hours
}));

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
        user: req.session.user, // Pass the user data
        content: heroTitle,
        message: heroMessage,
        cards: cards,
        tcCards: tcCards
    });
});

app.get("/sign-up", function (req, res) {
    res.render('sign-up', { user: req.user });
});

app.get("/log-in", function (req, res) {
    res.render("log-in", {
        user: req.session.user // Pass the user data
    });
});

app.get('/log-out', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.post("/", function (req, res) {

});

app.post("/sign-up", async (req, res) => {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword, // Save the hashed password instead of the plain-text password
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


app.post('/log-in', async (req, res) => {
    try {
        // Find the user by their email address
        const user = await User.findOne({
            email: req.body.email
        });
        // If the user is not found, return an error message
        if (!user) {
            return res.status(400).send('User not found');
        }
        // Compare the submitted password with the hashed password stored in the database
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        // If the password is not valid, return an error message
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }
        // Save user information to the session
        req.session.user = {
            id: user._id,
            firstName: user.firstName
        };
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in');
    }
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Sever 3000 up and running!");
});