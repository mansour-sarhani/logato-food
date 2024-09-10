import { CREATE_NEW_SHOP } from "@/redux/features/shopSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function addNewShop(dispatch, enqueueSnackbar, data) {
	try {
		const result = await dispatch(CREATE_NEW_SHOP(data));
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

export default addNewShop;
