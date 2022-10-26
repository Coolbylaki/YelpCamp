const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const port = 3000;
const app = express()
const Campground = require("./models/campground")

// Connect to MongoDB
main().catch(err => console.log(err))
async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelpCamp")
    console.log("Connection open!")
}

// Configure express and ejs
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Home get route
app.get("/", (req, res) => {
    res.render("home")
})

// Test database get route
app.get("/makecampground", async (req, res) => {
    const camp = new Campground({
        title: "My Backyard",
        description: "Cheap camping!"
    })
    await camp.save();
    res.send(camp)
})

// Starting up app on desired port
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})