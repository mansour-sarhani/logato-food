import { GET_ALL_SUB_CATEGORIES } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getAllSubCategories(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(GET_ALL_SUB_CATEGORIES());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getAllSubCategories;
