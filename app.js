const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const Joi = require("joi");
const mongoose = require("mongoose");

// Set path to .env
dotenv.config();
app.use(express.static("html"));
app.use(express.json());

const dbCreds = {
    urlStart: process.env.URL_FIRST,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PW,
    urlMiddle: process.env.URL_MIDDLE,
    dbName: process.env.DB_NAME,
    urlEnd: process.env.URL_END
};

// The url of the database
const url = dbCreds.urlStart + dbCreds.user + ":" + dbCreds.password + dbCreds.urlMiddle + dbCreds.dbName + dbCreds.urlEnd;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

// Login functionality+
// Defining the schema for a user
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    projects: {type: Array, "default": []}
});
const User = mongoose.model("User", userSchema);


app.post("/register", async (req, res) => {

    if(await User.findOne({username: req.body.username}).exec() === null) {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            projects: ['first']
        });

        newUser.save(function (err) {
            if (err) {
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });
    } else {
        res.status(420).send();
    }
})


app.get("/register", async (req, res) => {

    let foundUser = User.findOne({username: req.body.username}).exec();
    res.json(foundUser);

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

app.listen(80);
