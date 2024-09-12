"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import getUser from "@/functions/user/getUser";
import Header from "@/layouts/header/Header";
import Loading from "@/components/global/Loading";

export default function HomeTemplate({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const loading = useSelector((state) => state.user.status);

	useEffect(() => {
		if (loading === "loading") {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [loading]);

	const router = useRouter();
	const pathname = usePathname();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const currentToken = Cookies.get("logato_token");

	useEffect(() => {
		if (currentToken) {
			console.log("has-token");
			getUser(dispatch, enqueueSnackbar, setUser);
		} else {
			console.log("no-token");
			setUser(false);
		}
	}, [currentToken, dispatch, enqueueSnackbar]);

	useEffect(() => {
		if (user === false && pathname.startsWith("/panel/")) {
			console.log("redirect");
			router.push("/auth/login");
		}
	}, [user, pathname, router]);

	console.log(loading);

	if (loading === "loading" && !user) {
		console.log("loading");
		return <Loading isLoading={isLoading} />;
	} else {
		return (
			<div className="home-page">
				<Header user={user} />
				{children}
			</div>
		);
	}
	// return (
	// 	<div className="home-page">
	// 		<Header user={user} />
	// 		{children}
	// 	</div>
	// );
}
