import { Field, ErrorMessage } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

export default function LTTextArea({ name, label, placeholder }) {
	return (
		<FormControl className="lt-form-control">
			<label htmlFor={name} className="lt-label">
				{label}
			</label>
			<Field
				as="textarea"
				name={name}
				placeholder={placeholder}
				className="it-textarea"
			/>
			<FormHelperText className="lt-form-error">
				<ErrorMessage name={name} />
			</FormHelperText>
		</FormControl>
	);
}
