import { UPDATE_PRODUCT } from "@/redux/features/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function updateProduct(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(UPDATE_PRODUCT(data));
		const response = unwrapResult(result);

		enqueueSnackbar("آیتم با موفقیت به روزرسانی شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default updateProduct;
