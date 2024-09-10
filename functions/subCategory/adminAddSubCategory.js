import { ADMIN_ADD_SUB_CATEGORY } from "@/redux/features/subCategorySlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminAddSubCategory(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_ADD_SUB_CATEGORY(data));
		const response = unwrapResult(result);

		enqueueSnackbar("زیر دسته جدید با موفقیت اضافه شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminAddSubCategory;
