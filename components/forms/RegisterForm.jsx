import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import userRegister from "@/functions/auth/userRegister";
import Link from "next/link";
import LTTextInput from "@/components/inputs/LTTextInput";
import LTPasswordInput from "@/components/inputs/LTPasswordInput";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const initialValues = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
	role: "viewer",
};

const validationSchema = Yup.object({
	firstName: Yup.string().required("وارد کردن نام ضروری است"),
	lastName: Yup.string().required("وارد کردن نام خانوادگی ضروری است"),
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

export default function RegisterForm() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

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
			onSubmit={async (values, { setSubmitting }) => {
				const data = {
					firstName: values.firstName,
					lastName: values.lastName,
					email: values.email,
					password: values.password,
					role: values.role,
				};
				await userRegister(dispatch, enqueueSnackbar, router, data);
				setSubmitting(false);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form auth-form">
					<Typography variant="h4" component="h4" gutterBottom>
						ثبت نام
					</Typography>

					<Typography fontSize="14px" mb="10px">
						قبلا عضو شده اید؟{" "}
						<Link href="/auth/login" className="primary-text">
							برای ورود کلیک کنید
						</Link>
					</Typography>

					<LTTextInput name="firstName" label="نام*" />
					<LTTextInput name="lastName" label="نام خانوادگی*" />
					<LTTextInput name="email" label="ایمیل*" />
					<LTPasswordInput name="password" label="رمز عبور*" />
					<LTPasswordInput
						name="confirmPassword"
						label="تکرار رمز عبور*"
					/>

					<FormControlLabel
						className="lt-switch-input"
						style={{ marginBottom: "20px" }}
						control={
							<Switch
								checked={values.role === "owner"}
								onChange={(e) => {
									handleChange(e);
									setFieldValue(
										"role",
										e.target.checked ? "owner" : "viewer"
									);
								}}
								name="role"
							/>
						}
						label="ثبت نام به عنوان فروشنده"
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
					>
						<HowToRegIcon />
						ثبت نام
					</Button>
				</Form>
			)}
		</Formik>
	);
}
