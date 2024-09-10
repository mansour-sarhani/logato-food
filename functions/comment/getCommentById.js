import { GET_COMMENT_BY_ID } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCommentById(dispatch, enqueueSnackbar, commentId, setState) {
	try {
		const result = await dispatch(GET_COMMENT_BY_ID(commentId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCommentById;
