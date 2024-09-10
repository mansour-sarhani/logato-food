import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import { ErrorMessage } from "formik";
import * as Yup from "yup";
import adminAddUser from "@/functions/admin/adminAddUser";
import LTTextInput from "@/components/global/LTTextInput";
import LTPasswordInput from "@/components/global/LTPasswordInput";
import FileUploader from "@/components/global/FileUploader";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	password: "",
	confirmPassword: "",
	role: "",
	avatar: null,
};

const validationSchema = Yup.object({
	firstName: Yup.string().required("وارد کردن نام ضروری است"),
	lastName: Yup.string().required("وارد کردن نام خانوادگی ضروری است"),
	role: Yup.string().required("انتخاب نقش ضروری است"),
	email: Yup.string()
		.email("آدرس ایمیل معتبر نیست")
		.required("آدرس ایمیل ضروری است"),
	password: Yup.string()
		.min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
		.required("رمز عبور ضروری است"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "رمز عبور مطابقت ندارد")
		.required("تکرار رمز عبور ضروری است"),
});

export default function AddUserForm(props) {
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
					firstName: values.firstName,
					lastName: values.lastName,
					email: values.email,
					phone: values.phone,
					password: values.password,
					role: values.role,
					avatar: values.avatar ? values.avatar[0] : null,
				};
				await adminAddUser(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					<div className="panel-grid-two">
						<LTTextInput name="firstName" label="نام*" />
						<LTTextInput name="lastName" label="نام خانوادگی*" />
					</div>

					<div className="panel-grid-two">
						<LTTextInput name="email" label="ایمیل*" />
						<LTTextInput name="phone" label="شماره موبایل" />
					</div>

					<div className="panel-grid-two">
						<LTPasswordInput name="password" label="رمز عبور*" />
						<LTPasswordInput
							name="confirmPassword"
							label="تکرار رمز عبور*"
						/>
					</div>

					<FormControl className="lt-form-control">
						<label htmlFor="role-select" className="lt-label">
							نقش کاربر*
						</label>
						<NativeSelect
							defaultValue={""}
							inputProps={{
								name: "role",
								id: "role-select",
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

						<FormHelperText className="lt-form-error">
							<ErrorMessage name={"role"} />
						</FormHelperText>
					</FormControl>

					<FileUploader title="تصویر" name="avatar" number={1} />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						sx={{ marginTop: "20px" }}
					>
						<AddIcon />
						اضافه کردن کاربر
					</Button>
				</Form>
			)}
		</Formik>
	);
}
