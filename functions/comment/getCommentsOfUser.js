import { GET_COMMENTS_OF_USER } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCommentsOfUser(dispatch, enqueueSnackbar, userId, setState) {
	try {
		const result = await dispatch(GET_COMMENTS_OF_USER(userId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCommentsOfUser;
