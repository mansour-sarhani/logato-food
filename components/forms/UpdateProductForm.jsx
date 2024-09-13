import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import updateProduct from "@/functions/product/updateProduct";
import LTTextArea from "@/components/global/LTTextArea";
import LTNumberInput from "@/components/global/LTNumberInput";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import LTPriceInput from "@/components/global/LTPriceInput";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import NativeSelect from "@mui/material/NativeSelect";
import FormHelperText from "@mui/material/FormHelperText";
import Check from "@mui/icons-material/Check";

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

export default function UpdateProductForm(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, currentData } = props;

	const id = currentData._id.toString();

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
			initialValues={currentData || initialValues}
			validate={validate}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					name: values.name !== currentData.name ? values.name : null,
					price:
						values.price !== currentData.price
							? values.price
							: null,
					discount:
						values.discount !== currentData.discount
							? values.discount
							: null,
					discountType:
						values.discountType !== currentData.discountType
							? values.discountType
							: null,
					description:
						values.description !== currentData.description
							? values.description
							: null,
					quantity:
						values.quantity !== currentData.quantity
							? values.quantity
							: null,
					weight:
						values.weight !== currentData.weight
							? values.weight
							: null,
					weightUnit:
						values.weightUnit !== currentData.weightUnit
							? values.weightUnit
							: null,
					size: values.size !== currentData.size ? values.size : null,
					sizeUnit:
						values.sizeUnit !== currentData.sizeUnit
							? values.sizeUnit
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
					productId: id,
					shopId: currentData.shopId,
				};

				await updateProduct(dispatch, enqueueSnackbar, finalData);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ setFieldValue, isSubmitting, values }) => (
				<Form className="lt-form panel-form">
					<div className="panel-grid-one">
						<LTTextInput name="name" label="نام" />
					</div>

					<div className="panel-grid-two">
						<LTPriceInput name="price" label="قیمت" />
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
								value={values.discountType}
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
								value={values.sizeUnit}
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
								value={values.weightUnit}
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
								<option value={"gram"}>گرم</option>
								<option value={"kilogram"}>کیلوگرم</option>
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
						به روزرسانی آیتم
					</Button>
				</Form>
			)}
		</Formik>
	);
}
