import { Suspense } from "react";
import UserProfilePage from "@/templates/panel/UserProfilePage";

export const metadata = {
	title: "لوگاتو |  پنل کاربری",
};

export default function PanelProfile() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<UserProfilePage />;
		</Suspense>
	);
}
