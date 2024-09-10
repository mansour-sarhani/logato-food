import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADD_COMMENT = createAsyncThunk(
	"comment/ADD_COMMENT",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.post("/api/comment", formData);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const UPDATE_COMMENT_STATUS = createAsyncThunk(
	"comment/UPDATE_COMMENT_STATUS",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put(
				`/api/comment?commentId=${data.commentId}`,
				formData
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

export const RESPOND_TO_COMMENT = createAsyncThunk(
	"comment/RESPOND_TO_COMMENT",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.post(
				"/api/comment?respondTo=" + data.parentCommentId,
				formData
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

export const GET_ALL_COMMENTS = createAsyncThunk(
	"comment/GET_ALL_COMMENTS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/comment");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_COMMENT_BY_ID = createAsyncThunk(
	"comment/GET_COMMENT_BY_ID",
	async (commentId, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/comment?commentId=" + commentId
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

export const GET_COMMENT_FOR_SHOP = createAsyncThunk(
	"comment/GET_COMMENT_FOR_SHOP",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/comment?shopId=" + shopId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_COMMENT_FOR_PRODUCT = createAsyncThunk(
	"comment/GET_COMMENT_FOR_PRODUCT",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/comment?productId=" + productId
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

export const GET_COMMENT_FOR_SHOP_PRODUCTS = createAsyncThunk(
	"comment/GET_COMMENT_FOR_SHOP_PRODUCTS",
	async (productsShopId, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/comment?productsShopId=" + productsShopId
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

export const GET_COMMENTS_BY_STATUS = createAsyncThunk(
	"comment/GET_COMMENTS_BY_STATUS",
	async (status, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/comment?status=" + status);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_COMMENTS_OF_USER = createAsyncThunk(
	"comment/GET_COMMENTS_OF_USER",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/comment?userId=" + userId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;
		//ADD_COMMENT
		handleAsyncActions(builder, ADD_COMMENT);

		//UPDATE_COMMENT_STATUS
		handleAsyncActions(builder, UPDATE_COMMENT_STATUS);

		//RESPOND_TO_COMMENT
		handleAsyncActions(builder, RESPOND_TO_COMMENT);

		//GET_ALL_COMMENTS
		handleAsyncActions(builder, GET_ALL_COMMENTS);

		//GET_COMMENT_BY_ID
		handleAsyncActions(builder, GET_COMMENT_BY_ID);

		//GET_COMMENT_FOR_SHOP
		handleAsyncActions(builder, GET_COMMENT_FOR_SHOP);

		//GET_COMMENT_FOR_PRODUCT
		handleAsyncActions(builder, GET_COMMENT_FOR_PRODUCT);

		//GET_COMMENT_FOR_SHOP_PRODUCTS
		handleAsyncActions(builder, GET_COMMENT_FOR_SHOP_PRODUCTS);

		//GET_COMMENTS_BY_STATUS
		handleAsyncActions(builder, GET_COMMENTS_BY_STATUS);

		//GET_COMMENTS_OF_USER
		handleAsyncActions(builder, GET_COMMENTS_OF_USER);
	},
});

export default commentSlice.reducer;
