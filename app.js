const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const Joi = require("joi");
const mongoose = require("mongoose");

// Set path to .env
dotenv.config();
const dbCreds = {
    urlStart: process.env.URL_FIRST,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PW,
    urlEnd: process.env.URL_END,
    dbName: process.env.DB_NAME
};

// The url of the database
const url = dbCreds.urlStart + dbCreds.user + ":" + dbCreds.password + dbCreds.urlEnd;
const connection = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true});

// Login functionality+
// Defining the schema for a user
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    projects: {type: Array, "default": []}
});
const User = mongoose.model("User", userSchema);

app.post("/register", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    console.log(newUser);

    User.create(newUser, function (err) {
        if(err) {
            return console.log(err);
        }
    })
})

// Task cards functionality
// Defining the schema for a task
const taskSchema = mongoose.Schema({
    project: String,
    column: String,
    position: Number,
    taskname: String,
    description: String,
    editorname: String,
    duedate: Date,
    priority: Number
})
const Task = mongoose.model("Task", taskSchema);

// Expose files stored in html-folder to public
app.use(express.static("html"));
app.listen(80);
