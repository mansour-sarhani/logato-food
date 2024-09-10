"use client";
import { cities } from "data/cities";

import { useEffect, useState } from "react";
import { ErrorMessage } from "formik";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import NativeSelect from "@mui/material/NativeSelect";

export default function StateAndCitySelect({
	selectedCity,
	setSelectedCity,
	selectedState,
	setSelectedState,
	setFieldValue,
}) {
	const [states, setStates] = useState([]);
	const [cityNames, setCityNames] = useState([]);

	useEffect(() => {
		const states = cities.map((city) => city.state);
		setStates(states);
	}, []);

	useEffect(() => {
		const cityNames = cities.find(
			(city) => city.state === selectedState
		)?.cityNames;

		setCityNames(cityNames);
	}, [selectedState]);

	return (
		<div className="state-city-input-wrapper">
			<FormControl className="lt-form-control">
				<label htmlFor="state" className="lt-label">
					استان*
				</label>
				<NativeSelect
					value={selectedState || ""}
					inputProps={{
						name: "state",
						id: "state",
					}}
					onChange={(e) => {
						setSelectedState(e.target.value);
						setFieldValue("state", e.target.value);
					}}
					className="lt-select"
				>
					<option value="">لطفا استان را انتخاب نمایید</option>
					{states.map((state) => (
						<option key={state} value={state}>
							{state}
						</option>
					))}
				</NativeSelect>
				<FormHelperText className="lt-form-error">
					<ErrorMessage name="state" />
				</FormHelperText>
			</FormControl>

			{cityNames && (
				<FormControl className="lt-form-control">
					<label htmlFor="city" className="lt-label">
						شهر*
					</label>
					<NativeSelect
						value={selectedCity || ""}
						inputProps={{
							name: "label",
							id: "city",
						}}
						onChange={(e) => {
							setSelectedCity(e.target.value);
							setFieldValue("label", e.target.value);
						}}
						className="lt-select"
					>
						<option value="">لطفا شهر را انتخاب نمایید</option>
						{cityNames.map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</NativeSelect>
					<FormHelperText className="lt-form-error">
						<ErrorMessage name="label" />
					</FormHelperText>
				</FormControl>
			)}
		</div>
	);
}
