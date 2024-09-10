import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import { ErrorMessage } from "formik";
import * as Yup from "yup";
import getAllCities from "@/functions/city/getAllCities";
import userAddAddress from "@/functions/user/userAddAddress";
import LTTextInput from "@/components/global/LTTextInput";
import LTPointOnMap from "@/components/global/LTPointOnMap";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import NativeSelect from "@mui/material/NativeSelect";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	title: "",
	address: "",
	cityId: "",
	cityName: "",
	cityState: "",
	latitude: "",
	longitude: "",
};

const validationSchema = Yup.object({
	title: Yup.string().required("وارد کردن عنوان آدرس ضروری است"),
	address: Yup.string().required("وارد کردن آدرس ضروری است"),
	cityId: Yup.string().required("انتخاب شهر ضروری است"),
	latitude: Yup.string().required(
		"وارد کردن مختصات فروشگاه بر روی نقشه ضروری است"
	),
	longitude: Yup.string().required(
		"وارد کردن مختصات فروشگاه بر روی نقشه ضروری است"
	),
});

export default function AddAddressForm(props) {
	const [cities, setCities] = useState([]);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload } = props;

	const validate = (values) => {
		const errors = {};
		try {
			validationSchema.validateSync(values, { abortEarly: false });
		} catch (validationErrors) {
			validationErrors.inner.forEach((error) => {
				errors[error.path] = error.message;
				enqueueSnackbar(error.message, { variant: "error" });
			});
		}
		return errors;
	};

	useEffect(() => {
		async function fetchCities() {
			getAllCities(dispatch, enqueueSnackbar, setCities);
		}
		fetchCities();
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			validate={validate}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					title: values.title,
					address: values.address,
					cityId: values.cityId,
					cityLabel: values.cityLabel,
					cityState: values.cityState,
					latitude: values.latitude,
					longitude: values.longitude,
				};
				await userAddAddress(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, setFieldValue, handleChange }) => (
				<Form className="lt-form panel-form">
					<LTTextInput name="title" label="عنوان*" />
					<LTTextInput name="address" label="آدرس*" />

					<FormControl className="lt-form-control">
						<label htmlFor="cityId-select" className="lt-label">
							شهر*
						</label>
						<NativeSelect
							defaultValue={""}
							inputProps={{
								id: "cityId-select",
							}}
							onChange={(e) => {
								const selectedCity = JSON.parse(e.target.value);
								handleChange(e);
								setFieldValue("cityId", selectedCity.cityId);
								setFieldValue(
									"cityLabel",
									selectedCity.cityLabel
								);
								setFieldValue(
									"cityState",
									selectedCity.cityState
								);
							}}
							className="lt-select"
						>
							<option value="">لطفا شهر را انتخاب نمایید</option>
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
						<FormHelperText className="lt-form-error">
							<ErrorMessage name={"cityId"} />
						</FormHelperText>
					</FormControl>

					<label className="lt-label">
						لطفا موقعیت فروشگاه خود را روی نقشه مشخص کنید*.
					</label>
					<LTPointOnMap setFieldValue={setFieldValue} />
					<FormHelperText className="lt-form-error">
						<ErrorMessage name={"latitude"} />
					</FormHelperText>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<AddIcon />
						ثبت آدرس
					</Button>
				</Form>
			)}
		</Formik>
	);
}
