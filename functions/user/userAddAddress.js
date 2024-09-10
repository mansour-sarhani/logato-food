import { USER_ADD_ADDRESS } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userAddAddress(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(USER_ADD_ADDRESS(data));
		const response = unwrapResult(result);

		enqueueSnackbar("آدرس جدید با موفقیت به لیست شما اضافه شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userAddAddress;
