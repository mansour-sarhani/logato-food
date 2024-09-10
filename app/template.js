"use client";

import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import store from "@/redux/store";

export default function RootTemplate({ children }) {
	return (
		<Provider store={store}>
			<SnackbarProvider
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				maxSnack={10}
			>
				<div className="main">{children}</div>
			</SnackbarProvider>
		</Provider>
	);
}
