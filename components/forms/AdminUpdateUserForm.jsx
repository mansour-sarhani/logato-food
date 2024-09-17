import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import adminUpdateUser from "@/functions/admin/adminUpdateUser";
import { Formik, Form } from "formik";
import LTTextInput from "@/components/inputs/LTTextInput";
import FileUploader from "@/components/fileUpload/FileUploader";
import LTImage from "@/components/global/LTImage";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Check from "@mui/icons-material/Check";

const initialValues = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	role: "",
	status: "",
	avatar: null,
};

export default function AdminUpdateUserForm(props) {
	const { handleClose, currentData, setDoReload } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

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
					email:
						values.email !== currentData.email
							? values.email
							: null,
					phone:
						values.phone !== currentData.phone
							? values.phone
							: null,
					role: values.role !== currentData.role ? values.role : null,
					status:
						values.status !== currentData.status
							? values.status
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

				const finalData = {
					...filtered,
					userId: currentData.id,
				};

				await adminUpdateUser(dispatch, enqueueSnackbar, finalData);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					<div className="panel-grid-two">
						<LTTextInput name="firstName" label="نام" />
						<LTTextInput name="lastName" label="نام خانوادگی" />
					</div>

					<div className="panel-grid-two">
						<LTTextInput name="email" label="ایمیل" />
						<LTTextInput name="phone" label="شماره موبایل" />
					</div>

					<div className="panel-grid-two">
						<FormControl className="lt-form-control">
							<label htmlFor="role" className="lt-label">
								نقش کاربر
							</label>
							<NativeSelect
								defaultValue={values.role}
								inputProps={{
									name: "role",
									id: "role",
								}}
								onChange={(e) => {
									handleChange(e);
									setFieldValue("role", e.target.value);
								}}
								className="lt-select"
							>
								<option value="">
									لطفا نقش کاربر را انتخاب نمایید
								</option>
								<option value="viewer">کاربر</option>
								<option value="owner">فروشنده</option>
								<option value="admin">ادمین</option>
							</NativeSelect>
						</FormControl>

						<FormControl className="lt-form-control">
							<label htmlFor="status" className="lt-label">
								وضعیت
							</label>
							<NativeSelect
								defaultValue={values.status}
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
								<option value="active">فعال</option>
								<option value="inactive">غیر فعال</option>
								<option value="banned">مسدود شده</option>
							</NativeSelect>
						</FormControl>
					</div>

					<div className="panel-new-img-container">
						<LTImage
							name={currentData.avatar}
							variant="rounded"
							width={100}
							height={100}
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
						sx={{ marginTop: "20px" }}
					>
						<Check />
						به روز رسانی کاربر
					</Button>
				</Form>
			)}
		</Formik>
	);
}
