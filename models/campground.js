const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Modeling our Schema
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
})

// Exporting our model
module.exports = mongoose.model("Campground", CampgroundSchema)