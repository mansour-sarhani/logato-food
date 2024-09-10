import { ADMIN_GET_ALL_CITIES } from "@/redux/features/citySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminGetAllCities(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(ADMIN_GET_ALL_CITIES());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminGetAllCities;
