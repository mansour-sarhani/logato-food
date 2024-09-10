import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import adminAddSubCategory from "@/functions/subCategory/adminAddSubCategory";
import getAllCategories from "@/functions/category/getAllCategories";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import AddIcon from "@mui/icons-material/Add";
import LTProgress from "../global/LTProgress";

const initialValues = {
	alias: "",
	label: "",
	parentCategoryId: "",
	image: null,
};

const validationSchema = Yup.object({
	alias: Yup.string().required("وارد کردن نام ضروری است"),
	label: Yup.string().required("وارد کردن نام نمایشی ضروری است"),
	parentCategoryId: Yup.string().required("انتخاب دسته بندی اصلی ضروری است"),
});

export default function AddSubCategoryForm(props) {
	const [categories, setCategories] = useState(null);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload } = props;

	const validate = (values) => {
		const errors = {};
		try {
			validationSchema.validateSync(values, { abortEarly: false });
		} catch (validationErrors) {
			validationErrors.inner.forEach((error) => {
				errors[error.path] = error.message;
				enqueueSnackbar(error.message, { variant: "error" });
			});
		}
		return errors;
	};

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
			initialValues={initialValues}
			validate={validate}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					alias: values.alias,
					label: values.label,
					parentCategoryId: values.parentCategoryId,
					typeId: values.typeId,
					image: values.image[0],
				};

				await adminAddSubCategory(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ values, handleChange, setFieldValue, isSubmitting }) => (
				<Form className="lt-form panel-form">
					{categories && (
						<FormControl
							className="lt-form-control"
							style={{ marginBottom: "20px" }}
						>
							<label htmlFor="categories" className="lt-label">
								دسته بندی*
							</label>
							<NativeSelect
								value={JSON.stringify(
									categories.find(
										(category) =>
											category.id ===
											values.parentCategoryId
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
							<FormHelperText className="lt-form-error">
								<ErrorMessage name="parentCategoryId" />
							</FormHelperText>
						</FormControl>
					)}

					<LTTextInput name="alias" label="عنوان (به انگلیسی)*" />
					<LTTextInput name="label" label="عنوان نمایشی*" />

					<FileUploader title="تصویر" name="image" number={1} />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<AddIcon />
						ثبت زیر دسته
					</Button>
				</Form>
			)}
		</Formik>
	);
}
