const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const { reviewJoiSchema } = require("./schemas")
const port = 3000
const app = express()
const Campground = require("./models/campground")
const Review = require("./models/review")
const asyncWrapper = require("./utilities/asyncWrapper")
const ExpressError = require("./utilities/ExpressError")
const ejsMate = require("ejs-mate")

const campgrounds = require("./routes/campgrounds")

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

const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.use("/campgrounds", campgrounds)

// Home route
app.get("/", (req, res) => {
    res.redirect("/campgrounds")
})

// Post campground reviews
app.post("/campgrounds/:id/reviews", validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete campground review
app.delete("/campgrounds/:id/reviews/:reviewId", asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
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