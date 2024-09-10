import "@/styles/globals.css";
import "@/styles/fonts.css";
import "@/styles/dark.css";
import "@/styles/rtl.css";
import "leaflet/dist/leaflet.css";
import "@/styles/styles.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

export default function RootLayout({ children }) {
	return (
		<html dir="rtl">
			<body>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						{children}
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
