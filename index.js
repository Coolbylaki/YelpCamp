const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const port = 3000;
const app = express();

// Configure express and ejs
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


// Home get route
app.get("/", (req, res) => {
    res.render("home")
})

// Starting up app on desired port
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})