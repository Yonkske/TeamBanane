const express = require('express');
const dotenv = require('dotenv');
const app = express();

// Set path to .env
dotenv.config({path: '../../.env'});

// Expose files stored in html-folder to public 
app.use(express.static("html"));

console.log("Done");

app.listen(5500);
