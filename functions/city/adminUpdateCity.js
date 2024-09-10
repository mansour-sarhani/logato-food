import { ADMIN_UPDATE_CITY } from "@/redux/features/citySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminUpdateCity(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_UPDATE_CITY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("شهر با موفقیت به روزرسانی شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminUpdateCity;
