"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import getCommentForShop from "@/functions/comment/getCommentForShop";
import getShopById from "@/functions/shop/getShopById";
import { priceFormatter } from "@/utils/priceFormatter";
import AddCommentForm from "@/components/forms/AddCommentForm";
import PanelModal from "@/components/panel/PanelModal";
import ProductModal from "@/components/global/ProductModal";
import LTProgress from "@/components/global/LTProgress";
import LTImage from "@/components/global/LTImage";
import LTMap from "@/components/global/LTMap";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigationIcon from "@mui/icons-material/Navigation";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import StoreIcon from "@mui/icons-material/Store";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import EmailIcon from "@mui/icons-material/Email";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MopedIcon from "@mui/icons-material/Moped";
import MessageIcon from "@mui/icons-material/Message";

export default function ShopSinglePage({ id }) {
	const [shop, setShop] = useState(null);
	const [comments, setComments] = useState();
	const [doReload, setDoReload] = useState(true);
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const handleClickOpen = (itemId) => {
		setSelectedItemId(itemId);
		setOpenModal(true);
	};

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const user = useSelector((state) => state.user.data);

	useEffect(() => {
		if (id && !shop) {
			async function fetchShop() {
				getShopById(dispatch, enqueueSnackbar, id, setShop);
			}
			fetchShop();
		}
	}, [id, shop]);

	useEffect(() => {
		if (shop) {
			document.title = shop.name;
		}
	}, [shop]);

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

	return !shop ? (
		<LTProgress />
	) : (
		<div className="inner-page shop-single-page">
			<div className="lt-container">
				<div className="page-wrapper front-page-wrapper">
					<div className="sidebar">
						<div className="shop-single-info">
							<div className="shop-single-heading">
								<Typography variant="h5">
									اطلاعات فروشگاه
								</Typography>
							</div>
							<div className="shop-single-row">
								<StoreIcon />
								<label>نوع فروشگاه:</label>
								<Typography variant="body1">
									{shop.type.typeLabel}
								</Typography>
							</div>
							<div className="shop-single-row">
								<LocationOnIcon />
								<label>استان:</label>
								<Typography variant="body1">
									{shop.city.cityState}
								</Typography>
							</div>
							<div className="shop-single-row">
								<LocationOnIcon />
								<label>شهر:</label>
								<Typography variant="body1">
									{shop.city.cityLabel}
								</Typography>
							</div>
							<div className="shop-single-row">
								<NavigationIcon />
								<label>آدرس:</label>
								<Typography variant="body1">
									{shop.address}
								</Typography>
							</div>
							<div className="shop-single-row">
								<LTMap
									latitude={shop.latitude}
									longitude={shop.longitude}
									height="200px"
								/>
							</div>
							<div className="shop-single-row">
								<PhoneEnabledIcon />
								<label>تلفن:</label>
								<Typography variant="body1">
									{shop.phone}
								</Typography>
							</div>
							<div className="shop-single-row">
								<EmailIcon />
								<label>ایمیل:</label>
								<Typography variant="body1">
									{shop.email}
								</Typography>
							</div>
							<div className="shop-single-row">
								<WatchLaterIcon />
								<label>ساعات کاری:</label>
								<Typography variant="body1">
									{shop.closeHour} الی {shop.openHour}
								</Typography>
							</div>
							<div className="shop-single-row">
								<MonetizationOnIcon />
								<label>کلاس قیمتی:</label>
								<Typography variant="body1">
									{shop.priceClass}
								</Typography>
							</div>
							<div className="shop-single-row">
								<MopedIcon />
								<label>سرویس دلیوری:</label>
								<Typography variant="body1">
									{shop.hasDelivery ? "دارد" : "ندارد"}
								</Typography>
							</div>
						</div>
					</div>
					<div className="content">
						<div className="shop-single">
							<div className="shop-cover">
								<LTImage
									name={shop.cover}
									alt={shop.name}
									width={970}
									height={300}
								/>
								<div className="shop-identity">
									<div className="shop-logo">
										<LTImage
											name={shop.logo}
											alt={shop.name}
											width={100}
											height={100}
											variant="circle"
										/>
									</div>
									<div className="shop-title">
										<Typography variant="h1">
											{shop.name}
										</Typography>
									</div>
									<div className="shop-rating">
										<Rating
											name="read-only"
											value={shop.averageRating}
											precision={0.1}
											readOnly
											size="small"
											sx={{ direction: "ltr" }}
										/>
										<Typography variant="body2">
											(امتیاز: {shop.averageRating} از
											مجموع {shop.ratingsCount} نظر)
										</Typography>
									</div>
								</div>
							</div>
							<div className="shop-products-container">
								{shop.products.map((product) => (
									<div
										key={product._id}
										id={product._id}
										className="product-category-section"
									>
										<Typography variant="h5">
											{product.name}
										</Typography>
										<div className="shop-products-grid">
											{product.items.map((item) => (
												<Paper
													key={item._id}
													id={item._id}
													elevation={1}
													onClick={() => {
														handleClickOpen(
															item._id
														);
														setSelectedProduct(
															item
														);
													}}
												>
													<div className="shop-product-item">
														<div className="shop-product-image">
															<LTImage
																name={
																	item.image
																}
																alt={item.name}
																width={100}
																height={100}
															/>
														</div>
														<div className="shop-product-info">
															<div className="shop-product-title">
																<Typography variant="h6">
																	{item.name}
																</Typography>
																<Rating
																	name="read-only"
																	value={
																		item.averageRating
																	}
																	precision={
																		0.1
																	}
																	readOnly
																	size="small"
																	sx={{
																		direction:
																			"ltr",
																	}}
																/>
															</div>
															<div className="shop-product-description">
																<Typography variant="body2">
																	{
																		item.description
																	}
																</Typography>
															</div>
															<div className="shop-product-measurement">
																{item.weight && (
																	<Typography variant="body2">
																		{
																			item.weight
																		}{" "}
																		{item.weightUnit ===
																		"gram"
																			? "گرم"
																			: "کیلوگرم"}
																	</Typography>
																)}
																{item.quantity && (
																	<>
																		<Typography variant="body2">
																			{
																				item.quantity
																			}{" "}
																			عدد
																		</Typography>
																	</>
																)}
															</div>
															<div className="shop-product-price">
																{item.discount ? (
																	<Typography
																		variant="body2"
																		style={{
																			textDecoration:
																				"line-through",
																			color: "#a1a1a1",
																		}}
																	>
																		{priceFormatter(
																			item.price
																		)}
																	</Typography>
																) : (
																	<Typography variant="body1">
																		{priceFormatter(
																			item.price
																		)}
																	</Typography>
																)}
																{item.discount && (
																	<Typography variant="body1">
																		{priceFormatter(
																			item.finalPrice
																		)}
																	</Typography>
																)}
																<Typography variant="body2">
																	تومان
																</Typography>
															</div>
														</div>
													</div>
												</Paper>
											))}
											{selectedItemId && (
												<ProductModal
													product={selectedProduct}
													openModal={openModal}
													setOpenModal={setOpenModal}
													shopId={shop.id}
													shopName={shop.name}
													userId={user.id}
													userName={user.firstName}
													setDoReload={setDoReload}
												/>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="secondary-sidebar">
						<div className="shop-comments">
							<div className="shop-single-heading">
								<Typography variant="h5">
									نظرات کاربران
								</Typography>
							</div>
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
							</div>
							<div className="shop-comments-wrapper">
								{comments && comments.length > 0 ? (
									comments
										.filter(
											(comment) =>
												comment.status === "published"
										)
										.map((comment) => (
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
															value={
																comment.rating
															}
															precision={0.5}
															readOnly
															size="small"
															sx={{
																direction:
																	"ltr",
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
										))
								) : (
									<Typography variant="body2">
										نظری برای این فروشگاه ثبت نشده است.
									</Typography>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
