import { Schema, model, models } from "mongoose";

const shopSchema = new Schema(
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
		owner: {
			value: {
				type: Number,
			},
			ownerId: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			ownerName: {
				type: String,
			},
		},
		type: {
			value: {
				type: Number,
				index: true,
			},
			typeId: {
				type: Schema.Types.ObjectId,
				ref: "Type",
				index: true,
			},
			typeLabel: {
				type: String,
			},
		},
		city: {
			value: {
				type: Number,
				index: true,
			},
			cityId: {
				type: Schema.Types.ObjectId,
				ref: "City",
				index: true,
			},
			cityLabel: {
				type: String,
			},
			cityState: {
				type: String,
			},
		},
		categories: {
			type: [
				{
					value: {
						type: Number,
						index: true,
					},
					categoryId: {
						type: String,
						index: true,
					},
					categoryLabel: {
						type: String,
					},
				},
			],
			_id: false,
		},
		subCategories: {
			type: [
				{
					value: {
						type: Number,
						index: true,
					},
					subCategoryId: {
						type: String,
						index: true,
					},
					subCategoryLabel: {
						type: String,
					},
				},
			],
			_id: false,
		},
		description: {
			type: String,
		},
		address: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
		},
		email: {
			type: String,
		},
		openHour: {
			type: String,
		},
		closeHour: {
			type: String,
		},
		hasDelivery: {
			type: Boolean,
			default: false,
		},
		priceClass: {
			type: String,
			enum: ["all", "economy", "average", "luxury"],
		},
		products: {
			type: Array,
			default: [],
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
		status: {
			type: String,
			enum: ["underReview", "active", "inactive", "banned", "deleted"],
			default: "underReview",
		},
		createdByAdmin: {
			type: Boolean,
			default: false,
		},
		latitude: {
			type: Number,
			index: true,
			required: true,
		},
		longitude: {
			type: Number,
			index: true,
			required: true,
		},
		logo: {
			path: {
				type: String,
				default: "/images/storage/shops/",
			},
			img: {
				type: String,
				default: "",
			},
		},
		cover: {
			path: {
				type: String,
				default: "/images/storage/shops/",
			},
			img: {
				type: String,
				default: "",
			},
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Shop = models.Shop || model("Shop", shopSchema);

export default Shop;
