import { Field, ErrorMessage } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

const NumberInput = ({ field, form, ...props }) => {
	const handleNumberChange = (e) => {
		let value = e.target.value;
		if (value < 0) {
			value = 0;
		}
		form.setFieldValue(field.name, value);
	};

	return (
		<input
			type="number"
			{...field}
			{...props}
			min="1"
			onChange={handleNumberChange}
			className="lt-input"
		/>
	);
};

export default function LTNumberInput({ name, label }) {
	return (
		<FormControl className="lt-form-control">
			<label htmlFor={name} className="lt-label">
				{label}
			</label>
			<Field
				type="number"
				name={name}
				className="lt-input"
				component={NumberInput}
			/>
			<FormHelperText className="lt-form-error">
				<ErrorMessage name={name} />
			</FormHelperText>
		</FormControl>
	);
}
