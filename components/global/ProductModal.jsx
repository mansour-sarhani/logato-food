import * as React from "react";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import LTImage from "@/components/global/LTImage";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { priceFormatter } from "@/utils/priceFormatter";
import getCommentForProduct from "@/functions/comment/getCommentForProduct";
import PanelModal from "../panel/PanelModal";
import AddCommentForm from "../forms/AddCommentForm";
import LTProgress from "./LTProgress";

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
		userId,
		userName,
		setDoReload,
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
				aria-describedby={`product-${product.id}`}
				className="product-modal"
			>
				<DialogTitle>جزییات محصول</DialogTitle>
				<DialogContent className="product-modal-content">
					<div className="shop-product-item">
						<div className="shop-product-image">
							<LTImage
								name={product.image}
								alt={product.name}
								width={100}
								height={100}
							/>
						</div>
						<div className="shop-product-info">
							<div className="shop-product-title">
								<Typography variant="h6">
									{product.name}
								</Typography>
								<div className="shop-product-rating">
									<Rating
										name="read-only"
										value={product.averageRating}
										precision={0.1}
										readOnly
										size="small"
										sx={{
											direction: "ltr",
										}}
									/>
									<Typography variant="body2">
										(امتیاز: {product.averageRating} از
										مجموع {product.ratingsCount} نظر)
									</Typography>
								</div>
							</div>
							<div className="shop-product-description">
								<Typography variant="body2">
									{product.description}
								</Typography>
							</div>
							<div className="shop-product-measurement">
								{product.weight && (
									<Typography variant="body2">
										{product.weight}{" "}
										{product.weightUnit === "gram"
											? "گرم"
											: "کیلوگرم"}
									</Typography>
								)}
								{product.quantity && (
									<>
										<Typography variant="body2">
											{product.quantity} عدد
										</Typography>
									</>
								)}
							</div>
							<div className="shop-product-price">
								{product.discount ? (
									<Typography
										variant="body2"
										style={{
											textDecoration: "line-through",
											color: "#a1a1a1",
										}}
									>
										{priceFormatter(product.price)}
									</Typography>
								) : (
									<Typography variant="body1">
										{priceFormatter(product.price)}
									</Typography>
								)}
								{product.discount && (
									<Typography variant="body1">
										{priceFormatter(product.finalPrice)}
									</Typography>
								)}
								<Typography variant="body2">تومان</Typography>
							</div>
						</div>
					</div>
					<div className="shop-product-comments">
						<Typography variant="h6">نظرات کاربران</Typography>
						<div className="product-new-comment">
							<AddCommentForm
								commentOn="product"
								shopId={shopId}
								shopName={shopName}
								productId={product._id}
								productName={product.name}
								userId={userId}
								userName={userName}
								isOriginalComment={true}
								setDoReload={setDoReload}
							/>
						</div>
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
