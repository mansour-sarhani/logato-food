import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import adminUpdateType from "@/functions/type/adminUpdateType";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Check from "@mui/icons-material/Check";

const initialValues = {
	alias: "",
	label: "",
	status: "active",
	image: null,
};

export default function UpdateTypeForm(props) {
	const { handleClose, currentData, setDoReload } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	return (
		<Formik
			initialValues={currentData || initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					alias:
						values.alias !== currentData.alias
							? values.alias
							: null,
					label:
						values.label !== currentData.label
							? values.label
							: null,
					status:
						values.status !== currentData.status
							? values.status
							: null,
					image: values.newImage ? values.newImage[0] : null,
				};

				function filteredData(data) {
					const result = {};
					for (const key in data) {
						if (data[key] !== null) {
							result[key] = data[key];
						}
					}
					return result;
				}

				const filtered = filteredData(data);

				const finalData = {
					...filtered,
					typeId: currentData.id,
				};

				await adminUpdateType(dispatch, enqueueSnackbar, finalData);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					<LTTextInput name="alias" label="عنوان (به انگلیسی)" />
					<LTTextInput name="label" label="عنوان نمایشی" />

					<FormControlLabel
						className="lt-switch-input"
						style={{ marginBottom: "20px" }}
						control={
							<Switch
								checked={values.status === "active"}
								onChange={(e) => {
									handleChange(e);
									setFieldValue(
										"status",
										e.target.checked ? "active" : "inactive"
									);
								}}
								name="status"
							/>
						}
						label={
							values.status === "active" ? (
								<Typography>
									نوع فروشگاه{" "}
									<strong style={{ color: "#FF4500" }}>
										فعال
									</strong>{" "}
									است
								</Typography>
							) : (
								<Typography>
									نوع فروشگاه{" "}
									<strong style={{ color: "#FF4500" }}>
										غیر فعال
									</strong>{" "}
									است
								</Typography>
							)
						}
					/>
					<div className="panel-new-img-container">
						<Avatar
							src={currentData.image.path + currentData.image.img}
							style={{
								width: "100px",
								height: "100px",
								marginTop: "40px",
							}}
						/>
						<FileUploader
							title="تصویر جدید"
							name="newImage"
							number={1}
						/>
					</div>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<Check />
						به روزرسانی نوع فروشگاه
					</Button>
				</Form>
			)}
		</Formik>
	);
}
