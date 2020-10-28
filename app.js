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
const projectSchema = mongoose.Schema({
    project: String,
    password: String
});
const Project = mongoose.model("Project", projectSchema);


app.post("/register", async (req, res) => {

    if (await Project.findOne({project: req.body.projectname}).exec() === null) {
        const newUser = new Project({
            project: req.body.projectname,
            password: req.body.password
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


    const foundUser = await Project.findOne({project: req.params.projectname}).exec();

    if (foundUser != null) {
        res.send(JSON.stringify(foundUser));
    } else {
        res.send({project: "notfound"});
    }
})


// Task cards functionality

// Defining the schema for a task
const taskSchema = mongoose.Schema({
    project: String,
    column: String,
    position: Number,
    taskname: String,
    editorname: String,
    duedate: Date,
    priority: String
})
const Task = mongoose.model("Task", taskSchema);

// Get all task cards of the project form the database and send them to the client
app.get("/taskcard/:projectname", async (req, res) => {

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

// Delete a taskcard from the database
app.delete("/taskcard", async (req, res)=>{
    await Task.findOneAndDelete({_id:req.body._id});
    res.status(200).send();
})


// Add a new taskcard to the database
app.post("/taskcard", async (req, res) => {
    const newTaskcard = new Task({
        project: req.body.project,
        column: null,
        position: null,
        taskname: req.body.taskname,
        editorname: req.body.editorname,
        duedate: Date.parse(req.body.duedate),
        priority: req.body.priority
    })

    newTaskcard.save(function (err) {
        if(err) {
            res.status(500).send();
        } else {
            res.status(200).send(JSON.stringify(newTaskcard));
        }
    })
})

// Expose files stored in html-folder to public

app.listen(80);
