import { USER_BOOKMARK_SHOP } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userBookmarkShop(dispatch, enqueueSnackbar, bookmarkShop) {
	try {
		const result = await dispatch(USER_BOOKMARK_SHOP(bookmarkShop));
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

export default userBookmarkShop;
