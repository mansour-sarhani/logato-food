"use client";

import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function LTPasswordInput({ name, label }) {
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<FormControl className="lt-form-control">
			<label htmlFor={name} className="lt-label">
				{label}
			</label>
			<div className="lt-password-field">
				<Field
					type={showPassword ? "text" : "password"}
					name={name}
					className="lt-input"
				/>
				<IconButton
					aria-label="toggle password visibility"
					aria-describedby="password-helperText"
					onClick={handleClickShowPassword}
					onMouseDown={handleMouseDownPassword}
					edge="end"
				>
					{showPassword ? <VisibilityOff /> : <Visibility />}
				</IconButton>
			</div>
			<FormHelperText className="lt-form-error">
				<ErrorMessage name={name} />
			</FormHelperText>
		</FormControl>
	);
}
