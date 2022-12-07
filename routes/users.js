const express = require("express")
const passport = require("passport")
const User = require("../models/user")
const asyncWrapper = require("../utilities/asyncWrapper")
const router = express.Router()

// Register show page route
router.get("/register", (req, res) => {
    res.render("users/register")
})

// Register post route
router.post("/register", asyncWrapper(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome to Yelp Camp!")
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

// Login post route
router.post("/login", passport.authenticate("local", {
    failureFlash: true, failureRedirect: "/login", keepSessionInfo: true
}), (req, res) => {
    req.flash("success", "Welcome back!")
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

// Logout route
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash("success", "Goodbye!")
        res.redirect("/campgrounds")
    })
})

module.exports = router