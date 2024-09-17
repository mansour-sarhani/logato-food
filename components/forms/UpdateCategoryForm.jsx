import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import adminUpdateCategory from "@/functions/category/adminUpdateCategory";
import getAllTypes from "@/functions/type/getAllTypes";
import LTTextInput from "@/components/inputs/LTTextInput";
import FileUploader from "@/components/fileUpload/FileUploader";
import LTImage from "@/components/global/LTImage";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Check from "@mui/icons-material/Check";
import LTProgress from "@/components/global/LTProgress";

const initialValues = {
	alias: "",
	label: "",
	newParentTypeId: "",
	status: "",
	image: null,
};

export default function UpdateCategoryForm(props) {
	const [types, setTypes] = useState();

	const { handleClose, currentData, setDoReload } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		async function fetchTypes() {
			getAllTypes(dispatch, enqueueSnackbar, setTypes);
		}
		fetchTypes();
	}, []);

	return !types ? (
		<LTProgress />
	) : (
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
					newParentTypeId:
						values.parentTypeId !== currentData.parentTypeId
							? values.parentTypeId
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
					categoryId: currentData.id,
					parentTypeId: currentData.parentTypeId,
				};

				await adminUpdateCategory(dispatch, enqueueSnackbar, finalData);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					{types && (
						<FormControl
							className="lt-form-control"
							style={{ marginBottom: "20px" }}
						>
							<label htmlFor="types-select" className="lt-label">
								نوع فروشگاه
							</label>
							<NativeSelect
								value={values.parentTypeId}
								inputProps={{
									name: "parentTypeId",
									id: "types-select",
								}}
								onChange={(e) => {
									handleChange(e);
									setFieldValue(
										"parentTypeId",
										e.target.value
									);
								}}
								className="lt-select"
							>
								{types.map((type) => (
									<option key={type.id} value={type.id}>
										{type.label}
									</option>
								))}
							</NativeSelect>
						</FormControl>
					)}

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
									دسته بندی{" "}
									<strong style={{ color: "#FF4500" }}>
										فعال
									</strong>{" "}
									است
								</Typography>
							) : (
								<Typography>
									دسته بندی{" "}
									<strong style={{ color: "#FF4500" }}>
										غیر فعال
									</strong>{" "}
									است
								</Typography>
							)
						}
					/>

					<Box className="panel-new-img-container">
						<LTImage
							name={currentData.image}
							variant="rounded"
							width={100}
							height={100}
						/>
						<FileUploader
							title="تصویر جدید"
							name="newImage"
							number={1}
						/>
					</Box>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<Check />
						به روزرسانی دسته بندی
					</Button>
				</Form>
			)}
		</Formik>
	);
}
