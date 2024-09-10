import { GET_ALL_PRODUCTS } from "@/redux/features/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getAllProducts(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(GET_ALL_PRODUCTS());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getAllProducts;
