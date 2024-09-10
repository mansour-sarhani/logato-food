import { ADMIN_GET_ALL_CATEGORIES } from "@/redux/features/categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminGetAllCategories(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(ADMIN_GET_ALL_CATEGORIES());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminGetAllCategories;
