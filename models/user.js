const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
})

// Add username and password to User schema
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)