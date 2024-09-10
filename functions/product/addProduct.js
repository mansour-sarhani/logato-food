import { ADD_PRODUCT } from "@/redux/features/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function addProduct(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADD_PRODUCT(data));
		const response = unwrapResult(result);

		enqueueSnackbar("آیتم جدید با موفقیت اضافه شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default addProduct;
