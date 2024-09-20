"use client";

import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import LTSearchInput from "@/components/inputs/LTSearchInput";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const initialValues = {
	term: "",
};

export default function HomeSearch() {
	const router = useRouter();
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values, { setSubmitting }) => {
				const term = values.term;
				if (term) {
					router.push(`/search-results?term=${term}`);
				} else {
					router.push(`/search-results`);
				}
				setSubmitting(false);
			}}
		>
			{({ isSubmitting }) => (
				<Form className="lt-form search-form">
					<Box className="search-input-wrapper">
						<LTSearchInput
							name="term"
							label="نام غذا یا فروشگاه مورد نظر را جستجو کنید ..."
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={isSubmitting}
						>
							<SearchOutlinedIcon />
							جستجو
						</Button>
					</Box>
				</Form>
			)}
		</Formik>
	);
}
