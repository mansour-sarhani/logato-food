"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import getAllTypes from "@/functions/type/getAllTypes";
import getChildrenOfType from "@/functions/type/getChildrenOfType";
import getAllCities from "@/functions/city/getAllCities";
import adminAddShop from "@/functions/shop/adminAddShop";
import addNewShop from "@/functions/shop/addNewShop";
import { Formik, Form } from "formik";
import { ErrorMessage } from "formik";
import * as Yup from "yup";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import LTTextArea from "@/components/global/LTTextArea";
import LTTimePicker from "@/components/global/LTTimePicker";
import LTPointOnMap from "@/components/global/LTPointOnMap";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	name: "",
	ownerValue: null,
	ownerId: null,
	ownerName: null,
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

const validationSchema = Yup.object({
	name: Yup.string().required("وارد کردن نام فروشگاه ضروری است"),
	address: Yup.string().required("وارد کردن آدرس ضروری است"),
	typeId: Yup.string().required("انتخاب نوع فروشگاه ضروری است"),
	cityId: Yup.string().required("انتخاب شهر ضروری است"),
	latitude: Yup.string().required(
		"وارد کردن مختصات فروشگاه بر روی نقشه ضروری است"
	),
	longitude: Yup.string().required(
		"وارد کردن مختصات فروشگاه بر روی نقشه ضروری است"
	),
});

export default function AddShopForm(props) {
	const [types, setTypes] = useState([]);
	const [categories, setCategories] = useState();
	const [cities, setCities] = useState([]);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();

	const { ownerValue, ownerId, ownerName, role } = props;

	const handleCityChange = (event, handleChange, setFieldValue) => {
		handleChange(event);

		if (event.target.value) {
			const selectedCity = JSON.parse(event.target.value);
			setFieldValue("cityValue", selectedCity.cityValue);
			setFieldValue("cityId", selectedCity.cityId);
			setFieldValue("cityLabel", selectedCity.cityLabel);
			setFieldValue("cityState", selectedCity.cityState);
		}
	};

	const handleTypeChange = (event, handleChange, setFieldValue) => {
		handleChange(event);

		if (event.target.value) {
			const selectedType = JSON.parse(event.target.value);
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

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					name: values.name,
					ownerValue:
						role === "superAdmin" || role === "admin"
							? null
							: ownerValue,
					ownerId:
						role === "superAdmin" || role === "admin"
							? null
							: ownerId,
					ownerName:
						role === "superAdmin" || role === "admin"
							? null
							: ownerName,
					typeValue: values.typeValue,
					typeId: values.typeId,
					typeLabel: values.typeLabel,
					cityValue: values.cityValue,
					cityId: values.cityId,
					cityLabel: values.cityLabel,
					cityState: values.cityState,
					categories: values.categories,
					subCategories: values.subCategories,
					description: values.description,
					address: values.address,
					phone: values.phone,
					email: values.email,
					openHour: values.openHour,
					closeHour: values.closeHour,
					hasDelivery: values.hasDelivery,
					priceClass: values.priceClass,
					latitude: values.latitude,
					longitude: values.longitude,
					logo: values.logo ? values.logo[0] : null,
					cover: values.cover ? values.cover[0] : null,
					createdByAdmin: role === "superAdmin" || role === "admin",
				};

				if (role === "superAdmin" || role === "admin") {
					await adminAddShop(dispatch, enqueueSnackbar, data);
				} else {
					await addNewShop(dispatch, enqueueSnackbar, data);
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
						<FileUploader title="لوگو" name="logo" number={1} />
						<FileUploader
							title="تصویر کاور"
							name="cover"
							number={1}
						/>
					</div>

					<div className="panel-grid-one">
						<LTTextInput name="name" label="نام فروشگاه*" />
					</div>

					<div className="panel-grid-two">
						<FormControl className="lt-form-control">
							<label htmlFor="typeId-select" className="lt-label">
								نوع فروشگاه*
							</label>
							<NativeSelect
								defaultValue={""}
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
								<option value="">
									لطفا نوع فروشگاه را انتخاب نمایید
								</option>
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

							<FormHelperText className="lt-form-error">
								<ErrorMessage name={"typeId"} />
							</FormHelperText>
						</FormControl>

						<FormControl className="lt-form-control">
							<label htmlFor="cityId-select" className="lt-label">
								شهر*
							</label>
							<NativeSelect
								defaultValue={""}
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
								<option value="">
									لطفا شهر را انتخاب نمایید
								</option>
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
							<FormHelperText className="lt-form-error">
								<ErrorMessage name={"cityId"} />
							</FormHelperText>
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
						/>
					</div>

					<div className="panel-grid-one">
						<LTTextInput name="address" label="آدرس*" />
					</div>

					<label className="lt-label">
						لطفا موقعیت فروشگاه خود را روی نقشه مشخص کنید*.
					</label>
					<LTPointOnMap setFieldValue={setFieldValue} />
					<FormHelperText className="lt-form-error">
						<ErrorMessage name={"latitude"} />
					</FormHelperText>

					<div className="panel-grid-two">
						<LTTimePicker
							name="openHour"
							label="ساعت باز شدن"
							setFieldValue={setFieldValue}
						/>
						<LTTimePicker
							name="closeHour"
							label="ساعت بسته شدن"
							setFieldValue={setFieldValue}
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
								defaultValue={""}
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
						<AddIcon />
						ثبت فروشگاه
					</Button>
				</Form>
			)}
		</Formik>
	);
}
