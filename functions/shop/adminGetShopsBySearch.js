import { ADMIN_GET_SHOPS_BY_SEARCH } from "@/redux/features/adminSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminGetShopsBySearch(
	dispatch,
	enqueueSnackbar,
	search,
	setState
) {
	try {
		const result = await dispatch(ADMIN_GET_SHOPS_BY_SEARCH(search));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminGetShopsBySearch;
