import { GET_COMMENT_FOR_SHOP } from "@/redux/features/commentSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getCommentForShop(dispatch, enqueueSnackbar, shopId, setState) {
	try {
		const result = await dispatch(GET_COMMENT_FOR_SHOP(shopId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getCommentForShop;
