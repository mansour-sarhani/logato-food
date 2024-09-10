import { GET_SUB_CATEGORIES_OF_CATEGORY } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getSubCategoriesOfCategory(
	dispatch,
	enqueueSnackbar,
	setState,
	data
) {
	try {
		const result = await dispatch(GET_SUB_CATEGORIES_OF_CATEGORY(data));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getSubCategoriesOfCategory;
