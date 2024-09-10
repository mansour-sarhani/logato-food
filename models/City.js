import { Schema, model, models } from "mongoose";

const citySchema = new Schema(
	{
		value: {
			type: Number,
			unique: true,
			index: true,
		},
		label: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		alias: {
			type: String,
			unique: true,
			required: true,
		},
		state: {
			type: String,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "pending", "deleted"],
			default: "active",
			required: true,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const City = models.City || model("City", citySchema);

export default City;
