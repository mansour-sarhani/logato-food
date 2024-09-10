import { GET_COMMENT_FOR_SHOP_PRODUCTS } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCommentForShopProducts(
	dispatch,
	enqueueSnackbar,
	productsShopId,
	setState
) {
	try {
		const result = await dispatch(
			GET_COMMENT_FOR_SHOP_PRODUCTS(productsShopId)
		);
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCommentForShopProducts;
