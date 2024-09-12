import { Suspense } from "react";
import CityPage from "@/templates/panel/CityPage";

export const metadata = {
	title: "لوگاتو |  شهرها",
};

export default function PanelCity() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CityPage />
		</Suspense>
	);
}
