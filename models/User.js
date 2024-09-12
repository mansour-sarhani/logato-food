import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
	{
		value: {
			type: Number,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		phone: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["superAdmin", "admin", "owner", "viewer"],
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "banned"],
			default: "active",
		},
		token: {
			type: String,
		},
		shopId: {
			type: Schema.Types.ObjectId,
			ref: "Shop",
		},
		shopStatus: {
			type: String,
			enum: ["underReview", "active", "inactive", "banned"],
		},
		addresses: {
			type: [
				{
					title: {
						type: String,
						required: true,
					},
					address: {
						type: String,
						required: true,
					},
					cityId: {
						type: Schema.Types.ObjectId,
						ref: "City",
						required: true,
					},
					cityLabel: {
						type: String,
					},
					cityState: {
						type: String,
					},
					latitude: {
						type: Number,
						required: true,
					},
					longitude: {
						type: Number,
						required: true,
					},
					default: {
						type: Boolean,
						default: false,
					},
				},
			],
			default: [],
		},
		avatar: {
			path: {
				type: String,
				default: "/assets/images/storage/users/",
			},
			img: {
				type: String,
				default: "",
			},
		},
		bookmark: {
			shops: {
				type: [Schema.Types.ObjectId],
				ref: "Shop",
				default: [],
			},
			products: {
				type: [Schema.Types.ObjectId],
				ref: "Product",
				default: [],
			},
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
