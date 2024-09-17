import { GET_USER_BOOKMARKED_PRODUCTS } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getUserBookmarkedProducts(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(GET_USER_BOOKMARKED_PRODUCTS());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getUserBookmarkedProducts;
