import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import adminAddCity from "@/functions/city/adminAddCity";
import StateAndCitySelect from "@/components/global/StateAndCitySelect";
import LTTextInput from "@/components/global/LTTextInput";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	alias: "",
	label: "",
	state: "",
};

const validationSchema = Yup.object({
	alias: Yup.string().required("وارد کردن نام شهر به انگلیسی ضروری است"),
	label: Yup.string().required("انتخاب شهر ضروری است"),
	state: Yup.string().required("انتخاب استان ضروری است"),
});

export default function AddCityForm(props) {
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedState, setSelectedState] = useState(null);

	const { handleClose, setDoReload } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

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

	return (
		<Formik
			initialValues={initialValues}
			validate={validate}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					alias: values.alias,
					label: selectedCity,
					state: selectedState,
				};
				await adminAddCity(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setSelectedCity(null);
				setSelectedState(null);
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, setFieldValue }) => (
				<Form className="lt-form panel-form">
					<StateAndCitySelect
						selectedCity={selectedCity}
						setSelectedCity={setSelectedCity}
						selectedState={selectedState}
						setSelectedState={setSelectedState}
						setFieldValue={setFieldValue}
					/>

					<LTTextInput name="alias" label="نام شهر (به انگلیسی)*" />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<AddIcon />
						ثبت شهر
					</Button>
				</Form>
			)}
		</Formik>
	);
}
