import { Field } from "formik";
import FormControl from "@mui/material/FormControl";

export default function LTSearchInput({ name, label }) {
	return (
		<FormControl className="lt-form-control">
			<Field
				type="text"
				name={name}
				className="lt-input search-input"
				placeholder={label}
			/>
		</FormControl>
	);
}
