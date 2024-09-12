import { Suspense } from "react";
import CommentsPage from "@/templates/panel/CommentsPage";

export const metadata = {
	title: "لوگاتو |  مدیریت نظرات",
};

export default function PanelComments() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CommentsPage />
		</Suspense>
	);
}
