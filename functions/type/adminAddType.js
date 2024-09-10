import { ADMIN_ADD_TYPE } from "@/redux/features/typeSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminAddType(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_ADD_TYPE(data));
		const response = unwrapResult(result);

		enqueueSnackbar("نوع فروشگاه با موفقیت اضافه شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminAddType;
