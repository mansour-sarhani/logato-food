import { Suspense } from "react";
import dynamic from "next/dynamic";

const ShopSinglePage = dynamic(
	() => import("@/templates/front/ShopSinglePage"),
	{
		ssr: false,
	}
);

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
