import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADMIN_ADD_SUB_CATEGORY = createAsyncThunk(
	"subCategory/ADMIN_ADD_SUB_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}
			const response = await http.post(
				"/api/admin/sub-category",
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

export const ADMIN_UPDATE_SUB_CATEGORY = createAsyncThunk(
	"subCategory/ADMIN_UPDATE_SUB_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}
			const response = await http.put(
				`/api/admin/sub-category?subCategoryId=${data.subCategoryId}&categoryId=${data.categoryId}&typeId=${data.typeId}`,
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

export const ADMIN_DELETE_SUB_CATEGORY = createAsyncThunk(
	"subCategory/ADMIN_DELETE_SUB_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				`/api/admin/sub-category?subCategoryId=${data.subCategoryId}&categoryId=${data.categoryId}&typeId=${data.typeId}`
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

export const ADMIN_GET_ALL_SUB_CATEGORIES = createAsyncThunk(
	"subCategory/ADMIN_GET_ALL_SUB_CATEGORIES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/sub-category");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_ALL_SUB_CATEGORIES = createAsyncThunk(
	"subCategory/GET_ALL_SUB_CATEGORIES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/sub-category");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_SUB_CATEGORIES_OF_CATEGORY = createAsyncThunk(
	"subCategory/GET_SUB_CATEGORIES_OF_CATEGORY",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.get(
				`/api/sub-category?subCategoryId=${data.subCategoryId}&parentCategoryId=${data.parentCategoryId}&typeId=${data.typeId}`
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

export const GET_SUB_CATEGORY_BY_ID = createAsyncThunk(
	"subCategory/GET_SUB_CATEGORY_BY_ID",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.get(
				`/api/sub-category?subCategoryId=${data.subCategoryId}&categoryId=${data.categoryId}&typeId=${data.typeId}`
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

export const subCategorySlice = createSlice({
	name: "subCategory",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;

		//ADMIN_ADD_SUB_CATEGORY
		handleAsyncActions(builder, ADMIN_ADD_SUB_CATEGORY);

		//ADMIN_UPDATE_SUB_CATEGORY
		handleAsyncActions(builder, ADMIN_UPDATE_SUB_CATEGORY);

		//ADMIN_DELETE_SUB_CATEGORY
		handleAsyncActions(builder, ADMIN_DELETE_SUB_CATEGORY);

		//ADMIN_GET_ALL_SUB_CATEGORIES
		handleAsyncActions(builder, ADMIN_GET_ALL_SUB_CATEGORIES);

		//GET_ALL_SUB_CATEGORIES
		handleAsyncActions(builder, GET_ALL_SUB_CATEGORIES);

		//GET_SUB_CATEGORIES_OF_CATEGORY
		handleAsyncActions(builder, GET_SUB_CATEGORIES_OF_CATEGORY);

		//GET_SUB_CATEGORY_BY_ID
		handleAsyncActions(builder, GET_SUB_CATEGORY_BY_ID);
	},
});

export default subCategorySlice.reducer;
