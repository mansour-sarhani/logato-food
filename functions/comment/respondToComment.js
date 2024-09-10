import { RESPOND_TO_COMMENT } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function respondToComment(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(RESPOND_TO_COMMENT(data));
		const response = unwrapResult(result);

		enqueueSnackbar(
			"پاسخ شما با موفقیت ثبت شد و پس از بازبینی منتشر می شود.",
			{
				variant: "success",
			}
		);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default respondToComment;
