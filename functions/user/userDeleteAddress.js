import { USER_DELETE_ADDRESS } from "@/redux/features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function userDeleteAddress(dispatch, enqueueSnackbar, addressId) {
	try {
		const result = await dispatch(USER_DELETE_ADDRESS(addressId));
		const response = unwrapResult(result);

		enqueueSnackbar("آدرس با موفقیت از لیست شما حذف شد.", {
			variant: "success",
		});
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default userDeleteAddress;
