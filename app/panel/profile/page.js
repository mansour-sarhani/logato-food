import { Suspense } from "react";
import dynamic from "next/dynamic";

const UserProfilePage = dynamic(
	() => import("@/templates/panel/UserProfilePage"),
	{
		ssr: false,
	}
);

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
