import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import getAllCities from "@/functions/city/getAllCities";
import adminUpdateShop from "@/functions/shop/adminUpdateShop";
import updateShop from "@/functions/shop/updateShop";
import getShopById from "@/functions/shop/getShopById";
import getAllTypes from "@/functions/type/getAllTypes";
import getChildrenOfType from "@/functions/type/getChildrenOfType";
import { Formik, Form } from "formik";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import LTTextArea from "@/components/global/LTTextArea";
import LTTimePicker from "@/components/global/LTTimePicker";
import LTPointOnMap from "@/components/global/LTPointOnMap";
import LTProgress from "@/components/global/LTProgress";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Check from "@mui/icons-material/Check";

const initialValues = {
	name: "",
	ownerValue: "",
	ownerId: "",
	ownerName: "",
	typeValue: "",
	typeId: "",
	typeLabel: "",
	cityValue: "",
	cityId: "",
	cityLabel: "",
	cityState: "",
	categories: [],
	subCategories: [],
	description: "",
	address: "",
	phone: "",
	email: "",
	openHour: "",
	closeHour: "",
	hasDelivery: false,
	priceClass: "all",
	latitude: "",
	longitude: "",
	logo: null,
	cover: null,
};

export default function UpdateShopForm(props) {
	const [currentShop, setCurrentShop] = useState(null);
	const [types, setTypes] = useState(null);
	const [categories, setCategories] = useState(null);
	const [cities, setCities] = useState(null);
	const [selectedType, setSelectedType] = useState("");
	const [selectedCity, setSelectedCity] = useState("");

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();

	const { shopId, role } = props;

	const formattedValues = currentShop && {
		id: currentShop.id,
		status: currentShop.status,
		name: currentShop.name,
		email: currentShop.email,
		phone: currentShop.phone,
		description: currentShop.description,
		address: currentShop.address,
		categories: currentShop.categories,
		subCategories: currentShop.subCategories,
		openHour: currentShop.openHour,
		closeHour: currentShop.closeHour,
		hasDelivery: currentShop.hasDelivery,
		priceClass: currentShop.priceClass,
		latitude: currentShop.latitude,
		longitude: currentShop.longitude,
		cover: currentShop.cover,
		logo: currentShop.logo,
		cityId: currentShop.city.cityId,
		cityValue: currentShop.city.value,
		cityLabel: currentShop.city.cityLabel,
		cityState: currentShop.city.cityState,
		typeId: currentShop.type.typeId,
		typeValue: currentShop.type.value,
		typeLabel: currentShop.type.typeLabel,
		ownerId: currentShop.owner.ownerId,
		ownerValue: currentShop.owner.value,
		ownerName: currentShop.owner.ownerName,
	};

	const handleCityChange = (event, handleChange, setFieldValue) => {
		handleChange(event);

		if (event.target.value) {
			const selectedCity = JSON.parse(event.target.value);
			setSelectedCity(event.target.value);
			setFieldValue("cityValue", selectedCity.cityValue);
			setFieldValue("cityId", selectedCity.cityId);
			setFieldValue("cityLabel", selectedCity.cityLabel);
			setFieldValue("cityState", selectedCity.cityState);
		}
	};

	const handleTypeChange = (event, handleChange, setFieldValue) => {
		handleChange(event);
		if (event.target.value || event.target.value !== "") {
			const selectedType = JSON.parse(event.target.value);
			setSelectedType(event.target.value);
			setFieldValue("typeValue", selectedType.typeValue);
			setFieldValue("typeId", selectedType.typeId);
			setFieldValue("typeLabel", selectedType.typeLabel);

			getChildrenOfType(
				dispatch,
				enqueueSnackbar,
				selectedType.typeId,
				setCategories
			);
		} else {
			setFieldValue("typeValue", "");
			setFieldValue("typeId", "");
			setFieldValue("typeLabel", "");
			setSelectedType("");
			setCategories();
		}
	};

	const handleCategoryChange = (category, values, setFieldValue) => {
		const { _id, label, value } = category;
		const newCategories = [...values.categories];
		const index = newCategories.findIndex(
			(item) => item.categoryId === _id
		);

		if (index > -1) {
			newCategories.splice(index, 1);
		} else {
			newCategories.push({
				value: value,
				categoryId: _id,
				categoryLabel: label,
			});
		}

		setFieldValue("categories", newCategories);
	};

	const handleSubCategoryChange = (subCategory, values, setFieldValue) => {
		const { _id, label, value } = subCategory;
		const newSubCategories = [...values.subCategories];
		const index = newSubCategories.findIndex(
			(item) => item.subCategoryId === _id
		);

		if (index > -1) {
			newSubCategories.splice(index, 1);
		} else {
			newSubCategories.push({
				value: value,
				subCategoryId: _id,
				subCategoryLabel: label,
			});
		}

		setFieldValue("subCategories", newSubCategories);
	};

	useEffect(() => {
		async function fetchShop() {
			await getShopById(
				dispatch,
				enqueueSnackbar,
				shopId,
				setCurrentShop
			);
		}
		fetchShop();
	}, [shopId]);

	useEffect(() => {
		async function fetchTypes() {
			await getAllTypes(dispatch, enqueueSnackbar, setTypes);
		}
		fetchTypes();
	}, []);

	useEffect(() => {
		async function fetchCities() {
			await getAllCities(dispatch, enqueueSnackbar, setCities);
		}
		fetchCities();
	}, []);

	useEffect(() => {
		if (currentShop) {
			setSelectedType(
				JSON.stringify({
					typeValue: formattedValues.typeValue,
					typeId: formattedValues.typeId,
					typeLabel: formattedValues.typeLabel,
				})
			);

			async function fetchCategories() {
				await getChildrenOfType(
					dispatch,
					enqueueSnackbar,
					formattedValues.typeId,
					setCategories
				);
			}
			fetchCategories();
		}
	}, [currentShop]);

	useEffect(() => {
		if (currentShop) {
			setSelectedCity(
				JSON.stringify({
					cityValue: formattedValues.cityValue,
					cityId: formattedValues.cityId,
					cityLabel: formattedValues.cityLabel,
					cityState: formattedValues.cityState,
				})
			);
		}
	}, [currentShop]);

	return !currentShop || !types || !cities || !categories ? (
		<LTProgress />
	) : (
		<Formik
			initialValues={formattedValues || initialValues}
			enableReinitialize
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					shopId,
					name: values.name !== currentShop.name ? values.name : null,
					ownerValue:
						values.ownerValue !== currentShop.owner.value
							? values.ownerValue
							: null,
					ownerId:
						values.ownerId !== currentShop.owner.ownerId
							? values.ownerId
							: null,
					ownerName:
						values.ownerName !== currentShop.owner.ownerName
							? values.ownerName
							: null,
					typeValue:
						values.typeValue !== currentShop.type.value
							? values.typeValue
							: null,
					typeId:
						values.typeId !== currentShop.type.typeId
							? values.typeId
							: null,
					typeLabel:
						values.typeLabel !== currentShop.type.typeLabel
							? values.typeLabel
							: null,
					cityValue:
						values.cityValue !== currentShop.city.value
							? values.cityValue
							: null,
					cityId:
						values.cityId !== currentShop.city.cityId
							? values.cityId
							: null,
					cityLabel:
						values.cityLabel !== currentShop.city.cityLabel
							? values.cityLabel
							: null,
					cityState:
						values.cityState !== currentShop.city.cityState
							? values.cityState
							: null,
					categories: values.categories,
					subCategories: values.subCategories,
					description:
						values.description !== currentShop.description
							? values.description
							: null,
					address:
						values.address !== currentShop.address
							? values.address
							: null,
					phone:
						values.phone !== currentShop.phone
							? values.phone
							: null,
					email:
						values.email !== currentShop.email
							? values.email
							: null,
					openHour:
						values.openHour !== currentShop.openHour
							? values.openHour
							: null,
					closeHour:
						values.closeHour !== currentShop.closeHour
							? values.closeHour
							: null,
					hasDelivery:
						values.hasDelivery !== currentShop.hasDelivery
							? values.hasDelivery
							: null,
					priceClass:
						values.priceClass !== currentShop.priceClass
							? values.priceClass
							: null,
					status:
						values.status !== currentShop.status
							? values.status
							: null,
					latitude:
						values.latitude !== currentShop.latitude
							? values.latitude
							: null,
					longitude:
						values.longitude !== currentShop.longitude
							? values.longitude
							: null,
					logo: values.newLogo ? values.newLogo[0] : null,
					cover: values.newCover ? values.newCover[0] : null,
					createdByAdmin: role === "superAdmin" || role === "admin",
				};

				function filteredData(data) {
					const result = {};
					for (const key in data) {
						if (data[key] !== null) {
							result[key] = data[key];
						}
					}
					return result;
				}

				const filtered = filteredData(data);

				const finalData = {
					...filtered,
					shopId: shopId,
				};

				if (role === "superAdmin" || role === "admin") {
					await adminUpdateShop(dispatch, enqueueSnackbar, finalData);
				} else {
					await updateShop(dispatch, enqueueSnackbar, finalData);
				}

				setSubmitting(false);
				resetForm();
				if (role === "superAdmin" || role === "admin") {
					router.push("/panel/shops?new=true");
				} else {
					router.push("/panel/shop?new=true");
				}
			}}
		>
			{({ isSubmitting, values, handleChange, setFieldValue }) => (
				<Form className="lt-form panel-form">
					<div className="panel-grid-two">
						<div className="panel-new-img-container">
							<Avatar
								src={values.logo.path + values.logo.img}
								sx={{ width: 100, height: 100 }}
							/>
							<FileUploader
								title="تصویر لوگو جدید"
								name="newLogo"
								number={1}
							/>
						</div>

						<div className="panel-new-img-container">
							<Avatar
								src={values.cover.path + values.cover.img}
								sx={{ width: 100, height: 100 }}
							/>
							<FileUploader
								title="تصویر کاور جدید"
								name="newCover"
								number={1}
							/>
						</div>
					</div>
					<div className="panel-grid-two">
						<LTTextInput name="name" label="نام فروشگاه" />

						<FormControl className="lt-form-control">
							<label htmlFor="status-select" className="lt-label">
								وضعیت فروشگاه
							</label>
							<NativeSelect
								value={values.status}
								inputProps={{
									id: "status-select",
								}}
								onChange={(e) => {
									setFieldValue("status", e.target.value);
								}}
								className="lt-select"
							>
								<option value="active">فعال</option>
								<option value="inactive">غیرفعال</option>
								{(role === "superAdmin" ||
									role === "admin") && (
									<>
										<option value="banned">مسدود</option>
										<option value="underReview">
											در انتظار تایید
										</option>
									</>
								)}
							</NativeSelect>
						</FormControl>
					</div>
					<div className="panel-grid-two">
						{types.length !== 0 && (
							<FormControl className="lt-form-control">
								<label
									htmlFor="typeId-select"
									className="lt-label"
								>
									نوع فروشگاه
								</label>
								<NativeSelect
									value={selectedType}
									inputProps={{
										id: "typeId-select",
									}}
									onChange={(event) =>
										handleTypeChange(
											event,
											handleChange,
											setFieldValue
										)
									}
									className="lt-select"
								>
									{types.map((type) => (
										<option
											key={type.id}
											value={JSON.stringify({
												typeValue: type.value,
												typeId: type.id,
												typeLabel: type.label,
											})}
										>
											{type.label}
										</option>
									))}
								</NativeSelect>
							</FormControl>
						)}

						<FormControl className="lt-form-control">
							<label htmlFor="cityId-select" className="lt-label">
								شهر
							</label>
							<NativeSelect
								value={selectedCity}
								inputProps={{
									id: "cityId-select",
								}}
								onChange={(event) => {
									handleCityChange(
										event,
										handleChange,
										setFieldValue
									);
								}}
								className="lt-select"
							>
								{cities.map((city) => (
									<option
										key={city.id}
										value={JSON.stringify({
											cityValue: city.value,
											cityId: city.id,
											cityLabel: city.label,
											cityState: city.state,
										})}
									>
										{city.label}
									</option>
								))}
							</NativeSelect>
						</FormControl>
					</div>

					<div className="panel-categories-wrapper">
						<label className="lt-label">دسته بندی محصولات</label>
						{!categories ? (
							<Typography>
								لطفا انتخاب نوع فروشگاه را انجام دهید.
							</Typography>
						) : categories.length > 0 ? (
							categories.map((category) => (
								<FormGroup key={category._id}>
									<FormControlLabel
										control={
											<Checkbox
												checked={values.categories.some(
													(item) =>
														item.categoryId ===
														category._id
												)}
												onChange={() =>
													handleCategoryChange(
														category,
														values,
														setFieldValue
													)
												}
											/>
										}
										label={category.label}
									/>
									<FormGroup className="lt-child-checkbox">
										{category.subCategories
											.filter(
												(subCategory) =>
													subCategory.status ===
													"active"
											)
											.map((subCategory) => (
												<FormControlLabel
													key={subCategory._id}
													control={
														<Checkbox
															checked={values.subCategories.some(
																(item) =>
																	item.subCategoryId ===
																	subCategory._id
															)}
															onChange={() =>
																handleSubCategoryChange(
																	subCategory,
																	values,
																	setFieldValue
																)
															}
														/>
													}
													label={subCategory.label}
												/>
											))}
									</FormGroup>
								</FormGroup>
							))
						) : (
							<Typography>
								هیچ دسته بندی برای این نوع فروشگاه وجود ندارد.
							</Typography>
						)}
					</div>

					<div className="panel-grid-two">
						<LTTextInput name="phone" label="تلفن" />
						<LTTextInput name="email" label="ایمیل" />
					</div>

					<div className="panel-grid-one">
						<LTTextArea
							name="description"
							label="توضیحات"
							setFieldValue={setFieldValue}
							value={values.description}
						/>
					</div>

					<div className="panel-grid-one">
						<LTTextInput name="address" label="آدرس" />
					</div>

					<label className="lt-label">
						لطفا موقعیت فروشگاه خود را روی نقشه مشخص کنید.
					</label>
					<LTPointOnMap
						setFieldValue={setFieldValue}
						savedLatitude={values.latitude}
						savedLongitude={values.longitude}
					/>

					<div className="panel-grid-two">
						<LTTimePicker
							name="openHour"
							label="ساعت باز شدن"
							setFieldValue={setFieldValue}
							savedValue={values.openHour}
						/>
						<LTTimePicker
							name="closeHour"
							label="ساعت بسته شدن"
							setFieldValue={setFieldValue}
							savedValue={values.closeHour}
						/>
					</div>

					<div className="panel-grid-two">
						<FormControl className="lt-form-control">
							<label
								htmlFor="priceClass-select"
								className="lt-label"
							>
								کلاس قیمتی
							</label>
							<NativeSelect
								value={values.priceClass}
								inputProps={{
									name: "priceClass",
									id: "cityId-select",
								}}
								onChange={(e) => {
									handleChange(e);
									setFieldValue("priceClass", e.target.value);
								}}
								className="lt-select"
							>
								<option value="">
									لطفا کلاس قیمتی را انتخاب نمایید
								</option>
								<option value="all">همه</option>
								<option value="economy">اقتصادی</option>
								<option value="average">متوسط</option>
								<option value="luxury">لوکس</option>
							</NativeSelect>
						</FormControl>

						<FormControlLabel
							className="lt-switch-input"
							control={
								<Switch
									checked={values.hasDelivery}
									onChange={(e) => {
										handleChange(e);
										setFieldValue(
											"hasDelivery",
											e.target.checked ? true : false
										);
									}}
									name="hasDelivery"
								/>
							}
							label={
								values.hasDelivery ? (
									<Typography>
										دارای{" "}
										<strong style={{ color: "#FF4500" }}>
											سرویس دلیوری
										</strong>{" "}
										است
									</Typography>
								) : (
									<Typography>
										دارای{" "}
										<strong style={{ color: "#FF4500" }}>
											سرویس دلیوری
										</strong>{" "}
										نیست
									</Typography>
								)
							}
						/>
					</div>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<Check />
						به روز رسانی فروشگاه
					</Button>
				</Form>
			)}
		</Formik>
	);
}
