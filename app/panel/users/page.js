import { Suspense } from "react";
import UsersPage from "@/templates/panel/UsersPage";

export const metadata = {
	title: "لوگاتو |  مدیریت کاربران",
};

export default function PanelUsers() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<UsersPage />
		</Suspense>
	);
}
