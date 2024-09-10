import { ADMIN_DELETE_SHOP } from "@/redux/features/adminSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminDeleteShop(dispatch, enqueueSnackbar, shopId) {
	try {
		const result = await dispatch(ADMIN_DELETE_SHOP(shopId));
		const response = unwrapResult(result);

		enqueueSnackbar("فروشگاه با موفقیت حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminDeleteShop;
