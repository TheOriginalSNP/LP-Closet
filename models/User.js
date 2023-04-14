const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    newsletter: Boolean,
});

const User = mongoose.model('User', newUserSchema);

module.exports = User;
