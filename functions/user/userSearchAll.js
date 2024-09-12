import { USER_SEARCH_ALL_QUERY } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userSearchAll(dispatch, enqueueSnackbar, query, setData) {
	try {
		const result = await dispatch(USER_SEARCH_ALL_QUERY(query));
		const response = unwrapResult(result);

		setData(response.shops);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userSearchAll;
