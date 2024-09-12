import { Suspense } from "react";
import dynamic from "next/dynamic";

const ShopPage = dynamic(() => import("@/templates/panel/ShopPage"), {
	ssr: false,
});

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
