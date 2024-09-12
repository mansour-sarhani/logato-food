import { Suspense } from "react";
import NewShopPage from "@/templates/panel/NewShopPage";

export const metadata = {
	title: "لوگاتو |  فروشگاه جدید",
};

export default function PanelNewShop() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NewShopPage />
		</Suspense>
	);
}
