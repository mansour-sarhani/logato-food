import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import adminAddCategory from "@/functions/category/adminAddCategory";
import getAllTypes from "@/functions/type/getAllTypes";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	alias: "",
	label: "",
	parentTypeId: "",
	image: null,
};

const validationSchema = Yup.object({
	alias: Yup.string().required("وارد کردن نام ضروری است"),
	label: Yup.string().required("وارد کردن نام نمایشی ضروری است"),
	parentTypeId: Yup.string().required("انتخاب نوع فروشگاه ضروری است"),
});

export default function AddCategoryForm(props) {
	const [types, setTypes] = useState([]);

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
		async function fetchTypes() {
			getAllTypes(dispatch, enqueueSnackbar, setTypes);
		}
		fetchTypes();
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			validate={validate}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					alias: values.alias,
					label: values.label,
					parentTypeId: values.parentTypeId,
					image: values.image[0],
				};
				await adminAddCategory(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, values, handleChange, setFieldValue }) => (
				<Form className="lt-form panel-form">
					{types && (
						<FormControl className="lt-form-control">
							<label htmlFor="types-select" className="lt-label">
								نوع فروشگاه*
							</label>
							<NativeSelect
								value={values.parentTypeId || ""}
								inputProps={{
									name: "parentTypeId",
									id: "types-select",
								}}
								onChange={(e) => {
									handleChange(e);
									setFieldValue(
										"parentTypeId",
										e.target.value
									);
								}}
								className="lt-select"
							>
								<option value="">
									لطفا نوع فروشگاه را انتخاب نمایید
								</option>
								{types.map((type) => (
									<option key={type.id} value={type.id}>
										{type.label}
									</option>
								))}
							</NativeSelect>
							<FormHelperText className="lt-form-error">
								<ErrorMessage name="parentTypeId" />
							</FormHelperText>
						</FormControl>
					)}

					<LTTextInput name="alias" label="عنوان (به انگلیسی)*" />
					<LTTextInput name="label" label="عنوان نمایشی*" />

					<FileUploader title="تصویر" name="image" number={1} />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<AddIcon />
						ثبت دسته بندی
					</Button>
				</Form>
			)}
		</Formik>
	);
}
