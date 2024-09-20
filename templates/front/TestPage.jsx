"use client";

import userSearchAll from "@/functions/user/userSearchAll";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function TestPage() {
	const [results, setResults] = useState();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const query = "city=1";
	useEffect(() => {
		async function getSearchData() {
			await userSearchAll(dispatch, enqueueSnackbar, query, setResults);
		}
		getSearchData();
	}, [query]);

	return <div>TestPage</div>;
}
