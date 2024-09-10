import { ADMIN_GET_ALL_SUB_CATEGORIES } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminGetAllSubCategories(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(ADMIN_GET_ALL_SUB_CATEGORIES());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminGetAllSubCategories;
