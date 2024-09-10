import { GET_ALL_SHOPS } from "@/redux/features/shopSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getAllShops(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(GET_ALL_SHOPS());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getAllShops;
