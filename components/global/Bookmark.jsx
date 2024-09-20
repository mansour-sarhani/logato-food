import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import userUnbookmarkShop from "@/functions/user/userUnbookmarkShop";
import userBookmarkShop from "@/functions/user/userBookmarkShop";
import userUnbookmarkProduct from "@/functions/user/userUnbookmarkProduct";
import userBookmarkProduct from "@/functions/user/userBookmarkProduct";
import getUserBookmarkedShops from "@/functions/user/getUserBookmarkedShops";
import getUserBookmarkedProducts from "@/functions/user/getUserBookmarkedProducts";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Bookmark({ id, type }) {
	const [bookmarkedShops, setBookmarkedShops] = useState();
	const [bookmarkedProducts, setBookmarkedProducts] = useState();
	const [doReload, setDoReload] = useState(true);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const isBookmarked = (id, type) => {
		if (type === "shop" && bookmarkedShops) {
			return bookmarkedShops.some((shop) => shop._id === id);
		} else if (type === "product" && bookmarkedProducts) {
			return bookmarkedProducts.some((product) => product._id === id);
		}
	};

	const handleBookmark = (id, type, isBookmarked) => () => {
		if (type === "shop") {
			if (isBookmarked) {
				async function unbookmarkShop() {
					await userUnbookmarkShop(dispatch, enqueueSnackbar, id);
					setDoReload(true);
				}
				unbookmarkShop();
			} else {
				async function bookmarkShop() {
					await userBookmarkShop(dispatch, enqueueSnackbar, id);
					setDoReload(true);
				}
				bookmarkShop();
			}
		} else if (type === "product") {
			if (isBookmarked) {
				async function unbookmarkProduct() {
					await userUnbookmarkProduct(dispatch, enqueueSnackbar, id);
					setDoReload(true);
				}
				unbookmarkProduct();
			} else {
				async function bookmarkProduct() {
					await userBookmarkProduct(dispatch, enqueueSnackbar, id);
					setDoReload(true);
				}
				bookmarkProduct();
			}
		}
	};

	useEffect(() => {
		if (doReload) {
			async function fetchBookmarkedShops() {
				await getUserBookmarkedShops(
					dispatch,
					enqueueSnackbar,
					setBookmarkedShops
				);
				await getUserBookmarkedProducts(
					dispatch,
					enqueueSnackbar,
					setBookmarkedProducts
				);
			}
			fetchBookmarkedShops();
			setDoReload(false);
		}
	}, [doReload]);

	return (
		<Tooltip
			title={
				isBookmarked(id, type)
					? "حدف از لیست مورد علاقه"
					: "اضافه کردن به لیست مورد علاقه"
			}
			placement="top"
			arrow
			className="favorite-button"
		>
			<Button
				variant={isBookmarked(id, type) ? "contained" : "outlined"}
				size="small"
				color="error"
				onClick={handleBookmark(id, type, isBookmarked(id, type))}
			>
				{isBookmarked(id, type) ? (
					<FavoriteIcon />
				) : (
					<FavoriteBorderIcon />
				)}
			</Button>
		</Tooltip>
	);
}
