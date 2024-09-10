import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "@/functions/httpService";
import { handleAsyncActions } from "@/utils/handleAsyncActions";

const initialState = {
	data: {},
	status: "idle",
	error: null,
};

export const ADMIN_GET_ALL_USERS = createAsyncThunk(
	"admin/ADMIN_GET_ALL_USERS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/users");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_GET_USER_BY_ID = createAsyncThunk(
	"admin/ADMIN_GET_USER_BY_ID",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/admin/users?userId=" + userId
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

export const ADMIN_ADD_USER = createAsyncThunk(
	"admin/ADMIN_ADD_USER",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.post("/api/admin/users", formData, {
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

export const ADMIN_UPDATE_USER = createAsyncThunk(
	"admin/ADMIN_UPDATE_USER",
	async (data, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			for (const key in data) {
				formData.append(key, data[key]);
			}

			const response = await http.put(
				"/api/admin/users?userId=" + data.userId,
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

export const ADMIN_ADD_SHOP = createAsyncThunk(
	"admin/ADMIN_ADD_SHOP",
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

			const response = await http.post("/api/admin/shop", formData, {
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

export const ADMIN_UPDATE_SHOP = createAsyncThunk(
	"admin/ADMIN_UPDATE_SHOP",
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
				"/api/admin/shop?shopId=" + data.shopId,
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

export const ADMIN_DELETE_SHOP = createAsyncThunk(
	"admin/ADMIN_DELETE_SHOP",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.delete(
				"/api/admin/shop?shopId=" + shopId
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

export const ADMIN_GET_ALL_SHOPS = createAsyncThunk(
	"admin/ADMIN_GET_ALL_SHOPS",
	async (_, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/shop");
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_GET_SHOP_BY_ID = createAsyncThunk(
	"admin/ADMIN_GET_SHOP_BY_ID",
	async (shopId, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/shop?shopId=" + shopId);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_GET_SHOP_BY_OWNER_ID = createAsyncThunk(
	"admin/ADMIN_GET_SHOP_BY_OWNER_ID",
	async (ownerId, { rejectWithValue }) => {
		try {
			const response = await http.get(
				"/api/admin/shop?ownerId=" + ownerId
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

export const ADMIN_GET_SHOPS_BY_STATUS = createAsyncThunk(
	"admin/ADMIN_GET_SHOPS_BY_STATUS",
	async (status, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/shop?status=" + status);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const ADMIN_GET_SHOPS_BY_SEARCH = createAsyncThunk(
	"admin/ADMIN_GET_SHOPS_BY_SEARCH",
	async (search, { rejectWithValue }) => {
		try {
			const response = await http.get("/api/admin/shop?search=" + search);
			return response.data;
		} catch (err) {
			if (!err.response) {
				throw err;
			}
			return rejectWithValue(err.response.data);
		}
	}
);

export const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder;

		//ADMIN_GET_ALL_USERS
		handleAsyncActions(builder, ADMIN_GET_ALL_USERS);

		//ADMIN_GET_USER_BY_ID
		handleAsyncActions(builder, ADMIN_GET_USER_BY_ID);

		//ADMIN_ADD_USER
		handleAsyncActions(builder, ADMIN_ADD_USER);

		//ADMIN_UPDATE_USER
		handleAsyncActions(builder, ADMIN_UPDATE_USER);

		//ADMIN_ADD_SHOP
		handleAsyncActions(builder, ADMIN_ADD_SHOP);

		//ADMIN_UPDATE_SHOP
		handleAsyncActions(builder, ADMIN_UPDATE_SHOP);

		//ADMIN_DELETE_SHOP
		handleAsyncActions(builder, ADMIN_DELETE_SHOP);

		//ADMIN_GET_ALL_SHOPS
		handleAsyncActions(builder, ADMIN_GET_ALL_SHOPS);

		//ADMIN_GET_SHOP_BY_ID
		handleAsyncActions(builder, ADMIN_GET_SHOP_BY_ID);

		//ADMIN_GET_SHOP_BY_OWNER_ID
		handleAsyncActions(builder, ADMIN_GET_SHOP_BY_OWNER_ID);

		//ADMIN_GET_SHOPS_BY_STATUS
		handleAsyncActions(builder, ADMIN_GET_SHOPS_BY_STATUS);

		//ADMIN_GET_SHOPS_BY_SEARCH
		handleAsyncActions(builder, ADMIN_GET_SHOPS_BY_SEARCH);
	},
});

export default adminSlice.reducer;
