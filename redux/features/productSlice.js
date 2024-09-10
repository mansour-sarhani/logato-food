import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADD_PRODUCT = createAsyncThunk(
	"product/ADD_PRODUCT",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.post("/api/product", formData, {
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

export const UPDATE_PRODUCT = createAsyncThunk(
	"product/UPDATE_PRODUCT",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put(
				"/api/product?productId=" + data.productId,
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

export const DELETE_PRODUCT = createAsyncThunk(
	"product/DELETE_PRODUCT",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				"/api/product?productId=" + productId
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

export const GET_ALL_PRODUCTS = createAsyncThunk(
	"product/GET_ALL_PRODUCTS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/product");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_PRODUCT_BY_ID = createAsyncThunk(
	"product/GET_PRODUCT_BY_ID",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/product?productId=" + productId
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

export const GET_PRODUCTS_BY_SHOP_ID = createAsyncThunk(
	"product/GET_PRODUCTS_BY_SHOP_ID",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/product?shopId=" + shopId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;
		//ADD_PRODUCT
		handleAsyncActions(builder, ADD_PRODUCT);

		//UPDATE_PRODUCT
		handleAsyncActions(builder, UPDATE_PRODUCT);

		//DELETE_PRODUCT
		handleAsyncActions(builder, DELETE_PRODUCT);

		//GET_ALL_PRODUCTS
		handleAsyncActions(builder, GET_ALL_PRODUCTS);

		//GET_PRODUCT_BY_ID
		handleAsyncActions(builder, GET_PRODUCT_BY_ID);

		//GET_PRODUCTS_BY_SHOP_ID
		handleAsyncActions(builder, GET_PRODUCTS_BY_SHOP_ID);
	},
});

export default productSlice.reducer;
