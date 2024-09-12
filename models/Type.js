import { Schema, model, models } from "mongoose";

const typeSchema = new Schema(
	{
		value: {
			type: Number,
			unique: true,
		},
		alias: {
			type: String,
			unique: true,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		image: {
			path: {
				type: String,
				default: "/assets/images/storage/types/",
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
		categories: {
			type: [
				{
					value: {
						type: Number,
					},
					alias: {
						type: String,
						required: true,
					},
					label: {
						type: String,
						required: true,
					},
					parentTypeId: {
						type: Schema.Types.ObjectId,
						ref: "Type",
					},
					parentTypeLabel: {
						type: String,
					},
					image: {
						path: {
							type: String,
							default: "/assets/images/storage/types/categories/",
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
					subCategories: {
						type: [
							{
								value: {
									type: Number,
								},
								alias: {
									type: String,
									required: true,
								},
								label: {
									type: String,
									required: true,
								},
								parentCategoryId: {
									type: String,
								},
								parentCategoryLabel: {
									type: String,
								},
								typeId: {
									type: Schema.Types.ObjectId,
									ref: "Type",
								},
								image: {
									path: {
										type: String,
										default:
											"/assets/images/storage/types/categories/",
									},
									img: {
										type: String,
										default: "",
									},
								},
								status: {
									type: String,
									enum: [
										"active",
										"inactive",
										"pending",
										"deleted",
									],
									default: "active",
									required: true,
								},
								deleted: {
									type: Boolean,
									default: false,
								},
							},
						],
						default: [],
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

const Type = models.Type || model("Type", typeSchema);

export default Type;
