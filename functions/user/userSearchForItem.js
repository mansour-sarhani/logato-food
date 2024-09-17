import { USER_SEARCH_FOR_TERM } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userSearchForTerm(dispatch, enqueueSnackbar, term, setState) {
	try {
		const result = await dispatch(USER_SEARCH_FOR_TERM(term));
		const response = unwrapResult(result);
		setState(response);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userSearchForTerm;
