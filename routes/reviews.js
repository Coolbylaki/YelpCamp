const express = require("express")
const router = express.Router({ mergeParams: true })
const asyncWrapper = require("../utilities/asyncWrapper")
const Review = require("../models/review")
const Campground = require("../models/campground")
const { validateReview } = require("../middleware")

// Post campground reviews
router.post("/", validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("success", "Created new review!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete campground review
router.delete("/:reviewId", asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Successfully deleted review!")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router