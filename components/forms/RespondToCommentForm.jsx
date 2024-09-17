import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import userAddAddress from "@/functions/user/userAddAddress";
import LTTextArea from "@/components/inputs/LTTextArea";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import respondToComment from "@/functions/comment/respondToComment";

const initialValues = {
	responseBody: "",
};

export default function RespondToCommentForm(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, currentData } = props;

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					responseBody: values.responseBody,
					isOriginalComment: false,
					parentCommentId: currentData.id,
				};
				await respondToComment(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting, values }) => (
				<Form className="lt-form panel-form">
					<Typography>{currentData.body}</Typography>

					<LTTextArea name="responseBody" label="متن پاسخ" />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting || !values.responseBody}
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
