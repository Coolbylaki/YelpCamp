const express = require("express")
const router = express.Router()
const asyncWrapper = require("../utilities/asyncWrapper")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")
const campgrounds = require("../controllers/campgrounds")

// Show campgrounds route
router.get("/", asyncWrapper(campgrounds.index))

// New campground get route
router.get("/new", isLoggedIn, campgrounds.renderNewForm)

// New campground post route
router.post("/", isLoggedIn, validateCampground, asyncWrapper(campgrounds.createCampground))

// Show campground route
router.get("/:id", asyncWrapper(campgrounds.showCampground))

// Edit campground get route
router.get("/:id/edit", isLoggedIn, isAuthor, asyncWrapper(campgrounds.renderEditForm))

// Edit campground put route
router.put("/:id", isLoggedIn, isAuthor, validateCampground, asyncWrapper(campgrounds.editCampground))

// Delete campground route
router.delete("/:id", isLoggedIn, isAuthor, asyncWrapper(campgrounds.deleteCampground))

module.exports = router