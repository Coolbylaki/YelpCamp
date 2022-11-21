const express = require("express")
const router = express.Router()
const asyncWrapper = require("../utilities/asyncWrapper")
const Campground = require("../models/campground")
const { campgroundJoiSchema } = require("../schemas")

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

// Show campgrounds route
router.get("/", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))

// New campground get route
router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

// New campground post route
router.post("/", validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground.id}`)
}))

// Show campground route
router.get("/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews")
    res.render("campgrounds/show", { campground })
}))

// Edit campground get route
router.get("/:id/edit", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground })
}))

// Edit campground put route
router.put("/:id", validateCampground, asyncWrapper(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete campground route
router.delete("/:id", asyncWrapper(async (req, res) => {
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds")
}))

module.exports = router