import { ADMIN_ADD_CITY } from "@/redux/features/citySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminAddCity(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_ADD_CITY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("شهر جدید با موفقیت اضافه شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminAddCity;
