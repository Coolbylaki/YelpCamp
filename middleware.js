const { campgroundJoiSchema, reviewJoiSchema } = require("./schemas")
const ExpressError = require("./utilities/ExpressError")
const Campground = require("./models/campground")
const Review = require("./models/review")

// Middleware to check is someone logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in!")
        return res.redirect("/login")
    }
    next()
}

// Campground Joi Validation middleware
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// Middleware to check is someone author
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// Middleware to check is someone author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

// Review Joi Validation middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}