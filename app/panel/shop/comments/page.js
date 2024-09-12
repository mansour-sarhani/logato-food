import { Suspense } from "react";
import ShopCommentsPage from "@/templates/panel/ShopComments";

export const metadata = {
	title: "لوگاتو | نظرات",
};

export default function PanelShopComments() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ShopCommentsPage />
		</Suspense>
	);
}
