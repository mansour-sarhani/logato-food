import { GET_ALL_COMMENTS } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getAllComments(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(GET_ALL_COMMENTS());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getAllComments;
