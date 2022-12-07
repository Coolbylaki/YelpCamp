const express = require("express")
const router = express.Router()
const asyncWrapper = require("../utilities/asyncWrapper")
const Campground = require("../models/campground")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")

// Show campgrounds route
router.get("/", asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}))

// New campground get route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

// New campground post route
router.post("/", isLoggedIn, validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground.id}`)
}))

// Show campground route
router.get("/:id", asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if (!campground) {
        req.flash("error", "Cannot find that campground!")
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })
}))

// Edit campground get route
router.get("/:id/edit", isLoggedIn, isAuthor, asyncWrapper(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Cannot find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}))

// Edit campground put route
router.put("/:id", isLoggedIn, isAuthor, validateCampground, asyncWrapper(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Delete campground route
router.delete("/:id", isLoggedIn, isAuthor, asyncWrapper(async (req, res) => {
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds")
}))

module.exports = router