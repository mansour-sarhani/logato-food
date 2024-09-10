import { ADMIN_DELETE_CATEGORY } from "@/redux/features/categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminDeleteCategory(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_DELETE_CATEGORY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("دسته بندی با موفقیت حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminDeleteCategory;
