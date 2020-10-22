const express = require("express");
const app = express();

app.use(express.static("html"));


app.get("/login", ((req, res) => {
    res.json({hello: "world"})
}))

app.listen(80);