// If we are in development mode we will require .env file
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// All requires
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const { scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls } = require("./utilities/helmetConfig");

// Express
const app = express();
const port = 3000;

// Fix deprecated mongoose
mongoose.set("strictQuery", false);

// Connect to MongoDB
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelpCamp";
main().catch((err) => console.log(err));
async function main() {
	mongoose.connect(dbUrl);
	console.log("Connection open!");
}

// Configure express and ejs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

// Session configuration & flash
const store = MongoStore.create({
	mongoUrl: dbUrl,
	secret: "thisWillBeABetterSecret",
	touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
	store,
	name: "session",
	secret: "thisWillBeABetterSecret",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true, // Only works on https
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

// Helmet config
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

// Make sure passport is used after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware before route handlers
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

// Routes from router
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Home route
app.get("/", (req, res) => {
	res.render("home");
});

// If all routes don't match throw a 404
app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

// Error middleware
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Oh No, Something Went Wrong!";
	res.status(statusCode);
	res.render("error", { err });
});

// Starting up app on desired port
app.listen(port, () => {
	console.log(`Serving on http://localhost:${port}`);
});
