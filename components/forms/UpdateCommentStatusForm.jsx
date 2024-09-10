import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import updateCommentStatus from "@/functions/comment/updateCommentStatus";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import CheckIcon from "@mui/icons-material/Check";

const initialValues = {
	status: "",
};

export default function UpdateCommentStatusForm(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, commentId } = props;

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					status: values.status,
					commentId: commentId,
				};
				await updateCommentStatus(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, values, handleChange, setFieldValue }) => (
				<Form className="lt-form panel-form">
					<FormControl className="lt-form-control">
						<label htmlFor="status" className="lt-label">
							وضعیت
						</label>
						<NativeSelect
							value={values.status || "underReview"}
							inputProps={{
								name: "status",
								id: "status",
							}}
							onChange={(e) => {
								handleChange(e);
								setFieldValue("status", e.target.value);
							}}
							className="lt-select"
						>
							<option value="underReview">در حال بازبینی</option>
							<option value="published">فعال</option>
							<option value="rejected">رد شده</option>
						</NativeSelect>
					</FormControl>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<CheckIcon />
						به روزرسانی
					</Button>
				</Form>
			)}
		</Formik>
	);
}
