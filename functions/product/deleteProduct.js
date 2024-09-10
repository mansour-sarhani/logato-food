import { DELETE_PRODUCT } from "@/redux/features/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function deleteProduct(dispatch, enqueueSnackbar, productId) {
	try {
		const result = await dispatch(DELETE_PRODUCT(productId));
		const response = unwrapResult(result);

		enqueueSnackbar("آیتم با موفقیت حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default deleteProduct;
