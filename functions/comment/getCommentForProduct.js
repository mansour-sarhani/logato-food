import { GET_COMMENT_FOR_PRODUCT } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCommentForProduct(
	dispatch,
	enqueueSnackbar,
	productId,
	setState
) {
	try {
		const result = await dispatch(GET_COMMENT_FOR_PRODUCT(productId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCommentForProduct;
