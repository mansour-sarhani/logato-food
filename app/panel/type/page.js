import { Suspense } from "react";
import TypePage from "@/templates/panel/TypePage";

export const metadata = {
	title: "لوگاتو |  نوع فروشگاه ها",
};

export default function PanelType() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<TypePage />
		</Suspense>
	);
}
