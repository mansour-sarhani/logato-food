import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import userUpdateAddress from "@/functions/user/userUpdateAddress";
import getAllCities from "@/functions/city/getAllCities";
import LTTextInput from "@/components/inputs/LTTextInput";
import LTPointOnMap from "@/components/map/LTPointOnMap";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import NativeSelect from "@mui/material/NativeSelect";
import FormControl from "@mui/material/FormControl";
import Check from "@mui/icons-material/Check";

const initialValues = {
	title: "",
	address: "",
	cityId: "",
	cityLabel: "",
	cityState: "",
	latitude: "",
	longitude: "",
	default: false,
};

export default function UpdateAddressForm(props) {
	const [cities, setCities] = useState([]);
	const [selectedCity, setSelectedCity] = useState("");

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, currentData } = props;

	useEffect(() => {
		async function fetchCities() {
			getAllCities(dispatch, enqueueSnackbar, setCities);
		}
		fetchCities();
	}, []);

	useEffect(() => {
		if (currentData) {
			setSelectedCity(
				JSON.stringify({
					cityId: currentData.cityId,
					cityLabel: currentData.cityLabel,
					cityState: currentData.cityState,
				})
			);
		}
	}, [currentData]);

	return (
		<Formik
			initialValues={currentData || initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					title:
						values.title !== currentData.title
							? values.title
							: null,
					address:
						values.address !== currentData.address
							? values.address
							: null,
					cityId:
						values.cityId !== currentData.cityId
							? values.cityId
							: null,
					cityLabel:
						values.cityLabel !== currentData.cityLabel
							? values.cityLabel
							: null,
					cityState:
						values.cityState !== currentData.cityState
							? values.cityState
							: null,
					latitude:
						values.latitude !== currentData.latitude
							? values.latitude
							: null,
					longitude:
						values.longitude !== currentData.longitude
							? values.longitude
							: null,
					default:
						values.default !== currentData.default
							? values.default
							: null,
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
					addressId: currentData._id,
				};

				await userUpdateAddress(dispatch, enqueueSnackbar, finalData);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, setFieldValue, handleChange, values }) => (
				<Form className="lt-form panel-form">
					<LTTextInput name="title" label="عنوان" />
					<LTTextInput name="address" label="آدرس" />

					<FormControl className="lt-form-control">
						<label htmlFor="cityId" className="lt-label">
							شهر
						</label>
						<NativeSelect
							value={selectedCity}
							inputProps={{
								id: "cityId",
							}}
							onChange={(e) => {
								const selectedValue = JSON.parse(
									e.target.value
								);
								handleChange(e);
								setFieldValue("cityId", selectedValue.cityId);
								setFieldValue(
									"cityLabel",
									selectedValue.cityLabel
								);
								setFieldValue(
									"cityState",
									selectedValue.cityState
								);
								setSelectedCity(e.target.value);
							}}
							className="lt-select"
						>
							{cities.map((city) => (
								<option
									key={city.id}
									value={JSON.stringify({
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

					{currentData.default ? null : (
						<FormControlLabel
							className="lt-switch-input"
							style={{ marginBottom: "20px", marginTop: "20px" }}
							control={
								<Switch
									checked={values.default}
									onChange={(e) => {
										handleChange(e);
										setFieldValue(
											"default",
											e.target.checked ? true : false
										);
									}}
									name="default"
								/>
							}
							label={
								values.default ? (
									<Typography>
										به عنوان آدرس فعلی{" "}
										<strong style={{ color: "#FF4500" }}>
											باشد
										</strong>
									</Typography>
								) : (
									<Typography>
										به عنوان آدرس فعلی{" "}
										<strong style={{ color: "#FF4500" }}>
											نباشد
										</strong>
									</Typography>
								)
							}
						/>
					)}

					<label className="lt-label">
						لطفا موقعیت فروشگاه خود را روی نقشه مشخص کنید.
					</label>
					<LTPointOnMap
						savedLatitude={values.latitude}
						savedLongitude={values.longitude}
						setFieldValue={setFieldValue}
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<Check />
						به روزرسانی آدرس
					</Button>
				</Form>
			)}
		</Formik>
	);
}
