import ShopSinglePage from "@/templates/front/ShopSinglePage";
import { Suspense } from "react";

export const metadata = {
	title: "لوگاتو | مشاهده فروشگاه",
};

export default function ShopSingle({ params }) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ShopSinglePage id={params.id} />
		</Suspense>
	);
}
