const express = require("express")
const router = express.Router({ mergeParams: true })
const asyncWrapper = require("../utilities/asyncWrapper")
const Review = require("../models/review")
const Campground = require("../models/campground")
const { reviewJoiSchema } = require("../schemas")
const ExpressError = require("../utilities/ExpressError")

// Validation middleware
const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Post campground reviews
router.post("/", validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete campground review
router.delete("/:reviewId", asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router