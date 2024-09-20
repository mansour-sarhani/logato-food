"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import getUserBookmarkedShops from "@/functions/user/getUserBookmarkedShops";
import getUserBookmarkedProducts from "@/functions/user/getUserBookmarkedProducts";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LTProgress from "@/components/global/LTProgress";
import NoData from "@/components/global/NoData";
import ShopItem from "@/components/shop/ShopItem";
import ProductItem from "@/components/shop/ProductItem";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`bookmark-tabpanel-${index}`}
			aria-labelledby={`bookmark-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `bookmark-tab-${index}`,
		"aria-controls": `bookmark-tabpanel-${index}`,
	};
}

export default function BookmarkPage() {
	const [value, setValue] = useState(0);
	const [bookmarkedShops, setBookmarkedShops] = useState();
	const [bookmarkedProducts, setBookmarkedProducts] = useState();

	const user = useSelector((state) => state.user.data);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		if (user) {
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
		}
	}, [user]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">لیست علاقه مندیها</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید فروشگاه ها و محصولات منتخب خود را
						مشاهده کنید.
					</Typography>
				</div>
			</div>

			{user && (
				<div className="panel-inner-content form-content">
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="bookmark tabs"
					>
						<Tab label="فروشگاه های منتخب" {...a11yProps(0)} />
						<Tab label="محصولات منتخب" {...a11yProps(1)} />
					</Tabs>

					<CustomTabPanel value={value} index={0}>
						{!bookmarkedShops ? (
							<LTProgress />
						) : bookmarkedShops.length === 0 ? (
							<NoData />
						) : (
							<div className="bookmark-shops-grid">
								{bookmarkedShops.map((shop) => (
									<ShopItem
										key={shop._id}
										shop={shop}
										_id={shop._id}
									/>
								))}
							</div>
						)}
					</CustomTabPanel>
					<CustomTabPanel value={value} index={1}>
						{!bookmarkedProducts ? (
							<LTProgress />
						) : bookmarkedProducts.length === 0 ? (
							<NoData />
						) : (
							<div className="bookmark-products-grid">
								{bookmarkedProducts.map((product) => (
									<ProductItem
										key={product._id}
										product={product}
										user={user}
										showModal={false}
									/>
								))}
							</div>
						)}
					</CustomTabPanel>
				</div>
			)}
		</div>
	);
}
