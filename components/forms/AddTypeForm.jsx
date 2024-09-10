import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import adminAddType from "@/functions/type/adminAddType";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	alias: "",
	label: "",
	image: null,
};

const validationSchema = Yup.object({
	alias: Yup.string().required("وارد کردن نام ضروری است"),
	label: Yup.string().required("وارد کردن نام نمایشی ضروری است"),
});

export default function AddTypeForm(props) {
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
					image: values.image[0],
				};
				await adminAddType(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting }) => (
				<Form className="lt-form panel-form">
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
						ثبت نوع فروشگاه
					</Button>
				</Form>
			)}
		</Formik>
	);
}
