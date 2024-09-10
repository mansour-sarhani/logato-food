import { ADMIN_UPDATE_CATEGORY } from "@/redux/features/categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminUpdateCategory(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_UPDATE_CATEGORY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("دسته بندی با موفقیت به روزرسانی شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminUpdateCategory;
