import * as React from "react";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import getCommentForProduct from "@/functions/comment/getCommentForProduct";
import AddCommentForm from "@/components/forms/AddCommentForm";
import LTProgress from "@/components/global/LTProgress";
import ProductItem from "@/components/shop/ProductItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductModal(props) {
	const [comments, setComments] = useState();

	const {
		openModal,
		setOpenModal,
		product,
		shopId,
		shopName,
		user,
		setDoReload,
		isBookmarked,
		handleBookmark,
	} = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		setOpenModal(false);
		setComments();
	};

	useEffect(() => {
		async function fetchComments() {
			await getCommentForProduct(
				dispatch,
				enqueueSnackbar,
				product._id,
				setComments
			);
		}
		fetchComments();
	}, [product]);

	return (
		<React.Fragment>
			<Dialog
				open={openModal}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				scroll="paper"
				aria-describedby={`product-${product._id}`}
				className="product-modal"
			>
				<DialogTitle>جزییات محصول</DialogTitle>
				<DialogContent className="product-modal-content">
					<ProductItem
						product={product}
						isBookmarked={isBookmarked}
						handleBookmark={handleBookmark}
					/>

					<div className="shop-product-comments">
						<Typography variant="h6">نظرات کاربران</Typography>
						{user ? (
							<div className="product-new-comment">
								<AddCommentForm
									commentOn="product"
									shopId={shopId}
									shopName={shopName}
									productId={product._id}
									productName={product.name}
									userId={user.id}
									userName={user.firstName}
									isOriginalComment={true}
									setDoReload={setDoReload}
								/>
							</div>
						) : (
							<Alert
								severity="info"
								sx={{ marginBottom: "10px" }}
							>
								برای ثبت نظر باید ابتدا وارد حساب کاربری خود
								شوید.
							</Alert>
						)}

						{!comments ? (
							<LTProgress />
						) : comments.length !== 0 ? (
							<div className="shop-comments-wrapper">
								{comments.map((comment) => (
									<div
										key={comment.id}
										className="shop-comment"
									>
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
								))}
							</div>
						) : (
							<Typography variant="body2">
								نظری برای این محصول ثبت نشده است.
							</Typography>
						)}
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>بستن</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
