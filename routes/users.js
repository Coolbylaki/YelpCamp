const express = require("express")
const passport = require("passport")
const User = require("../models/user")
const asyncWrapper = require("../utilities/asyncWrapper")
const router = express.Router()

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", asyncWrapper(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.flash("success", "Welcome to Yelp Camp!")
        res.redirect("/campgrounds")
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", passport.authenticate("local", {
    failureFlash: true, failureRedirect: "/login"
}), (req, res) => {
    req.flash("success", "Welcome back!")
    res.redirect("/campgrounds")
})

router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash("success", "Goodbye!")
        res.redirect("/campgrounds")
    })
})

module.exports = router