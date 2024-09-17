import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import getAllCategories from "@/functions/category/getAllCategories";
import adminUpdateSubCategory from "@/functions/subCategory/adminUpdateSubCategory";
import LTTextInput from "@/components/inputs/LTTextInput";
import FileUploader from "@/components/fileUpload/FileUploader";
import LTProgress from "@/components/global/LTProgress";
import LTImage from "@/components/global/LTImage";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Check from "@mui/icons-material/Check";

const initialValues = {
	alias: "",
	label: "",
	parentCategoryId: "",
	status: "",
	image: null,
};

export default function UpdateSubCategoryForm(props) {
	const [categories, setCategories] = useState(null);

	const { handleClose, currentData, setDoReload } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		async function fetchData() {
			await getAllCategories(dispatch, enqueueSnackbar, setCategories);
		}
		fetchData();
	}, []);

	return !categories ? (
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
					newParentCategoryId:
						values.parentCategoryId !== currentData.parentCategoryId
							? values.parentCategoryId
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
					subCategoryId: currentData.id,
					categoryId: currentData.parentCategoryId,
					typeId: values.typeId,
				};

				await adminUpdateSubCategory(
					dispatch,
					enqueueSnackbar,
					finalData
				);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					<FormControl
						className="lt-form-control"
						style={{ marginBottom: "20px" }}
					>
						<label htmlFor="categories" className="lt-label">
							دسته بندی
						</label>
						<NativeSelect
							value={JSON.stringify(
								categories.find(
									(category) =>
										category.id === values.parentCategoryId
								) || ""
							)}
							inputProps={{
								name: "parentCategoryId",
								id: "categories",
							}}
							onChange={(e) => {
								handleChange(e);
								const selectedCategory = JSON.parse(
									e.target.value
								);
								setFieldValue(
									"parentCategoryId",
									selectedCategory.id
								);
								setFieldValue(
									"typeId",
									selectedCategory.parentTypeId
								);
							}}
							className="lt-select"
						>
							<option value="">
								لطفا دسته بندی را انتخاب نمایید
							</option>
							{categories.map((category) => (
								<option
									key={category.id}
									value={JSON.stringify(category)}
								>
									{category.label}
								</option>
							))}
						</NativeSelect>
					</FormControl>

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
									زیر دسته{" "}
									<strong style={{ color: "#FF4500" }}>
										فعال
									</strong>{" "}
									است
								</Typography>
							) : (
								<Typography>
									زیر دسته{" "}
									<strong style={{ color: "#FF4500" }}>
										غیر فعال
									</strong>{" "}
									است
								</Typography>
							)
						}
					/>
					<div className="panel-new-img-container">
						<LTImage
							name={currentData.image}
							variant="rounded"
							width={100}
							height={100}
						/>
						<FileUploader
							title="تصویر"
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
						به روزرسانی زیر دسته
					</Button>
				</Form>
			)}
		</Formik>
	);
}
