import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { USER_LOGIN } from "@/redux/features/authSlice";

async function userLogin(dispatch, enqueueSnackbar, router, data) {
	const formData = new FormData();
	for (const key in data) {
		formData.append(key, data[key]);
	}

	try {
		const result = await dispatch(USER_LOGIN(formData));
		const response = unwrapResult(result);

		const userData = {
			logato_token: response.token,
		};
		for (let key in userData) {
			Cookies.set(key, userData[key], {
				expires: 30,
				secure: true,
				sameSite: "Lax",
			});
		}

		router.push("/panel/profile?login=success");
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userLogin;
