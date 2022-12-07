const express = require("express")
const router = express.Router({ mergeParams: true })
const asyncWrapper = require("../utilities/asyncWrapper")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
const reviews = require("../controllers/reviews")

// Post campground reviews
router.post("/", isLoggedIn, validateReview, asyncWrapper(reviews.createReview))

// Delete campground review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrapper(reviews.deleteReview))

module.exports = router