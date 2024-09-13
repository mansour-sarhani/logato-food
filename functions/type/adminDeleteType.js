import { ADMIN_DELETE_TYPE } from "@/redux/features/typeSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminDeleteType(dispatch, enqueueSnackbar, typeId) {
	try {
		const result = await dispatch(ADMIN_DELETE_TYPE(typeId));
		const response = unwrapResult(result);

		enqueueSnackbar("نوع فروشگاه با موفقیت حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminDeleteType;
