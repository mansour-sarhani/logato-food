import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import getCommentForShop from "@/functions/comment/getCommentForShop";
import AddCommentForm from "@/components/forms/AddCommentForm";
import PanelModal from "@/components/panel/PanelModal";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function ShopComments({
	shop,
	user,
	isBookmarked,
	handleBookmark,
	doReload,
	setDoReload,
}) {
	const [comments, setComments] = useState();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (shop) {
			if (doReload) {
				async function fetchComments() {
					await getCommentForShop(
						dispatch,
						enqueueSnackbar,
						shop.id,
						setComments
					);
				}
				fetchComments();
			}
			setDoReload(false);
		}
	}, [shop, doReload]);

	return (
		<div className="shop-comments">
			<div className="shop-single-heading">
				<Typography variant="h5">نظرات کاربران</Typography>
			</div>
			{Object.keys(user).length === 0 ? (
				<Alert severity="info" sx={{ marginBottom: "10px" }}>
					برای ثبت نظر باید ابتدا وارد حساب کاربری خود شوید.
				</Alert>
			) : (
				<div className="shop-new-comment">
					<PanelModal
						buttonLabel="ثبت نظر"
						modalHeader="ثبت نظر"
						icon="comment"
					>
						<AddCommentForm
							commentOn="shop"
							shopId={shop.id}
							shopName={shop.name}
							userId={user.id}
							userName={user.firstName}
							isOriginalComment={true}
							setDoReload={setDoReload}
						/>
					</PanelModal>
					<Tooltip
						title={
							isBookmarked(shop.id, "shop")
								? "حدف از لیست مورد علاقه"
								: "اضافه کردن به لیست مورد علاقه"
						}
						placement="top"
						arrow
						className="favorite-button"
					>
						<Button
							variant={
								isBookmarked(shop.id, "shop")
									? "contained"
									: "outlined"
							}
							size="small"
							color="error"
							onClick={handleBookmark(
								shop.id,
								"shop",
								isBookmarked(shop.id, "shop")
							)}
						>
							{isBookmarked(shop.id, "shop") ? (
								<FavoriteIcon />
							) : (
								<FavoriteBorderIcon />
							)}
						</Button>
					</Tooltip>
				</div>
			)}
			<div className="shop-comments-wrapper">
				{comments && comments.length > 0 ? (
					comments
						.filter((comment) => comment.status === "published")
						.map((comment) => (
							<div key={comment.id} className="shop-comment">
								<div className="shop-original-comment">
									<div className="shop-comment-header">
										<Typography variant="h6">
											{comment.userName}
										</Typography>
										<Rating
											name="read-only"
											value={comment.rating}
											precision={0.5}
											readOnly
											size="small"
											sx={{
												direction: "ltr",
											}}
										/>
									</div>
									<div className="shop-comment-body">
										<Typography variant="body2">
											{comment.body}
										</Typography>
									</div>
								</div>
								{comment.responseBody && (
									<div className="shop-response-comment">
										<div className="shop-comment-header">
											<Typography variant="h6">
												فروشگاه:
											</Typography>
										</div>
										<div className="shop-comment-body">
											<Typography variant="body2">
												{comment.responseBody}
											</Typography>
										</div>
									</div>
								)}
							</div>
						))
				) : (
					<Alert severity="info" sx={{ marginBottom: "10px" }}>
						نظری برای این فروشگاه ثبت نشده است.
					</Alert>
				)}
			</div>
		</div>
	);
}
