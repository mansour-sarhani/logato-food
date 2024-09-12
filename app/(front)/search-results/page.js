import { Suspense } from "react";
import SearchPage from "@/templates/front/SearchPage";

export const metadata = {
	title: "لوگاتو | نتایج جستجو",
};

export default function Search() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SearchPage />
		</Suspense>
	);
}
