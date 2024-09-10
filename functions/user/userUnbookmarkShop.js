import { USER_UN_BOOKMARK_SHOP } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userUnbookmarkShop(dispatch, enqueueSnackbar, bookmarkShop) {
	try {
		const result = await dispatch(USER_UN_BOOKMARK_SHOP(bookmarkShop));
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

export default userUnbookmarkShop;
