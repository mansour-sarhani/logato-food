import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: {},
	status: "idle",
	error: null,
	theme: "light",
	lang: "fa",
	viewPort: "desktop",
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
		setViewPort: (state, action) => {
			const viewPort = action.payload.viewPort;
			state.viewPort = viewPort;
		}
	},
});

export const { toggleTheme, toggleLanguage, setViewPort } = publicSlice.actions;

export default publicSlice.reducer;
