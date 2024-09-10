import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Field, ErrorMessage } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";

const PriceInput = ({ field, form, ...props }) => {
	const [isFocused, setIsFocused] = useState(false);

	const handleChange = (e) => {
		let value = e.target.value.replace(/,/g, "");
		if (value < 0 || (value.length > 1 && value.startsWith("0"))) {
			form.setFieldValue(field.name, 0);
		} else {
			form.setFieldValue(field.name, value);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
		form.setFieldTouched(field.name, true);
	};

	return (
		<NumericFormat
			{...field}
			{...props}
			thousandSeparator={true}
			allowNegative={false}
			onChange={handleChange}
			customInput={(inputProps) => (
				<input
					type="text"
					{...inputProps}
					onFocus={handleFocus}
					onBlur={handleBlur}
					autoFocus={isFocused}
				/>
			)}
		/>
	);
};

export default function LTPriceInput({ name, label }) {
	return (
		<FormControl className="lt-form-control">
			<label htmlFor={name} className="lt-label">
				{label}
			</label>
			<Box className="lt-price-input">
				<Field
					id={name}
					name={name}
					component={PriceInput}
					className="lt-input"
				/>
				<span className="lt-price-unit">تومان</span>
			</Box>
			<FormHelperText className="lt-form-error">
				<ErrorMessage name={name} />
			</FormHelperText>
		</FormControl>
	);
}
