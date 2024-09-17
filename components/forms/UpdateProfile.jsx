import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import userUpdateProfile from "@/functions/user/userUpdateProfile";
import LTTextInput from "@/components/inputs/LTTextInput";
import FileUploader from "@/components/fileUpload/FileUploader";
import LTImage from "@/components/global/LTImage";
import Button from "@mui/material/Button";
import Check from "@mui/icons-material/Check";
import Image from "next/image";

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
						{currentData.avatar.img === "" ? (
							<Image
								src="/assets/images/front/avatar.png"
								alt="user-avatar"
								width={100}
								height={100}
								style={{ borderRadius: "50%" }}
							/>
						) : (
							<LTImage
								name={currentData.avatar}
								variant="circle"
								width={100}
								height={100}
							/>
						)}

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
