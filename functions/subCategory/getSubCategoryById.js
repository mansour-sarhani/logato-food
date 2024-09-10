import { GET_SUB_CATEGORY_BY_ID } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getSubCategoryById(dispatch, enqueueSnackbar, setState, data) {
	try {
		const result = await dispatch(GET_SUB_CATEGORY_BY_ID(data));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getSubCategoryById;
