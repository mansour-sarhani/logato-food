import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
	{
		value: {
			type: Number,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			index: true,
		},
		price: {
			type: Number,
			required: true,
		},
		finalPrice: {
			type: Number,
		},
		categoryId: {
			type: String,
		},
		categoryName: {
			type: String,
		},
		shopId: {
			type: Schema.Types.ObjectId,
			ref: "Shop",
			required: true,
		},
		description: {
			type: String,
		},
		weight: {
			type: String,
		},
		weightUnit: {
			type: String,
		},
		quantity: {
			type: String,
		},
		discount: {
			type: Number,
		},
		discountType: {
			type: String,
		},
		ratingsCount: {
			type: Number,
			default: 0,
		},
		totalRating: {
			type: Number,
			default: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
			index: true,
			set: (v) => Math.round(v * 10) / 10,
		},
		image: {
			path: {
				type: String,
				default: "/assets/images/storage/products/",
			},
			img: {
				type: String,
				default: "",
			},
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

const Product = models.Product || model("Product", productSchema);

export default Product;
