import { ADMIN_DELETE_CITY } from "@/redux/features/citySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminDeleteCity(dispatch, enqueueSnackbar, cityId) {
	try {
		const result = await dispatch(ADMIN_DELETE_CITY(cityId));
		const response = unwrapResult(result);

		enqueueSnackbar("شهر با موفقیت حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminDeleteCity;
