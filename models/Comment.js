import { Schema, model, models } from "mongoose";

const commentSchema = new Schema(
	{
		value: {
			type: Number,
			unique: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userName: {
			type: String,
		},
		commentOn: {
			type: String,
			enum: ["shop", "product"],
			required: true,
			index: true,
		},
		shopId: {
			type: String,
			default: null,
			index: true,
		},
		shopName: {
			type: String,
			default: null,
		},
		productId: {
			type: String,
			default: null,
			index: true,
		},
		productName: {
			type: String,
			default: null,
		},
		rating: {
			type: Number,
			enum: [1, 2, 3, 4, 5],
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		responseBody: {
			type: String,
			default: null,
		},
		status: {
			type: String,
			enum: ["underReview", "published", "rejected", "deleted"],
			default: "underReview",
			required: true,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
