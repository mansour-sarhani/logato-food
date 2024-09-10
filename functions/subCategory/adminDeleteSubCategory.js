import { ADMIN_DELETE_SUB_CATEGORY } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminDeleteSubCategory(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_DELETE_SUB_CATEGORY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("زیر دسته با موفقیت حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminDeleteSubCategory;
