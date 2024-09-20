import * as React from "react";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import getCommentForProduct from "@/functions/comment/getCommentForProduct";
import FA from "@/utils/localizationFa";
import AddCommentForm from "@/components/forms/AddCommentForm";
import LTProgress from "@/components/global/LTProgress";
import LTImage from "@/components/global/LTImage";
import ProductPrice from "@/components/shop/ProductPrice";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	".MuiDialog-paper": {
		maxWidth: 800,
	},
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

function BootstrapDialogTitle(props) {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						left: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
}

function ProductModal(props) {
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState();

	const { product, shop, user } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (product) {
			async function fetchComments() {
				await getCommentForProduct(
					dispatch,
					enqueueSnackbar,
					product._id,
					setComments
				);
			}
			fetchComments();
		}
	}, [product]);

	return (
		<div className="product-modal">
			<Tooltip title="مشاهده جزییات" placement="bottom" arrow>
				<Button
					variant="outlined"
					size="small"
					color="info"
					className="view-button"
					onClick={handleClickOpen}
				>
					<VisibilityIcon />
				</Button>
			</Tooltip>

			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="product-modal-title"
				open={open}
				className="product-modal-content"
			>
				<div
					className="bg-black"
					style={{
						width: "600px",
						maxWidth: "600px",
						margin: "0",
					}}
				>
					<BootstrapDialogTitle
						id="panel-modal-title"
						onClose={handleClose}
					>
						جزییات محصول
					</BootstrapDialogTitle>

					<DialogContent dividers>
						<div className="shop-product-item">
							<div className="shop-product-main">
								<div className="shop-product-image">
									<LTImage
										name={product.image}
										alt={product.name}
										width={100}
										height={100}
									/>
								</div>
								<div className="shop-product-info">
									<div className="shop-product-header">
										<div className="shop-product-title">
											<Typography variant="h6">
												{product.name}
											</Typography>
											<div className="shop-product-rating">
												<Rating
													name="read-only"
													value={
														product.averageRating
													}
													precision={0.1}
													readOnly
													size="small"
													sx={{
														direction: "ltr",
													}}
												/>
												<Typography variant="body2">
													(امتیاز:{" "}
													{product.averageRating} از
													مجموع {product.ratingsCount}{" "}
													نظر)
												</Typography>
											</div>
										</div>
									</div>
									<ProductPrice product={product} />
								</div>
							</div>
							<div className="shop-product-alt">
								<div className="shop-product-description">
									<Typography variant="body2">
										{product.description}
									</Typography>
								</div>
								<div className="shop-product-measurement">
									{product.size && (
										<Typography variant="body2">
											{product.size}{" "}
											{FA.unit[product.sizeUnit]}
										</Typography>
									)}
									{product.weight && (
										<Typography variant="body2">
											{product.weight}{" "}
											{FA.unit[product.weightUnit]}
										</Typography>
									)}
									{product.quantity && (
										<Typography variant="body2">
											{product.quantity} عدد
										</Typography>
									)}
								</div>
							</div>
						</div>

						<div className="shop-product-comments">
							<Typography variant="h6">نظرات کاربران</Typography>
							{user ? (
								<div className="product-new-comment">
									<AddCommentForm
										commentOn="product"
										shop={shop}
										user={user}
										productId={product._id}
										productName={product.name}
										isOriginalComment={true}
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
															{
																comment.responseBody
															}
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
				</div>
			</BootstrapDialog>
		</div>
	);
}

export default ProductModal;
