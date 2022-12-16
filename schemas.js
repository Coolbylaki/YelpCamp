const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Extension to validate HTML injection
const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapeHTML": "{{#label}} must not include HTML!",
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value) return helpers.error("string.escapeHTML", { value });
				return clean;
			},
		},
	},
});

// Extend Joi
const Joi = BaseJoi.extend(extension);

// Campground schema object
module.exports.campgroundJoiSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapeHTML(),
		price: Joi.number().required().min(0),
		location: Joi.string().required().escapeHTML(),
		description: Joi.string().required().escapeHTML(),
	}).required(),
	deleteImages: Joi.array(),
});

// Review schema object
module.exports.reviewJoiSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		body: Joi.string().required().escapeHTML(),
	}).required(),
});
