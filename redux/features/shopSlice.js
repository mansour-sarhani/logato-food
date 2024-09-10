import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const CREATE_NEW_SHOP = createAsyncThunk(
	"shop/CREATE_NEW_SHOP",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			Object.keys(data).forEach((key) => {
				if (key === "logo" || key === "cover") {
					if (data[key]) {
						formData.append(key, data[key]);
					}
				} else if (
					typeof data[key] === "object" &&
					data[key] !== null
				) {
					formData.append(key, JSON.stringify(data[key]));
				} else {
					formData.append(key, data[key]);
				}
			});

			const response = await http.post("/api/shop", formData, {
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

export const UPDATE_SHOP = createAsyncThunk(
	"shop/UPDATE_SHOP",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			Object.keys(data).forEach((key) => {
				if (key === "logo" || key === "cover") {
					if (data[key]) {
						formData.append(key, data[key]);
					}
				} else if (
					typeof data[key] === "object" &&
					data[key] !== null
				) {
					formData.append(key, JSON.stringify(data[key]));
				} else {
					formData.append(key, data[key]);
				}
			});

			const response = await http.put(
				"/api/shop?shopId=" + data.shopId,
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

export const GET_ALL_SHOPS = createAsyncThunk(
	"shop/GET_ALL_SHOPS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/shop");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_SHOP_BY_ID = createAsyncThunk(
	"shop/GET_SHOP_BY_ID",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/shop?shopId=" + shopId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_SHOP_BY_OWNER_ID = createAsyncThunk(
	"shop/GET_SHOP_BY_OWNER_ID",
	async (ownerId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/shop?ownerId=" + ownerId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADD_CATEGORY_TO_SHOP = createAsyncThunk(
	"shop/ADD_CATEGORY_TO_SHOP",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.post("/api/shop/category", data, {
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

export const UPDATE_CATEGORY_OF_SHOP = createAsyncThunk(
	"shop/UPDATE_CATEGORY_OF_SHOP",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put(
				`/api/shop/category?shopId=${data.shopId}&categoryId=${data.categoryId}`,
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

export const DELETE_CATEGORY_OF_SHOP = createAsyncThunk(
	"shop/DELETE_CATEGORY_OF_SHOP",
	async (data, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				`/api/shop/category?shopId=${data.shopId}&categoryId=${data.categoryId}`
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

export const shopSlice = createSlice({
	name: "shop",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;
		//CREATE_NEW_SHOP
		handleAsyncActions(builder, CREATE_NEW_SHOP);

		//UPDATE_SHOP
		handleAsyncActions(builder, UPDATE_SHOP);

		//GET_ALL_SHOPS
		handleAsyncActions(builder, GET_ALL_SHOPS);

		//GET_SHOP_BY_ID
		handleAsyncActions(builder, GET_SHOP_BY_ID);

		//GET_SHOP_BY_OWNER_ID
		handleAsyncActions(builder, GET_SHOP_BY_OWNER_ID);

		//ADD_CATEGORY_TO_SHOP
		handleAsyncActions(builder, ADD_CATEGORY_TO_SHOP);

		//UPDATE_CATEGORY_OF_SHOP
		handleAsyncActions(builder, UPDATE_CATEGORY_OF_SHOP);

		//DELETE_CATEGORY_OF_SHOP
		handleAsyncActions(builder, DELETE_CATEGORY_OF_SHOP);
	},
});

export default shopSlice.reducer;
