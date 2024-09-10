import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADMIN_ADD_CATEGORY = createAsyncThunk(
	"category/ADMIN_ADD_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}
			const response = await http.post("/api/admin/category", formData, {
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

export const ADMIN_UPDATE_CATEGORY = createAsyncThunk(
	"category/ADMIN_UPDATE_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}
			const response = await http.put(
				`/api/admin/category?categoryId=${data.categoryId}&parentTypeId=${data.parentTypeId}`,
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

export const ADMIN_DELETE_CATEGORY = createAsyncThunk(
	"category/ADMIN_DELETE_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				`/api/admin/category?categoryId=${data.categoryId}&parentTypeId=${data.parentTypeId}`
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

export const ADMIN_GET_ALL_CATEGORIES = createAsyncThunk(
	"category/ADMIN_GET_ALL_CATEGORIES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/category");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_ALL_CATEGORIES = createAsyncThunk(
	"category/GET_ALL_CATEGORIES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/category");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_CATEGORIES_OF_TYPE = createAsyncThunk(
	"category/GET_CATEGORIES_OF_TYPE",
	async (typeId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/category?typeId=" + typeId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_CATEGORIES_BY_TYPE_VALUE = createAsyncThunk(
	"category/GET_CATEGORIES_BY_TYPE_VALUE",
	async (typeValue, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/category?typeValue=" + typeValue
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

export const GET_CATEGORY_BY_ID = createAsyncThunk(
	"category/GET_CATEGORY_BY_ID",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.get(
				`/api/category?categoryId=${data.categoryId}&parentTypeId=${data.parentTypeId}`
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

export const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;

		//ADMIN_ADD_CATEGORY
		handleAsyncActions(builder, ADMIN_ADD_CATEGORY);

		//ADMIN_UPDATE_CATEGORY
		handleAsyncActions(builder, ADMIN_UPDATE_CATEGORY);

		//ADMIN_DELETE_CATEGORY
		handleAsyncActions(builder, ADMIN_DELETE_CATEGORY);

		//ADMIN_GET_ALL_CATEGORIES
		handleAsyncActions(builder, ADMIN_GET_ALL_CATEGORIES);

		//GET_ALL_CATEGORIES
		handleAsyncActions(builder, GET_ALL_CATEGORIES);

		//GET_CATEGORIES_OF_TYPE
		handleAsyncActions(builder, GET_CATEGORIES_OF_TYPE);

		//GET_CATEGORIES_BY_TYPE_VALUE
		handleAsyncActions(builder, GET_CATEGORIES_BY_TYPE_VALUE);

		//GET_CATEGORY_BY_ID
		handleAsyncActions(builder, GET_CATEGORY_BY_ID);
	},
});

export default categorySlice.reducer;
