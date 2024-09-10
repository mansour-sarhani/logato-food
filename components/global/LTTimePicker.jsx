"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { timeFormatter } from "@/utils/timeFormatter";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function LTTimePicker(props) {
	const [value, setValue] = useState(dayjs(new Date()));

	const { name, label, setFieldValue, savedValue } = props;

	useEffect(() => {
		if (savedValue) {
			const [hours, minutes] = savedValue.split(":");
			const date = dayjs().hour(hours).minute(minutes);
			setValue(date);
		}
	}, [savedValue]);

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DemoContainer components={["TimePicker"]}>
				<div className="lt-timepicker-container">
					<label className="lt-label">{label}</label>
					<TimePicker
						name={name}
						value={value}
						onChange={(newValue) => {
							setValue(newValue);
							setFieldValue(
								name,
								timeFormatter(new Date(newValue))
							);
						}}
						className="lt-time-picker"
					/>
				</div>
			</DemoContainer>
		</LocalizationProvider>
	);
}
