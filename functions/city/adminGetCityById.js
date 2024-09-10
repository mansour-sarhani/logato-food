import { ADMIN_GET_CITY_BY_ID } from "@/redux/features/citySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminGetCityById(dispatch, enqueueSnackbar, cityId, setState) {
	try {
		const result = await dispatch(ADMIN_GET_CITY_BY_ID(cityId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminGetCityById;
