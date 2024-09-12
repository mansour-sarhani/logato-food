import { Suspense } from "react";
import EditShopPage from "@/templates/panel/EditShopPage";

export const metadata = {
	title: "لوگاتو |  ویرایش فروشگاه",
};

export default function PanelEditShop({ params }) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<EditShopPage shopId={params.shopId} />
		</Suspense>
	);
}
