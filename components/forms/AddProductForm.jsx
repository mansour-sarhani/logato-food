import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import addProduct from "@/functions/product/addProduct";
import LTTextInput from "@/components/global/LTTextInput";
import FileUploader from "@/components/global/FileUploader";
import LTPriceInput from "@/components/global/LTPriceInput";
import LTTextArea from "@/components/global/LTTextArea";
import LTNumberInput from "@/components/global/LTNumberInput";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import AddIcon from "@mui/icons-material/Add";

const initialValues = {
	name: "",
	price: "",
	categoryId: "",
	categoryName: "",
	description: "",
	weight: "",
	weightUnit: "",
	quantity: "",
	discount: "",
	discountType: "",
	image: null,
};

const validationSchema = Yup.object({
	name: Yup.string().required("وارد کردن نام ضروری است"),
	price: Yup.string().required("وارد کردن قیمت ضروری است"),
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
					name: values.name,
					price: values.price,
					categoryId: category._id,
					categoryName: category.name,
					shopId: shopId,
					description: values.description,
					weight: values.weight,
					weightUnit: values.weightUnit,
					quantity: values.quantity,
					discount: values.discount,
					discountType: values.discountType,
					image: values.image ? values.image[0] : null,
				};
				await addProduct(dispatch, enqueueSnackbar, data);
				setSubmitting(false);
				resetForm();
				setDoReload(true);
				handleClose(true);
			}}
		>
			{({ setFieldValue, isSubmitting }) => (
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
							name="weight"
							label="وزن (در صورت نیاز)"
						/>
						<FormControl className="lt-form-control">
							<label className="lt-label" htmlFor="weight-select">
								واحد وزنی
							</label>
							<NativeSelect
								defaultValue={""}
								inputProps={{
									name: "weightUnit",
									id: "weight-select",
								}}
								onChange={(e) =>
									setFieldValue("weightUnit", e.target.value)
								}
								className="lt-select"
							>
								<option value="">انتخاب کنید</option>
								<option value="gram">گرم</option>
								<option value="kilogram">کیلوگرم</option>
							</NativeSelect>
						</FormControl>
					</div>

					<div className="panel-grid-two">
						<LTNumberInput
							name="discount"
							label="تخفیف (در صورت نیاز)"
						/>
						<FormControl className="lt-form-control">
							<label
								className="lt-label"
								htmlFor="discountType-select"
							>
								نوع تخفیف
							</label>
							<NativeSelect
								defaultValue={""}
								inputProps={{
									name: "discountType",
									id: "discountType-select",
								}}
								onChange={(e) =>
									setFieldValue(
										"discountType",
										e.target.value
									)
								}
								className="lt-select"
							>
								<option value="">انتخاب کنید</option>
								<option value={"amount"}>مبلغ</option>
								<option value={"percent"}>درصد</option>
							</NativeSelect>
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
