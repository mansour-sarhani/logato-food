import { GET_SHOP_BY_ID } from "@/redux/features/shopSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getShopById(dispatch, enqueueSnackbar, shopId, setState) {
	try {
		const result = await dispatch(GET_SHOP_BY_ID(shopId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getShopById;
