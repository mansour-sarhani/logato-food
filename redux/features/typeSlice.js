import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADMIN_ADD_TYPE = createAsyncThunk(
	"type/ADMIN_ADD_TYPE",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}
			const response = await http.post("/api/admin/type", formData, {
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

export const ADMIN_UPDATE_TYPE = createAsyncThunk(
	"type/ADMIN_UPDATE_TYPE",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}
			const response = await http.put(
				"/api/admin/type?typeId=" + data.typeId,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_DELETE_TYPE = createAsyncThunk(
	"type/ADMIN_DELETE_TYPE",
	async (typeId, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				"/api/admin/type?typeId=" + typeId
			);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_GET_ALL_TYPES = createAsyncThunk(
	"type/ADMIN_GET_ALL_TYPES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/type");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_ALL_TYPES = createAsyncThunk(
	"type/GET_ALL_TYPES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/type");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_TYPE_BY_ID = createAsyncThunk(
	"type/GET_TYPE_BY_ID",
	async (typeId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/type?typeId=" + typeId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const typeSlice = createSlice({
	name: "type",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;

		//ADMIN_ADD_TYPE
		handleAsyncActions(builder, ADMIN_ADD_TYPE);

		//ADMIN_UPDATE_TYPE
		handleAsyncActions(builder, ADMIN_UPDATE_TYPE);

		//ADMIN_DELETE_TYPE
		handleAsyncActions(builder, ADMIN_DELETE_TYPE);

		//ADMIN_GET_ALL_TYPES
		handleAsyncActions(builder, ADMIN_GET_ALL_TYPES);

		//GET_ALL_TYPES
		handleAsyncActions(builder, GET_ALL_TYPES);

		//GET_TYPE_BY_ID
		handleAsyncActions(builder, GET_TYPE_BY_ID);
	},
});

export default typeSlice.reducer;
