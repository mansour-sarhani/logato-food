import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	status: "idle",
	error: null,
};

export const USER_REGISTER = createAsyncThunk(
	"auth/USER_REGISTER",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.post("/api/auth/register", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const USER_LOGIN = createAsyncThunk(
	"auth/USER_LOGIN",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.post("/api/auth/login", data);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;
		//USER_REGISTER
		handleAsyncActions(builder, USER_REGISTER);

		//USER_LOGIN
		handleAsyncActions(builder, USER_LOGIN);
	},
});

export default authSlice.reducer;
