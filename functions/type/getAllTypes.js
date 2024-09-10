import { GET_ALL_TYPES } from "@/redux/features/typeSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getAllTypes(dispatch, enqueueSnackbar, setState) {
	try {
		const result = await dispatch(GET_ALL_TYPES());
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getAllTypes;
