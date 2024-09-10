import Cookies from "js-cookie";

async function userLogout(enqueueSnackbar, router) {
	try {
		const cookieKeys = ["logato_token"];

		cookieKeys.forEach((key) => {
			Cookies.remove(key);
		});

		router.push("/auth/login?logout=success");
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userLogout;
