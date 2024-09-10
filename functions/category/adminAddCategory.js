import { ADMIN_ADD_CATEGORY } from "@/redux/features/categorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminAddCategory(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_ADD_CATEGORY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("دسته بندی جدید با موفقیت اضافه شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminAddCategory;
