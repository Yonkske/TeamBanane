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
mongoose.set('useFindAndModify', false);

// Login functionality+
// Defining the schema for a user
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    projects: {type: Array, "default": []}
});
const User = mongoose.model("User", userSchema);


app.post("/register", async (req, res) => {

    if (await User.findOne({username: req.body.projectname}).exec() === null) {
        const newUser = new User({
            username: req.body.projectname,
            password: req.body.password,
            projects: ['first']
        });

        newUser.save(function (err) {
            if (err) {
                res.status(500).send();
            } else {
                res.status(200).send({});
            }
        });
    } else {
        //res.status(420).send();

        res.send({project: "alreadyexists"});
    }
})


app.get("/register/:projectname", async (req, res) => {


    const foundUser = await User.findOne({username: req.params.projectname}).exec();

    if (foundUser != null) {
        res.send(JSON.stringify(foundUser));
    } else {
        res.send({user: "notfound"});
    }
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
    priority: String
})
const Task = mongoose.model("Task", taskSchema);

// Get all task cards of the project form the database and send them to the client
app.get("/project/:projectname", async (req, res) => {

    const cards = await Task.find().where("project").in(req.params.projectname).exec();
    res.status(200).send(cards);
})

// Update an already existing task card
app.put("/taskcard", async (req, res) => {
    let updatedTask = await Task.findOneAndUpdate({_id: req.body._id}, {
        project: req.body.project,
        column: req.body.column,
        position: req.body.position,
        taskname: req.body.taskname,
        editorname: req.body.editorname,
        duedate: req.body.duedate,
        priority: req.body.priority
    }, {new: true});

    res.status(200).send(JSON.stringify(updatedTask))
})


// Add a new taskcard to the database
app.post("/taskcard", async (req, res) => {
    // TODO: find out how to get the collumn, the project and the position of the taskcard
    const newTaskcard = new Task({
        project: req.body.project,
        column: null,
        position: null,
        taskname: req.body.taskname,
        description: req.body.description,
        editorname: req.body.editorname,
        duedate: Date.parse(req.body.duedate),
        priority: req.body.priority
    })

    newTaskcard.save(function (err) {
        if(err) {
            console.log(err);
            res.status(500).send();
        } else {
            res.status(200).send(JSON.stringify(newTaskcard));
        }
    })
})

// Expose files stored in html-folder to public

app.listen(80);
