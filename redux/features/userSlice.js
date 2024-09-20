import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	role: "",
	status: "idle",
	error: null,
};

export const GET_USER = createAsyncThunk(
	"user/GET_USER",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/user");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const USER_UPDATE_PROFILE = createAsyncThunk(
	"user/USER_UPDATE_PROFILE",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put("/api/user", formData, {
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

export const USER_BOOKMARK_SHOP = createAsyncThunk(
	"user/USER_BOOKMARK_SHOP",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.post(
				"/api/user?bookmarkShop=" + shopId + "&action=bookmark"
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

export const USER_UN_BOOKMARK_SHOP = createAsyncThunk(
	"user/USER_UN_BOOKMARK_SHOP",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.post(
				"/api/user?bookmarkShop=" + shopId + "&action=unbookmark"
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

export const USER_BOOKMARK_PRODUCT = createAsyncThunk(
	"user/USER_BOOKMARK_PRODUCT",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await http.post(
				"/api/user?bookmarkProduct=" + productId + "&action=bookmark"
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

export const USER_UN_BOOKMARK_PRODUCT = createAsyncThunk(
	"user/USER_UN_BOOKMARK_PRODUCT",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await http.post(
				"/api/user?bookmarkProduct=" + productId + "&action=unbookmark"
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

export const GET_USER_BOOKMARKED_SHOPS = createAsyncThunk(
	"user/GET_USER_BOOKMARKED_SHOPS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/user/bookmark?type=shops");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const GET_USER_BOOKMARKED_PRODUCTS = createAsyncThunk(
	"user/GET_USER_BOOKMARKED_PRODUCTS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/user/bookmark?type=products");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const USER_SEARCH_FOR_TERM = createAsyncThunk(
	"user/USER_SEARCH_FOR_TERM",
	async (term, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/search?term=" + term);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const USER_SEARCH_ALL_QUERY = createAsyncThunk(
	"user/USER_SEARCH_ALL_QUERY",
	async (query, { rejectWithValue }) => {
		try {
			const response = await http.get(`/api/search?${query}`);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const USER_ADD_ADDRESS = createAsyncThunk(
	"user/USER_ADD_ADDRESS",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.post("/api/user/address", formData);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const USER_UPDATE_ADDRESS = createAsyncThunk(
	"user/USER_UPDATE_ADDRESS",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put(
				"/api/user/address?addressId=" + data.addressId,
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

export const USER_DELETE_ADDRESS = createAsyncThunk(
	"user/USER_DELETE_ADDRESS",
	async (addressId, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				"/api/user/address?addressId=" + addressId
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

export const GET_USER_ADDRESSES = createAsyncThunk(
	"user/GET_USER_ADDRESSES",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/user/address");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			//GET_USER
			.addCase(GET_USER.pending, (state) => {
				state.status = "loading";
			})
			.addCase(GET_USER.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload.data;
				state.role = action.payload.data.role;
			})
			.addCase(GET_USER.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});

		//USER_UPDATE_PROFILE
		handleAsyncActions(builder, USER_UPDATE_PROFILE);

		//USER_BOOKMARK_SHOP
		handleAsyncActions(builder, USER_BOOKMARK_SHOP);

		//USER_UN_BOOKMARK_SHOP
		handleAsyncActions(builder, USER_UN_BOOKMARK_SHOP);

		//USER_BOOKMARK_PRODUCT
		handleAsyncActions(builder, USER_BOOKMARK_PRODUCT);

		//USER_UN_BOOKMARK_PRODUCT
		handleAsyncActions(builder, USER_UN_BOOKMARK_PRODUCT);

		//USER_SEARCH_FOR_TERM
		// handleAsyncActions(builder, USER_SEARCH_FOR_TERM);

		//USER_SEARCH_ALL_QUERY
		// handleAsyncActions(builder, USER_SEARCH_ALL_QUERY);

		//USER_ADD_ADDRESS
		handleAsyncActions(builder, USER_ADD_ADDRESS);

		//USER_UPDATE_ADDRESS
		handleAsyncActions(builder, USER_UPDATE_ADDRESS);

		//USER_DELETE_ADDRESS
		handleAsyncActions(builder, USER_DELETE_ADDRESS);
	},
});

export default userSlice.reducer;
