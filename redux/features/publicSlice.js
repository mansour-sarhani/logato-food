import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: {},
	status: "idle",
	error: null,
	theme: "light",
	lang: "fa",
};

export const publicSlice = createSlice({
	name: "public",
	initialState,
	reducers: {
		toggleTheme: (state, action) => {
			const theme = action.payload.theme;
			state.theme = theme;
			localStorage.setItem("theme", theme);
		},
		toggleLanguage: (state, action) => {
			const lang = action.payload.lang;
			state.lang = lang;
			localStorage.setItem("lang", lang);
		},
	},
});

export const { toggleTheme, toggleLanguage } = publicSlice.actions;

export default publicSlice.reducer;
