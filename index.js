const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const { campgroundJoiSchema } = require("./schemas")
const { reviewJoiSchema } = require("./schemas")
const port = 3000
const app = express()
const Campground = require("./models/campground")
const Review = require("./models/review")
const asyncWrapper = require("./utilities/asyncWrapper")
const ExpressError = require("./utilities/ExpressError")
const ejsMate = require("ejs-mate")

// Connect to MongoDB
main().catch(err => console.log(err))
async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelpCamp")
    console.log("Connection open!")
}

// Configure express and ejs
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Joi Validation middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Home route
app.get("/", (req, res) => {
    res.redirect("/campgrounds")
})

// Show campgrounds route
app.get("/campgrounds", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))

// New campground get route
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

// New campground post route
app.post("/campgrounds", validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

// Show campground route
app.get("/campgrounds/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews")
    res.render("campgrounds/show", { campground })
}))

// Edit campground get route
app.get("/campgrounds/:id/edit", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground })
}))

// Edit campground put route
app.put("/campgrounds/:id", validateCampground, asyncWrapper(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${id}`)
}))

// Delete campground route
app.delete("/campgrounds/:id", asyncWrapper(async (req, res) => {
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

// Post campground reviews
app.post("/campgrounds/:id/reviews", validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// If all routes don't match throw a 404
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})


// Error middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode)
    res.render("error", { err })
})

// Starting up app on desired port
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})