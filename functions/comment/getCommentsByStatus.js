import { GET_COMMENTS_BY_STATUS } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCommentsByStatus(
	dispatch,
	enqueueSnackbar,
	status,
	setState
) {
	try {
		const result = await dispatch(GET_COMMENTS_BY_STATUS(status));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCommentsByStatus;
