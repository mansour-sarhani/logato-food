import { ADD_CATEGORY_TO_SHOP } from "@/redux/features/shopSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function addCategoryToShop(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADD_CATEGORY_TO_SHOP(data));
		const response = unwrapResult(result);

		enqueueSnackbar("دسته بندی جدید با موفقیت ایجاد شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default addCategoryToShop;
