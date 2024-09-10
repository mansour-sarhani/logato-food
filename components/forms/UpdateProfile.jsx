import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import userUpdateProfile from "@/functions/user/userUpdateProfile";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Check from "@mui/icons-material/Check";

const initialValues = {
	firstName: "",
	lastName: "",
	phone: "",
	newAvatar: null,
};

export default function UpdateProfile(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, currentData } = props;

	return (
		<Formik
			initialValues={currentData || initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					firstName:
						values.firstName !== currentData.firstName
							? values.firstName
							: null,
					lastName:
						values.lastName !== currentData.lastName
							? values.lastName
							: null,
					phone:
						values.phone !== currentData.phone
							? values.phone
							: null,
					avatar: values.newAvatar ? values.newAvatar[0] : null,
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

				await userUpdateProfile(dispatch, enqueueSnackbar, filtered);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ isSubmitting }) => (
				<Form className="lt-form panel-form">
					<div className="panel-grid-two">
						<LTTextInput name="firstName" label="نام" />
						<LTTextInput name="lastName" label="نام خانوادگی" />
					</div>

					<div className="panel-grid-two">
						<LTTextInput
							name="email"
							label="ایمیل"
							disabled="true"
						/>
						<LTTextInput name="phone" label="تلفن" />
					</div>

					<div className="panel-new-img-container">
						<Avatar
							src={
								currentData.avatar.path + currentData.avatar.img
							}
							style={{
								width: "100px",
								height: "100px",
								marginTop: "40px",
							}}
						/>
						<FileUploader
							title="تصویر جدید"
							name="newAvatar"
							number={1}
						/>
					</div>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<Check />
						به روز رسانی
					</Button>
				</Form>
			)}
		</Formik>
	);
}
