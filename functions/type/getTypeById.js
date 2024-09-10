import { GET_TYPE_BY_ID } from "@/redux/features/typeSlice";
import { unwrapResult } from "@reduxjs/toolkit";

async function getTypeById(dispatch, enqueueSnackbar, typeId, setState) {
	try {
		const result = await dispatch(GET_TYPE_BY_ID(typeId));
		const response = unwrapResult(result);

		setState(response.data);
	} catch (err) {
		const errorMessage = err.message;

		enqueueSnackbar(errorMessage || "متاسفانه مشکلی پیش آمده است.", {
			variant: "error",
		});
	}
}

export default getTypeById;
