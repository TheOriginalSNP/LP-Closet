//jshint esversion:6


const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");
const express = require("express");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




app.get("/", function (req, res) {
    res.render("home")
});

app.post("/", function (req, res) {

});

app.listen(3000, function () {
    console.log("Sever 3000 up and running!");
});