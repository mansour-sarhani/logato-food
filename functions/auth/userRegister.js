import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { USER_REGISTER } from "@/redux/features/authSlice";

async function userRegister(dispatch, enqueueSnackbar, router, data) {
	const formData = new FormData();
	for (const key in data) {
		formData.append(key, data[key]);
	}

	try {
		const result = await dispatch(USER_REGISTER(formData));
		const response = unwrapResult(result);
		const userData = {
			logato_token: response.user.token,
		};
		for (let key in userData) {
			Cookies.set(key, userData[key], {
				expires: 30,
				secure: true,
				sameSite: "Lax",
			});
		}

		router.push("/panel/profile?register=success");
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userRegister;
