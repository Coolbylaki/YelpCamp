const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review")

// Modeling our Schema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

// Mongoose delete review middleware
CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Exporting our model
module.exports = mongoose.model("Campground", CampgroundSchema)