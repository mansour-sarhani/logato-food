import { Suspense } from "react";
import ShopPage from "@/templates/panel/ShopPage";

export const metadata = {
	title: "لوگاتو |  فروشگاه",
};

export default function PanelShop() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ShopPage />
		</Suspense>
	);
}
