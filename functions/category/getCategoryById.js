import { GET_CATEGORY_BY_ID } from "@/redux/features/categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCategoryById(dispatch, enqueueSnackbar, data, setState) {
	try {
		const result = await dispatch(GET_CATEGORY_BY_ID(data));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCategoryById;
