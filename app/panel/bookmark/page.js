import BookmarkPage from "@/templates/panel/BookmarkPage";
import { Suspense } from "react";

export const metadata = {
	title: "لوگاتو |  علاقه مندی ها",
};

export default function PanelBookmark() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<BookmarkPage />
		</Suspense>
	);
}
