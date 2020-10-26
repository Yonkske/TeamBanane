const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const app = express();
const MongoClient = require('mongodb').MongoClient;

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

// Expose files stored in html-folder to public
app.use(express.static("html"));
app.listen(80);
