import { ADMIN_GET_SHOP_BY_ID } from "@/redux/features/adminSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function adminGetShopById(dispatch, enqueueSnackbar, shopId, setState) {
	try {
		const result = await dispatch(ADMIN_GET_SHOP_BY_ID(shopId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default adminGetShopById;
