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
import LTProgress from "@/components/global/LTProgress";
import AddProductForm from "@/components/forms/AddProductForm";
import UpdateProductForm from "@/components/forms/UpdateProductForm";
import UpdateCategoryOfShopForm from "@/components/forms/UpdateCategoryOfShopForm";
import PanelModal from "@/components/panel/PanelModal";
import AddCategoryToShopForm from "@/components/forms/AddCategoryToShopForm";
import NoData from "@/components/global/NoData";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BlockIcon from "@mui/icons-material/Block";

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

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const user = useSelector((state) => state.user.data);

	const shopId = user ? user.shopId : "";

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
		async function fetchData() {
			await getShopById(dispatch, enqueueSnackbar, shopId, setShop);
		}
		fetchData();
		setDoReload(false);
	}, [user, dispatch, enqueueSnackbar, shopId, doReload]);

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

			<div>
				{!shop ? (
					<LTProgress />
				) : shop ? (
					<div className="panel-inner-content">
						<div className="product-page-header">
							<Typography variant="h6">
								دسته بندی محصولات
							</Typography>

							<PanelModal
								buttonLabel="اضافه کردن دسته بندی"
								modalHeader="اضافه کردن دسته بندی"
								icon="add"
								variant="contained"
							>
								<AddCategoryToShopForm
									setDoReload={setDoReload}
									shopId={shopId}
								/>
							</PanelModal>
						</div>
						<div className="products-tab">
							<Tabs
								orientation="vertical"
								variant="scrollable"
								scrollButtons="auto"
								value={value}
								onChange={handleChange}
								aria-label="sub-categories"
								sx={{
									borderLeft: 1,
									borderColor: "divider",
									minWidth: "140px",
								}}
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
									className="panel-inner-content"
								>
									<div className="products-tab-header">
										<PanelModal
											buttonLabel={`اضافه کردن آیتم به ${category.name}`}
											modalHeader={`اضافه کردن آیتم به ${category.name}`}
											icon="add"
											variant="outlined"
										>
											<AddProductForm
												setDoReload={setDoReload}
												shopId={shopId}
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
													setDoReload={setDoReload}
													shopId={shopId}
												/>
											</PanelModal>

											<Button
												variant="outlined"
												color="error"
												size="small"
												onClick={() =>
													handleRemoveCategory({
														shopId,
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
														<Avatar
															src={
																item.image
																	.path +
																item.image.img
															}
															sx={{
																width: "70px",
																height: "70px",
															}}
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
					</div>
				) : (
					<NoData />
				)}
			</div>
		</div>
	);
}
