"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import getShopById from "@/functions/shop/getShopById";
import deleteProduct from "@/functions/product/deleteProduct";
import deleteCategoryOfShop from "@/functions/shop/deleteCategoryOfShop";
import { priceFormatter } from "@/utils/priceFormatter";
import AddProductForm from "@/components/forms/AddProductForm";
import UpdateProductForm from "@/components/forms/UpdateProductForm";
import UpdateCategoryOfShopForm from "@/components/forms/UpdateCategoryOfShopForm";
import PanelModal from "@/components/panel/PanelModal";
import AddCategoryToShopForm from "@/components/forms/AddCategoryToShopForm";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import LTImage from "@/components/global/LTImage";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import BlockIcon from "@mui/icons-material/Block";
import { Paper } from "@mui/material";

function TabPanel(props) {
	const { children, value, index, category, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 1 }}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	category: PropTypes.object.isRequired,
};

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
	};
}

export default function ProductPage() {
	const [shop, setShop] = useState(null);
	const [doReload, setDoReload] = useState(true);
	const [value, setValue] = useState(0);

	const user = useSelector((state) => state.user.data);

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleRemoveItem = async (productId) => {
		await deleteProduct(dispatch, enqueueSnackbar, productId);
		setDoReload(!doReload);
	};

	const handleRemoveCategory = async ({ shopId, categoryId }) => {
		const data = {
			shopId,
			categoryId,
		};
		await deleteCategoryOfShop(dispatch, enqueueSnackbar, data);
		setDoReload(!doReload);
	};

	useEffect(() => {
		if (!user) return;

		if (!user.shopId) {
			return;
		}

		if (doReload) {
			async function fetchData() {
				await getShopById(
					dispatch,
					enqueueSnackbar,
					user.shopId,
					setShop
				);
			}
			fetchData();
			setDoReload(false);
		}
	}, [user, doReload]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت محصولات</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید محصولات فروشگاه خود را مدیریت کنید.
					</Typography>
				</div>
			</div>

			{!user.shopId ? (
				<div className="panel-inner-content">
					<Alert severity="info" sx={{ marginBottom: "20px" }}>
						شما در حال حاضر فروشگاه فعال ندارید. برای ایجاد فروشگاه
						به صفحه "مدیریت فروشگاه" مراجعه کنید.
					</Alert>
					<NoData />
				</div>
			) : !shop ? (
				<LTProgress />
			) : (
				<div className="panel-inner-content">
					<div className="product-page-header">
						<Typography variant="h6">دسته بندی محصولات</Typography>

						<PanelModal
							buttonLabel="اضافه کردن دسته بندی"
							modalHeader="اضافه کردن دسته بندی"
							icon="add"
							variant="contained"
						>
							<AddCategoryToShopForm
								setDoReload={setDoReload}
								shopId={user.shopId}
							/>
						</PanelModal>
					</div>

					{shop.products.length === 0 ? (
						<Alert severity="info" sx={{ marginBottom: "20px" }}>
							شما در حال حاضر دسته بندی فعال ندارید. برای ایجاد
							دسته بندی جدید دکمه "اضافه کردن دسته بندی" را کلیک
							کنید.
						</Alert>
					) : (
						<Paper className="lt-paper" elevation={1}>
							<div className="products-tab">
								<Tabs
									orientation="vertical"
									variant="scrollable"
									scrollButtons="auto"
									value={value}
									onChange={handleChange}
									aria-label="sub-categories"
									className="products-tab-navigation"
								>
									{shop.products.map((category, index) => (
										<Tab
											key={category._id}
											label={category.name}
											{...a11yProps(index)}
										/>
									))}
								</Tabs>
								{shop.products.map((category, index) => (
									<TabPanel
										key={category._id}
										value={value}
										index={index}
										category={category}
										className="products-tab-content"
									>
										<div className="products-tab-header">
											<PanelModal
												buttonLabel={`اضافه کردن آیتم به ${category.name}`}
												modalHeader={`اضافه کردن آیتم به ${category.name}`}
												icon="add"
												variant="outlined"
												fullScreen={true}
											>
												<AddProductForm
													setDoReload={setDoReload}
													shopId={shop.id}
													category={category}
												/>
											</PanelModal>

											<div className="products-tab-header-btns">
												<PanelModal
													data={category}
													buttonLabel={`ویرایش ${category.name}`}
													modalHeader="ویرایش دسته بندی"
													type="table"
													icon="edit"
													tooltipTitle="ویرایش دسته بندی"
													variant="outlined"
												>
													<UpdateCategoryOfShopForm
														setDoReload={
															setDoReload
														}
														shopId={shop.id}
													/>
												</PanelModal>

												<Button
													variant="outlined"
													color="error"
													size="small"
													onClick={() =>
														handleRemoveCategory({
															shopId: shop.id,
															categoryId:
																category._id,
														})
													}
												>
													<BlockIcon />
													{`حذف ${category.name}`}
												</Button>
											</div>
										</div>

										{category.items.map((item) => (
											<div
												key={item._id}
												className="products-wrapper"
											>
												<div className="product-box">
													<div className="product-box-main">
														<div className="product-box-img">
															<LTImage
																name={
																	item.image
																}
																variant="rounded"
																width={70}
																height={70}
															/>
														</div>
														<div className="product-box-content">
															<div className="product-box-info">
																<Typography variant="h6">
																	{item.name}
																</Typography>
																<Typography variant="body2">
																	{
																		item.description
																	}
																</Typography>
																<div className="product-box-measurement">
																	{item.size && (
																		<Typography variant="body2">
																			{
																				item.size
																			}{" "}
																			{item.sizeUnit ===
																			"centimeter"
																				? "سانتیمتر"
																				: "متر"}
																		</Typography>
																	)}
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
																		<Typography variant="body2">
																			{
																				item.quantity
																			}{" "}
																			عدد
																		</Typography>
																	)}
																</div>
															</div>
															<div className="product-box-meta">
																<div className="product-box-price">
																	{item.discount &&
																		priceFormatter(
																			item.finalPrice
																		)}
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
																		<Typography variant="body2">
																			{priceFormatter(
																				item.price
																			)}
																		</Typography>
																	)}
																	<Typography variant="body2">
																		تومان
																	</Typography>
																</div>
																{item.discount && (
																	<Typography variant="body2">
																		تخفیف:{" "}
																		{item.discountType ===
																		"amount"
																			? priceFormatter(
																					item.discount
																			  )
																			: item.discount}{" "}
																		{item.discountType ===
																		"percent"
																			? "%"
																			: "تومان"}{" "}
																	</Typography>
																)}
															</div>
														</div>
													</div>
													<div className="product-box-actions">
														<PanelModal
															data={item}
															buttonLabel="ویرایش آیتم"
															modalHeader="ویرایش آیتم"
															type="table"
															icon="edit"
															variant="outlined"
															tooltipTitle="ویرایش دسته بندی محصولات"
															fullScreen={true}
														>
															<UpdateProductForm
																setDoReload={
																	setDoReload
																}
															/>
														</PanelModal>
														<Button
															variant="outlined"
															color="error"
															size="small"
															onClick={() =>
																handleRemoveItem(
																	item._id
																)
															}
														>
															<BlockIcon />
															حذف آیتم
														</Button>
													</div>
												</div>
											</div>
										))}
									</TabPanel>
								))}
							</div>
						</Paper>
					)}
				</div>
			)}
		</div>
	);
}
