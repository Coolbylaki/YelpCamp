const express = require("express")
const User = require("../models/user")
const router = express.Router()

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", async (req, res) => {
    res.send(req.body)
})

module.exports = router