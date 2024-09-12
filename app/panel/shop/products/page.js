import { Suspense } from "react";
import ProductPage from "@/templates/panel/ProductPage";

export const metadata = {
	title: "لوگاتو |  مدیریت محصولات",
};

export default function PanelProduct() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProductPage />
		</Suspense>
	);
}
