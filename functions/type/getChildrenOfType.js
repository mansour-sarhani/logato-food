import { GET_TYPE_BY_ID } from "@/redux/features/typeSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getChildrenOfType(
	dispatch,
	enqueueSnackbar,
	typeId,
	setCategories
) {
	try {
		const result = await dispatch(GET_TYPE_BY_ID(typeId));
		const response = unwrapResult(result);
		const categories = response.data.categories;
		setCategories(categories);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getChildrenOfType;
