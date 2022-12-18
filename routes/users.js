const express = require("express");
const asyncWrapper = require("../utilities/asyncWrapper");
const passport = require("passport");
const router = express.Router();
const users = require("../controllers/users");
const { checkReturnTo } = require("../middleware");

router.route("/register").get(users.renderRegister).post(asyncWrapper(users.registerUser));

router
	.route("/login")
	.get(users.renderLogin)
	.post(
		checkReturnTo,
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
			keepSessionInfo: true,
		}),
		users.loginUser
	);

router.get("/logout", users.logoutUser);

module.exports = router;
