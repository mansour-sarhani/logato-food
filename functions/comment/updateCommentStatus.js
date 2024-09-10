import { UPDATE_COMMENT_STATUS } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function updateCommentStatus(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(UPDATE_COMMENT_STATUS(data));
		const response = unwrapResult(result);

		enqueueSnackbar("وضعیت کامنت به روز رسانی شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default updateCommentStatus;
