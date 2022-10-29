const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Modeling our Schema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
})

// Exporting our model
module.exports = mongoose.model("Campground", CampgroundSchema)