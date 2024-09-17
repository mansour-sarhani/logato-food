"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import getShopById from "@/functions/shop/getShopById";
import userUnbookmarkShop from "@/functions/user/userUnbookmarkShop";
import userBookmarkShop from "@/functions/user/userBookmarkShop";
import userUnbookmarkProduct from "@/functions/user/userUnbookmarkProduct";
import userBookmarkProduct from "@/functions/user/userBookmarkProduct";
import ProductModal from "@/components/shop/ProductModal";
import LTProgress from "@/components/global/LTProgress";
import LTImage from "@/components/global/LTImage";
import ProductItem from "@/components/shop/ProductItem";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";
import ShopInfo from "@/components/shop/ShopInfo";
import ShopComments from "@/components/shop/ShopComments";

export default function ShopSinglePage({ id }) {
	const [shop, setShop] = useState(null);
	const [doReload, setDoReload] = useState(true);
	const [selectedItemId, setSelectedItemId] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [bookmarkedShops, setBookmarkedShops] = useState();
	const [bookmarkedProducts, setBookmarkedProducts] = useState();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const user = useSelector((state) => state.user.data);

	const handleClickOpen = (itemId) => {
		setSelectedItemId(itemId);
		setOpenModal(true);
	};

	const isBookmarked = (id, type) => {
		if (type === "shop") {
			return bookmarkedShops.includes(id);
		} else if (type === "product") {
			return bookmarkedProducts.includes(id);
		}
	};

	const handleBookmark = (id, type, isBookmarked) => () => {
		if (type === "shop") {
			if (isBookmarked) {
				async function unbookmarkShop() {
					await userUnbookmarkShop(dispatch, enqueueSnackbar, id);
				}
				unbookmarkShop();
			} else {
				async function bookmarkShop() {
					await userBookmarkShop(dispatch, enqueueSnackbar, id);
				}
				bookmarkShop();
			}
		} else if (type === "product") {
			if (isBookmarked) {
				async function unbookmarkProduct() {
					await userUnbookmarkProduct(dispatch, enqueueSnackbar, id);
				}
				unbookmarkProduct();
			} else {
				async function bookmarkProduct() {
					await userBookmarkProduct(dispatch, enqueueSnackbar, id);
				}
				bookmarkProduct();
			}
		}
	};

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
		if (user) {
			setBookmarkedProducts(user.bookmark.products);
			setBookmarkedShops(user.bookmark.shops);
		}
	}, [user]);

	return !shop ? (
		<LTProgress />
	) : (
		<div className="inner-page shop-single-page">
			<div className="lt-container">
				<div className="page-wrapper front-page-wrapper">
					<div className="sidebar">
						<ShopInfo shop={shop} />
					</div>
					<div className="content">
						<div className="shop-single">
							<div className="shop-cover">
								<LTImage
									name={shop.cover}
									alt={shop.name}
									width={870}
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
								{shop.products.map((category) => (
									<div
										key={category._id}
										id={category._id}
										className="product-category-section"
									>
										<Typography variant="h5">
											{category.name}
										</Typography>
										<div className="shop-products-grid">
											{category.items.map((product) => (
												<Paper
													key={product._id}
													id={product._id}
													elevation={1}
													onClick={() => {
														handleClickOpen(
															product._id
														);
														setSelectedProduct(
															product
														);
													}}
												>
													<ProductItem
														product={product}
													/>
												</Paper>
											))}
											{selectedItemId && (
												<ProductModal
													product={selectedProduct}
													openModal={openModal}
													setOpenModal={setOpenModal}
													shopId={shop.id}
													shopName={shop.name}
													user={user}
													setDoReload={setDoReload}
													isBookmarked={isBookmarked}
													handleBookmark={
														handleBookmark
													}
												/>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="secondary-sidebar">
						<ShopComments
							shop={shop}
							user={user}
							isBookmarked={isBookmarked}
							handleBookmark={handleBookmark}
							doReload={doReload}
							setDoReload={setDoReload}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
