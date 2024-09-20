import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Comment from "@/models/Comment";

function extractCommentDetails(comment) {
	return {
		id: comment._id,
		value: comment.value,
		userId: comment.userId,
		userName: comment.userName,
		commentOn: comment.commentOn,
		shopId: comment.shopId,
		shopName: comment.shopName,
		productId: comment.productId,
		productName: comment.productName,
		rating: comment.rating,
		isOriginalComment: comment.isOriginalComment,
		body: comment.body,
		responseBody: comment.responseBody,
		parentCommentId: comment.parentCommentId,
		status: comment.status,
		deleted: comment.deleted,
		createdAt: comment.createdAt,
		updatedAt: comment.updatedAt,
	};
}

export async function GET(request) {
	await dbConnect();

	const { searchParams } = new URL(request.url);
	const status = searchParams.get("status");

	try {
		if (status) {
			// ADMIN GET COMMENTS BY STATUS => "/api/admin/comment?status=underReview"
			const comments = await Comment.find({
				status: status,
			});

			const filteredComments = comments.map(extractCommentDetails);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		} else {
			//ADMIN GET ALL COMMENTS => "/api/admin/comment"
			const comments = await Comment.find({});

			const filteredComments = comments.map(extractCommentDetails);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
