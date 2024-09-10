import { ADMIN_ADD_SHOP } from "@/redux/features/adminSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminAddShop(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(ADMIN_ADD_SHOP(data));
		const response = unwrapResult(result);

		enqueueSnackbar("فروشگاه جدید با موفقیت ایجاد شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminAddShop;
