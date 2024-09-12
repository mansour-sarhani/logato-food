import { Suspense } from "react";
import SubCategoryPage from "@/templates/panel/SubCategoryPage";

export const metadata = {
	title: "لوگاتو |  زیر دسته ها",
};

export default function PanelMenuCategory() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SubCategoryPage />
		</Suspense>
	);
}
