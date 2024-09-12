import { Suspense } from "react";
import CategoryPage from "@/templates/panel/CategoryPage";

export const metadata = {
	title: "لوگاتو |  دسته بندی ها",
};

export default function PanelMenuType() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CategoryPage />
		</Suspense>
	);
}
