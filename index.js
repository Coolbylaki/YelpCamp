const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const port = 3000
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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Home route
app.get("/", (req, res) => {
    res.render("home")
})

// Show campgrounds route
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
})

// New campground get route
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

// New campground post route
app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
})

// Show campground route
app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", { campground })
})

// Edit campground route
app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground })
})

app.put("/campgrounds/:id", async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${id}`)
})

// Starting up app on desired port
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})