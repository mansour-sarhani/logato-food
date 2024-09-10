import { USER_UN_BOOKMARK_PRODUCT } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userUnbookmarkProduct(
	dispatch,
	enqueueSnackbar,
	bookmarkProduct
) {
	try {
		const result = await dispatch(
			USER_UN_BOOKMARK_PRODUCT(bookmarkProduct)
		);
		const response = unwrapResult(result);

		enqueueSnackbar("با موفقیت از لیست شما حذف شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userUnbookmarkProduct;
