import { GET_PRODUCTS_BY_SHOP_ID } from "@/redux/features/productSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getProductsByShop(dispatch, enqueueSnackbar, shopId, setState) {
	try {
		const result = await dispatch(GET_PRODUCTS_BY_SHOP_ID(shopId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getProductsByShop;
