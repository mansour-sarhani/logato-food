"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	direction: "rtl",
	typography: {
		fontFamily: "IranYekan, sans-serif",
		body1: {
			lineHeight: 1.8,
			fontSize: "0.875rem",
		},
		body2: {
			lineHeight: 1.6,
			fontSize: "0.8rem",
		},
		h1: {
			fontFamily: "IranYekanBold, sans-serif",
			fontSize: "2rem",
			fontWeight: "600",
		},
		h2: {
			fontFamily: "IranYekanBold, sans-serif",
			fontSize: "1.85rem",
			fontWeight: "600",
		},
		h3: {
			fontFamily: "IranYekanBold, sans-serif",
			fontSize: "1.7rem",
			fontWeight: "600",
		},
		h4: {
			fontFamily: "IranYekanBold, sans-serif",
			fontSize: "1.5rem",
			fontWeight: "600",
		},
		h5: {
			fontFamily: "IranYekanBold, sans-serif",
			fontSize: "1.25rem",
			fontWeight: "600",
		},
		h6: {
			fontFamily: "IranYekanBold, sans-serif",
			fontSize: "1rem",
			fontWeight: "600",
		},
	},
	palette: {
		primary: {
			main: "#FF6347",
		},
		secondary: {
			main: "#FFD700",
		},
	},
});

export default theme;
