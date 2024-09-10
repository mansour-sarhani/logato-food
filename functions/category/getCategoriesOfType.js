import { GET_CATEGORIES_BY_TYPE_VALUE } from "@/redux/features/categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCategoriesByTypeValue(
	dispatch,
	enqueueSnackbar,
	typeValue,
	setState
) {
	try {
		const result = await dispatch(GET_CATEGORIES_BY_TYPE_VALUE(typeValue));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCategoriesByTypeValue;
