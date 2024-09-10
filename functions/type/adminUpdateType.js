import { ADMIN_UPDATE_TYPE } from "@/redux/features/typeSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminUpdateType(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_UPDATE_TYPE(data));
		const response = unwrapResult(result);

		enqueueSnackbar("نوع فروشگاه با موفقیت به روزرسانی شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminUpdateType;
