import { Field, ErrorMessage } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

export default function LTTextInput({ name, label, disabled = false }) {
	return (
		<FormControl className="lt-form-control">
			<label htmlFor={name} className="lt-label">
				{label}
			</label>
			<Field
				type="text"
				name={name}
				className="lt-input"
				disabled={disabled}
			/>
			<FormHelperText className="lt-form-error">
				<ErrorMessage name={name} />
			</FormHelperText>
		</FormControl>
	);
}
