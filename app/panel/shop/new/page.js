import { Suspense } from "react";
import dynamic from "next/dynamic";

const NewShopPage = dynamic(() => import("@/templates/panel/NewShopPage"), {
	ssr: false,
});

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
