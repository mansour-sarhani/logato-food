import { GET_PRODUCT_BY_ID } from "@/redux/features/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getProductById(dispatch, enqueueSnackbar, setState, productId) {
	try {
		const result = await dispatch(GET_PRODUCT_BY_ID(productId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getProductById;
