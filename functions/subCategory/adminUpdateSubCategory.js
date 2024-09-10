import { ADMIN_UPDATE_SUB_CATEGORY } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminUpdateSubCategory(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_UPDATE_SUB_CATEGORY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("زیر دسته با موفقیت به روزرسانی شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminUpdateSubCategory;
