const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utilities/asyncWrapper");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
	.route("/")
	.get(asyncWrapper(campgrounds.index))
	.post(isLoggedIn, upload.array("image"), validateCampground, asyncWrapper(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
	.route("/:id")
	.get(asyncWrapper(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, asyncWrapper(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, asyncWrapper(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, asyncWrapper(campgrounds.renderEditForm));

module.exports = router;
