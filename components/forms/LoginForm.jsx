import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import userLogin from "@/functions/auth/userLogin";
import Link from "next/link";
import LTTextInput from "@/components/inputs/LTTextInput";
import LTPasswordInput from "@/components/inputs/LTPasswordInput";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import Loading from "@/components/global/Loading";

const initialValues = {
	email: "",
	password: "",
};

export default function LoginForm() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const loading = useSelector((state) => state.auth.status === "loading");

	return loading ? (
		<Loading isLoading={loading} />
	) : (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values, { setSubmitting }) => {
				const data = {
					email: values.email,
					password: values.password,
				};
				await userLogin(dispatch, enqueueSnackbar, router, data);
				setSubmitting(false);
			}}
		>
			{({ isSubmitting, values }) => (
				<Form className="lt-form auth-form">
					<Typography variant="h4" component="h4" gutterBottom>
						ورود کاربران
					</Typography>

					<Typography fontSize="14px" mb="10px">
						هنوز عضو نشده اید؟{" "}
						<Link href="/auth/register" className="primary-text">
							برای ثبت نام کلیک کنید
						</Link>
					</Typography>

					<LTTextInput name="email" label="ایمیل" />
					<LTPasswordInput name="password" label="رمز عبور" />

					<div className="login-remember-me">
						<Typography variant="body2">
							<Link href="/auth/forgot-password" color="primary">
								رمز عبور را فراموش کردید؟
							</Link>
						</Typography>
					</div>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={
							isSubmitting || !values.email || !values.password
						}
					>
						<LoginIcon />
						ورود
					</Button>
				</Form>
			)}
		</Formik>
	);
}
