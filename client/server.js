const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes');
const User = require('./models/User');

// USER AUTH REQUIREMENTS: //
// const passport = require('./passport');

// Server will run on port 5000 //
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware //
app.use(express.json());

// MongoDB Connection // 
const db = require('./models');
app.use(express.static('static'));

// Route to retrieve all Users from the db //
app.get('/user', function (req, res) {
    // Find all Users
    db.User.find({})
        .then(function (dbUser) {
            // If all Users are successfully found, send them back to the client
            res.json(dbUser);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err `${err}`);
        });
});

// Routes //


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

