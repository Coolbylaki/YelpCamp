const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const port = 3000
const app = express()
const ExpressError = require("./utilities/ExpressError")
const ejsMate = require("ejs-mate")
const session = require("express-session")
const flash = require("connect-flash")

const campgrounds = require("./routes/campgrounds")
const reviews = require("./routes/reviews")

// Connect to MongoDB
main().catch(err => console.log(err))
async function main() {
    await mongoose.connect("mongodb://localhost:27017/yelpCamp")
    console.log("Connection open!")
}

// Configure express and ejs
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

// Session configuration & flash
const sessionConfig = {
    secret: "thisWillBeABetterSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash())

// Flash middleware before route handlers
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

// Routes from router
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)

// Home route
app.get("/", (req, res) => {
    res.redirect("/campgrounds")
})

// If all routes don't match throw a 404
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

// Error middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode)
    res.render("error", { err })
})

// Starting up app on desired port
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})