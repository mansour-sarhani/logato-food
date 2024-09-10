import { UPDATE_SHOP } from "@/redux/features/shopSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function updateShop(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(UPDATE_SHOP(data));
		const response = unwrapResult(result);

		enqueueSnackbar("فروشگاه با موفقیت به روزرسانی شد", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default updateShop;
