import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
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
import Check from "@mui/icons-material/Check";

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

export default function UpdateProductForm(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { handleClose, setDoReload, currentData } = props;

	const id = currentData._id.toString();

	return (
		<Formik
			initialValues={currentData || initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					name: values.name !== currentData.name ? values.name : null,
					price:
						values.price !== currentData.price
							? values.price
							: null,
					description:
						values.description !== currentData.description
							? values.description
							: null,
					weight:
						values.weight !== currentData.weight
							? values.weight
							: null,
					weightUnit:
						values.weightUnit !== currentData.weightUnit
							? values.weightUnit
							: null,
					quantity:
						values.quantity !== currentData.quantity
							? values.quantity
							: null,
					discount:
						values.discount !== currentData.discount
							? values.discount
							: null,
					discountType:
						values.discountType !== currentData.discountType
							? values.discountType
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
							name="weight"
							label="وزن (در صورت نیاز)"
						/>
						<FormControl className="lt-form-control">
							<label className="lt-label" htmlFor="weight-select">
								واحد وزنی
							</label>
							<NativeSelect
								value={values.weightUnit}
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
								<option value={"gram"}>گرم</option>
								<option value={"kilogram"}>کیلوگرم</option>
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
								value={values.discountType}
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
