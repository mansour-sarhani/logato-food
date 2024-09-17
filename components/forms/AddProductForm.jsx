import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import addProduct from "@/functions/product/addProduct";
import LTTextInput from "@/components/inputs/LTTextInput";
import FileUploader from "@/components/fileUpload/FileUploader";
import LTPriceInput from "@/components/inputs/LTPriceInput";
import LTTextArea from "@/components/inputs/LTTextArea";
import LTNumberInput from "@/components/inputs/LTNumberInput";
import NativeSelect from "@mui/material/NativeSelect";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	name: "",
	price: "",
	discount: "",
	discountType: "",
	categoryId: "",
	categoryName: "",
	description: "",
	quantity: "",
	weight: "",
	weightUnit: "",
	size: "",
	sizeUnit: "",
	image: null,
};

const validationSchema = Yup.object({
	name: Yup.string().required("وارد کردن نام ضروری است"),
	price: Yup.string().required("وارد کردن قیمت ضروری است"),
	weightUnit: Yup.string().when("weight", ([weight], schema) => {
		return weight.length > 0
			? schema.required("وارد کردن واحد وزن ضروری است")
			: schema.nullable();
	}),
	sizeUnit: Yup.string().when("size", ([size], schema) => {
		return size.length > 0
			? schema.required("وارد کردن واحد اندازه گیری ضروری است")
			: schema.nullable();
	}),
	discountType: Yup.string().when("discount", ([discount], schema) => {
		return discount.length > 0
			? schema.required("وارد کردن نوع تخفیف ضروری است")
			: schema.nullable();
	}),
});

export default function AddProductForm(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, category, shopId } = props;

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

	return (
		<Formik
			initialValues={initialValues}
			validate={validate}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					categoryId: category._id,
					categoryName: category.name,
					shopId: shopId,
					name: values.name,
					price: values.price,
					discount: values.discount,
					discountType: values.discountType,
					description: values.description,
					quantity: values.quantity,
					weight: values.weight,
					weightUnit: values.weightUnit,
					size: values.size,
					sizeUnit: values.sizeUnit,
					image: values.image ? values.image[0] : null,
				};
				await addProduct(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ setFieldValue, isSubmitting, values }) => (
				<Form className="lt-form panel-form">
					<div className="panel-grid-one">
						<LTTextInput name="name" label="نام*" />
					</div>

					<div className="panel-grid-two">
						<LTPriceInput name="price" label="قیمت*" />
						<LTNumberInput
							name="quantity"
							label="تعداد (در صورت نیاز)"
						/>
					</div>

					<div className="panel-grid-two">
						<LTNumberInput
							name="discount"
							label="تخفیف (در صورت نیاز)"
						/>
						<FormControl className="lt-form-control">
							<label className="lt-label" htmlFor="discountType">
								نوع تخفیف
							</label>
							<NativeSelect
								defaultValue={""}
								inputProps={{
									name: "discountType",
									id: "discountType",
								}}
								onChange={(e) =>
									setFieldValue(
										"discountType",
										e.target.value
									)
								}
								className="lt-select"
								disabled={!values.discount}
							>
								<option value="">انتخاب کنید</option>
								<option value={"amount"}>مبلغ</option>
								<option value={"percent"}>درصد</option>
							</NativeSelect>

							<FormHelperText className="lt-form-error">
								<ErrorMessage name={"discountType"} />
							</FormHelperText>
						</FormControl>
					</div>

					<div className="panel-grid-two">
						<LTNumberInput
							name="size"
							label="اندازه (در صورت نیاز)"
						/>
						<FormControl className="lt-form-control">
							<label className="lt-label" htmlFor="sizeUnit">
								واحد اندازه
							</label>
							<NativeSelect
								defaultValue={""}
								inputProps={{
									name: "sizeUnit",
									id: "sizeUnit",
								}}
								onChange={(e) =>
									setFieldValue("sizeUnit", e.target.value)
								}
								className="lt-select"
								disabled={!values.size}
							>
								<option value="">انتخاب کنید</option>
								<option value="centimeter">سانتیمتر</option>
								<option value="meter">متر</option>
							</NativeSelect>

							<FormHelperText className="lt-form-error">
								<ErrorMessage name={"sizeUnit"} />
							</FormHelperText>
						</FormControl>
					</div>

					<div className="panel-grid-two">
						<LTNumberInput
							name="weight"
							label="وزن (در صورت نیاز)"
						/>
						<FormControl className="lt-form-control">
							<label className="lt-label" htmlFor="weightUnit">
								واحد وزنی
							</label>
							<NativeSelect
								defaultValue={""}
								inputProps={{
									name: "weightUnit",
									id: "weightUnit",
								}}
								onChange={(e) =>
									setFieldValue("weightUnit", e.target.value)
								}
								className="lt-select"
								disabled={!values.weight}
							>
								<option value="">انتخاب کنید</option>
								<option value="gram">گرم</option>
								<option value="kilogram">کیلوگرم</option>
							</NativeSelect>

							<FormHelperText className="lt-form-error">
								<ErrorMessage name={"weightUnit"} />
							</FormHelperText>
						</FormControl>
					</div>

					<LTTextArea
						name="description"
						label="توضیحات"
						setFieldValue={setFieldValue}
						placeholder="ترکیبات آیتم را به صورت موردی ذکر کنید و هر مورد را با ویرگول جدا کنید ..."
					/>

					<FileUploader title="تصویر" name="image" number={1} />

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
						style={{ marginTop: "1rem" }}
					>
						<AddIcon />
						ثبت آیتم
					</Button>
				</Form>
			)}
		</Formik>
	);
}
