import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import adminUpdateCity from "@/functions/city/adminUpdateCity";
import StateAndCitySelect from "@/components/inputs/StateAndCitySelect";
import LTTextInput from "@/components/inputs/LTTextInput";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Check from "@mui/icons-material/Check";

const initialValues = {
	alias: "",
	label: "",
	state: "",
	status: "",
};

export default function UpdateCityForm(props) {
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedState, setSelectedState] = useState(null);

	const { handleClose, setDoReload, currentData } = props;
	const { name, state } = currentData;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setSelectedCity(name);
		setSelectedState(state);
	}, [name, state]);

	useEffect(() => {
		setSelectedCity(currentData.label);
		setSelectedState(currentData.state);
	}, []);

	return (
		<Formik
			initialValues={currentData || initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					label:
						values.label !== currentData.label
							? values.label
							: null,
					alias:
						values.alias !== currentData.alias
							? values.alias
							: null,
					state:
						values.state !== currentData.state
							? values.state
							: null,
					status:
						values.status !== currentData.status
							? values.status
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
					cityId: currentData.id,
				};

				await adminUpdateCity(dispatch, enqueueSnackbar, finalData);
				setSubmitting(false);
				resetForm();
				setSelectedCity(null);
				setSelectedState(null);
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					<StateAndCitySelect
						selectedCity={selectedCity}
						setSelectedCity={setSelectedCity}
						selectedState={selectedState}
						setSelectedState={setSelectedState}
						setFieldValue={setFieldValue}
					/>

					<LTTextInput name="alias" label="نام شهر (به انگلیسی)" />

					<FormControlLabel
						className="lt-switch-input"
						style={{ marginBottom: "20px", marginTop: "20px" }}
						control={
							<Switch
								checked={values.status === "active"}
								onChange={(e) => {
									handleChange(e);
									setFieldValue(
										"status",
										e.target.checked ? "active" : "inactive"
									);
								}}
								name="status"
							/>
						}
						label={
							values.status === "active" ? (
								<Typography>
									شهر{" "}
									<strong style={{ color: "#FF4500" }}>
										فعال
									</strong>{" "}
									است
								</Typography>
							) : (
								<Typography>
									شهر{" "}
									<strong style={{ color: "#FF4500" }}>
										غیر فعال
									</strong>{" "}
									است
								</Typography>
							)
						}
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={
							isSubmitting || !selectedCity || !selectedState
						}
						style={{ marginTop: "1rem" }}
					>
						<Check />
						به روزرسانی شهر
					</Button>
				</Form>
			)}
		</Formik>
	);
}
