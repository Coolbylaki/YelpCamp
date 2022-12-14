const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utilities/asyncWrapper");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, asyncWrapper(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrapper(reviews.deleteReview));

module.exports = router;
