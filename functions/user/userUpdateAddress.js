import { USER_UPDATE_ADDRESS } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userUpdateAddress(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(USER_UPDATE_ADDRESS(data));
		const response = unwrapResult(result);

		enqueueSnackbar("آدرس با موفقیت به روز رسانی شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userUpdateAddress;
