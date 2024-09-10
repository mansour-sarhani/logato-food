import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADMIN_ADD_CITY = createAsyncThunk(
	"city/ADMIN_ADD_CITY",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.post("/api/admin/city", formData, {
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

export const ADMIN_UPDATE_CITY = createAsyncThunk(
	"city/ADMIN_UPDATE_CITY",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put(
				"/api/admin/city?cityId=" + data.cityId,
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

export const ADMIN_DELETE_CITY = createAsyncThunk(
	"city/ADMIN_DELETE_CITY",
	async (cityId, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				"/api/admin/city?cityId=" + cityId
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

export const ADMIN_GET_ALL_CITIES = createAsyncThunk(
	"city/ADMIN_GET_ALL_CITIES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/city");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_GET_CITY_BY_ID = createAsyncThunk(
	"city/ADMIN_GET_CITY_BY_ID",
	async (cityId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/city?cityId=" + cityId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_ALL_CITIES = createAsyncThunk(
	"city/GET_ALL_CITIES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/city");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_CITY_BY_ID = createAsyncThunk(
	"city/GET_CITY_BY_ID",
	async (cityId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/city?cityId=" + cityId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const citySlice = createSlice({
	name: "city",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;

		//ADMIN_ADD_CITY
		handleAsyncActions(builder, ADMIN_ADD_CITY);

		//ADMIN_UPDATE_CITY
		handleAsyncActions(builder, ADMIN_UPDATE_CITY);

		//ADMIN_DELETE_CITY
		handleAsyncActions(builder, ADMIN_DELETE_CITY);

		//ADMIN_GET_ALL_CITIES
		handleAsyncActions(builder, ADMIN_GET_ALL_CITIES);

		//ADMIN_GET_CITY_BY_ID
		handleAsyncActions(builder, ADMIN_GET_CITY_BY_ID);

		//GET_ALL_CITIES
		handleAsyncActions(builder, GET_ALL_CITIES);

		//GET_CITY_BY_ID
		handleAsyncActions(builder, GET_CITY_BY_ID);
	},
});

export default citySlice.reducer;
