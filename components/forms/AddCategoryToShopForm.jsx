import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import addCategoryToShop from "@/functions/shop/addCategoryToShop";
import LTTextInput from "@/components/global/LTTextInput";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	name: "",
};

const validationSchema = Yup.object({
	name: Yup.string().required("وارد کردن نام ضروری است"),
});

export default function AddCategoryToShopForm(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, shopId } = props;

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
					name: values.name,
					shopId: shopId,
				};
				await addCategoryToShop(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, values }) => (
				<Form className="lt-form panel-form">
					<LTTextInput name="name" label="نام*" />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting || !values.name}
						style={{ marginTop: "1rem" }}
					>
						<AddIcon />
						ثبت دسته بندی جدید
					</Button>
				</Form>
			)}
		</Formik>
	);
}
