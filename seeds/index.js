const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

// Fix deprecated mongoose
mongoose.set("strictQuery", false);

// Connect to mongoose
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelpCamp";
main().catch((err) => console.log(err));
async function main() {
	mongoose.connect(dbUrl);
	console.log("Connection open!");
}

// Get random helper seed
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Seed the database
const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 500; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "6394a893d6c7b857dc2bca6a",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
			price,
			images: [
				{
					url: "https://res.cloudinary.com/deo3epyti/image/upload/v1670957050/YelpCamp/byghnwby2msqwfuyhmju.jpg",
					filename: "YelpCamp/iw691fj2s51unl6wmsuh",
				},
				{
					url: "https://res.cloudinary.com/deo3epyti/image/upload/v1670957872/YelpCamp/osw8jkhbb3zvuhoavynk.jpg",
					filename: "YelpCamp/eweocqhuk1sqzuacrgds",
				},
			],
			geometry: {
				type: "Point",
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
		});
		await camp.save();
	}
};

// Close the connection after function
seedDB().then(() => {
	mongoose.connection.close();
});
