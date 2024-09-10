import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Comment from "@/models/Comment";
import Product from "@/models/Product";
import Shop from "@/models/Shop";
import Counter from "@/models/Counter";

//ADD NEW COMMENT => "/api/comment"
export async function POST(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const respondTo = searchParams.get("respondTo");

		if (!respondTo) {
			const formData = await req.formData();

			const commentData = {
				userId: formData.get("userId"),
				userName: formData.get("userName"),
				commentOn: formData.get("commentOn"),
				shopId: formData.get("shopId"),
				shopName: formData.get("shopName"),
				productId: formData.get("productId"),
				productName: formData.get("productName"),
				rating: formData.get("rating")
					? parseFloat(formData.get("rating"))
					: null,
				body: formData.get("body"),
				isOriginalComment: formData.get("isOriginalComment"),
				responseBody: formData.get("responseBody"),
				parentCommentId: formData.get("parentCommentId"),
			};

			const counter = await Counter.findByIdAndUpdate(
				{ _id: "commentId" },
				{ $inc: { seq: 1 } },
				{ new: true, upsert: true }
			);
			commentData.value = counter.seq;

			const newComment = new Comment(commentData);
			await newComment.save();

			// Update the product or Shop ratings
			if (commentData.commentOn === "product" && commentData.productId) {
				const product = await Product.findById(commentData.productId);
				if (product) {
					product.ratingsCount += 1;
					product.totalRating += commentData.rating;
					product.averageRating =
						product.totalRating / product.ratingsCount;
					await product.save();

					// Find the shop and update the product within the shop's products
					const shop = await Shop.findById(commentData.shopId);
					if (shop) {
						for (const menuCategory of shop.products) {
							const productToUpdate = menuCategory.items.find(
								(item) =>
									item._id.toString() ===
									product._id.toString()
							);
							if (productToUpdate) {
								productToUpdate.ratingsCount =
									product.ratingsCount;
								productToUpdate.totalRating =
									product.totalRating;
								productToUpdate.averageRating =
									product.averageRating;
								break;
							}
						}
						shop.markModified("products");
						await shop.save();
					}
				}
			} else if (commentData.commentOn === "shop" && commentData.shopId) {
				const shop = await Shop.findById(commentData.shopId);
				if (shop) {
					shop.ratingsCount += 1;
					shop.totalRating += commentData.rating;
					shop.averageRating = shop.totalRating / shop.ratingsCount;
					await shop.save();
				}
			}

			if (!commentData.isOriginalComment && commentData.responseBody) {
				const parentComment = await Comment.findById(
					commentData.parentCommentId
				);
				if (parentComment) {
					parentComment.responseBody = commentData.responseBody;
					parentComment.markModified("responseBody");
					await parentComment.save();
				}
			}

			return NextResponse.json({
				success: true,
				comment: newComment,
			});
		} else {
			// Respond to a comment => "/api/comment?respondTo=66b646f4b321cdbe232c51ff"
			const formData = await req.formData();
			const responseBody = formData.get("responseBody");

			const originalComment = await Comment.findById(respondTo);
			if (!originalComment) {
				return NextResponse.json(
					{ success: false, message: "کامنت اصلی پیدا نشد." },
					{ status: 404 }
				);
			}

			originalComment.responseBody = responseBody;
			originalComment.markModified("responseBody");
			await originalComment.save();

			return NextResponse.json({
				success: true,
				comment: originalComment,
			});
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

function formatComment(comment) {
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
	const commentId = searchParams.get("commentId");
	const shopId = searchParams.get("shopId");
	const productId = searchParams.get("productId");
	const productsShopId = searchParams.get("productsShopId");
	const userId = searchParams.get("userId");
	const status = searchParams.get("status");

	try {
		if (commentId) {
			//GET COMMENT BY ID => "/api/comment?commentId=66b646f4b321cdbe232c51ff"
			const comment = await Comment.findById(commentId);

			if (!comment) {
				return NextResponse.json(
					{ success: false, error: "کامنت پیدا نشد." },
					{ status: 404 }
				);
			}

			return NextResponse.json(
				{ success: true, data: formatComment(comment) },
				{ status: 200 }
			);
		} else if (shopId) {
			// GET COMMENTS BY SHOP ID => "/api/comment?shopId=66bbbd4d0d65c0ca710254d8"
			const comments = await Comment.find({
				shopId: shopId,
				commentOn: "shop",
			});

			const filteredComments = comments.map(formatComment);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		} else if (productId) {
			// GET COMMENTS BY PRODUCT ID => "/api/comment?productId=66ba81cd572ef78539544d5d"
			const comments = await Comment.find({
				productId: productId,
				commentOn: "product",
			});

			const filteredComments = comments.map(formatComment);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		} else if (productsShopId) {
			// GET COMMENTS FOR SHOP PRODUCTS => "/api/comment?productsShopId=66ba81cd572ef78539544d5d"
			const comments = await Comment.find({
				shopId: productsShopId,
				commentOn: "product",
			});

			const filteredComments = comments.map(formatComment);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		} else if (userId) {
			// GET COMMENTS BY USER ID => "/api/comment?userId=66ba81cd572ef78539544d5d"
			const comments = await Comment.find({
				userId: userId,
			});

			const filteredComments = comments.map(formatComment);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		} else if (status) {
			// GET COMMENTS BY STATUS => "/api/comment?status=underReview"
			const comments = await Comment.find({
				status: status,
			});

			const filteredComments = comments.map(formatComment);

			return NextResponse.json(
				{ success: true, data: filteredComments },
				{ status: 200 }
			);
		} else {
			//GET ALL COMMENTS => "/api/comment"
			const comments = await Comment.find({});

			const filteredComments = comments.map(formatComment);

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

//UPDATE COMMENT STATUS => "/api/comment?commentId=66b646f4b321cdbe232c51ff"
export async function PUT(req) {
	await dbConnect();

	const { searchParams } = new URL(req.url);
	const commentId = searchParams.get("commentId");

	try {
		const formData = await req.formData();
		const status = formData.get("status");

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return NextResponse.json(
				{ success: false, message: "کامنت پیدا نشد." },
				{ status: 404 }
			);
		}

		comment.status = status;

		comment.markModified("status");

		await comment.save();

		return NextResponse.json({
			success: true,
			message: "کامنت با موفقیت به روز رسانی شد.",
			comment,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//DELETE comment => "/api/comment?commentId=66b646f4b321cdbe232c51ff"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const commentId = searchParams.get("commentId");
		const userId = searchParams.get("userId");

		const comment = await Comment.findById(commentId);
		if (!comment) {
			return NextResponse.json(
				{ success: false, message: "کامنت وجود ندارد." },
				{ status: 400 }
			);
		}

		if (comment.user.toString() !== userId) {
			return NextResponse.json(
				{
					success: false,
					message: "شما اجازه حذف این کامنت را ندارید.",
				},
				{ status: 403 }
			);
		}

		await comment.remove();

		return NextResponse.json({
			success: true,
			message: "کامنت با موفقیت حذف شد.",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
