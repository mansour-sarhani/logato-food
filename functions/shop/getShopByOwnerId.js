import { GET_SHOP_BY_OWNER_ID } from "@/redux/features/shopSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getShopByOwnerId(dispatch, enqueueSnackbar, setState, ownerId) {
	try {
		const result = await dispatch(GET_SHOP_BY_OWNER_ID(ownerId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getShopByOwnerId;
