const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const app = express();

// Set path to .env
dotenv.config();

// Expose files stored in html-folder to public
app.use(express.static("html"));

app.get("/login", ((req, res) => {
    res.json({hello: "world"})
}))

app.listen(80);
