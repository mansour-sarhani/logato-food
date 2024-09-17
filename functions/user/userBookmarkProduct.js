import { USER_BOOKMARK_PRODUCT } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userBookmarkProduct(dispatch, enqueueSnackbar, productId) {
	try {
		const result = await dispatch(USER_BOOKMARK_PRODUCT(productId));
		const response = unwrapResult(result);

		enqueueSnackbar("با موفقیت به لیست شما اضافه شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userBookmarkProduct;
