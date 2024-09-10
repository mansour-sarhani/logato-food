import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./features/authSlice";
import publicSlice from "./features/publicSlice";
import adminSlice from "./features/adminSlice";
import userSlice from "./features/userSlice";
import citySlice from "./features/citySlice";
import typeSlice from "./features/typeSlice";
import categorySlice from "./features/categorySlice";
import subCategorySlice from "./features/subCategorySlice";
import shopSlice from "./features/shopSlice";
import productSlice from "./features/productSlice";
import commentSlice from "./features/commentSlice";

export default configureStore({
	reducer: {
		auth: authSlice,
		public: publicSlice,
		admin: adminSlice,
		user: userSlice,
		city: citySlice,
		type: typeSlice,
		category: categorySlice,
		subCategory: subCategorySlice,
		shop: shopSlice,
		product: productSlice,
		comment: commentSlice,
	},
});
