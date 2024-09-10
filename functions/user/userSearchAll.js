import { USER_SEARCH_ALL_QUERY } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userSearchAll(
	dispatch,
	enqueueSnackbar,
	data,
	setData,
	setPage,
	setLimit,
	setTotal
) {
	try {
		const result = await dispatch(USER_SEARCH_ALL_QUERY(data));
		const response = unwrapResult(result);

		setData(response.shops);
		setPage(response.page);
		setLimit(response.limit);
		setTotal(response.total);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userSearchAll;
