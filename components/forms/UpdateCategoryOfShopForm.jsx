import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import updateCategoryOfShop from "@/functions/shop/updateCategoryOfShop";
import LTTextInput from "@/components/global/LTTextInput";
import Button from "@mui/material/Button";
import Check from "@mui/icons-material/Check";

const initialValues = {
	name: "",
};

export default function UpdateCategoryOfShopForm(props) {
	const { handleClose, currentData, setDoReload, shopId } = props;

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	return (
		<Formik
			initialValues={currentData || initialValues}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const data = {
					name: values.name !== currentData.name ? values.name : null,
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
					categoryId: currentData._id,
					shopId: shopId,
				};

				await updateCategoryOfShop(
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
			{({ isSubmitting }) => (
				<Form className="lt-form panel-form">
					<LTTextInput name="name" label="دسته بندی" />

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
