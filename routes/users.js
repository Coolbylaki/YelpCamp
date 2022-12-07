const express = require("express")
const asyncWrapper = require("../utilities/asyncWrapper")
const passport = require("passport")
const router = express.Router()
const users = require("../controllers/users")

// Register show page route
router.get("/register", users.renderRegister)

// Register post route
router.post("/register", asyncWrapper(users.registerUser))

// Login show page route
router.get("/login", users.renderLogin)

// Login post route
router.post("/login", passport.authenticate("local", {
    failureFlash: true, failureRedirect: "/login", keepSessionInfo: true
}), users.loginUser)

// Logout route
router.get("/logout", users.logoutUser)

module.exports = router