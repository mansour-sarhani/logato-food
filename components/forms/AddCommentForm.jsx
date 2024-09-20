import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import { ErrorMessage } from "formik";
import * as Yup from "yup";
import addComment from "@/functions/comment/addComment";
import LTTextArea from "@/components/inputs/LTTextArea";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MessageIcon from "@mui/icons-material/Message";

const initialValues = {
	body: "",
	rating: "",
};

const validationSchema = Yup.object({
	body: Yup.string().required("وارد کردن متن ضروری است"),
	rating: Yup.string().required("امتیاز دادن هنگام ثبت نظر است"),
});

export default function AddCommentForm(props) {
	const [value, setValue] = useState(null);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const {
		shop,
		user,
		productId,
		productName,
		commentOn,
		isOriginalComment,
		handleClose,
	} = props;

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
					body: values.body,
					rating: values.rating,
					userId: user.id,
					userName: user.firstName,
					shopId: shop.id,
					shopName: shop.name,
					productId: productId,
					productName: productName,
					commentOn: commentOn,
					isOriginalComment: isOriginalComment,
				};
				await addComment(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				setValue(null);
				resetForm();
				handleClose(true);
			}}
		>
			{({ isSubmitting, setFieldValue }) => (
				<Form className="lt-form panel-form">
					<LTTextArea name="body" label="نظر شما*" />

					<label className="lt-label">لطفا امتیاز ثبت کنید*.</label>
					<FormControl className="lt-form-control">
						<Rating
							name="rating"
							value={value}
							onChange={(event, newValue) => {
								setValue(newValue);
								setFieldValue("rating", newValue);
							}}
						/>
					</FormControl>
					<FormHelperText className="lt-form-error">
						<ErrorMessage name={"rating"} />
					</FormHelperText>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<MessageIcon />
						ثبت نظر
					</Button>
				</Form>
			)}
		</Formik>
	);
}
