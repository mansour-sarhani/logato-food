import { Suspense } from "react";
import ShopsManagementPage from "@/templates/panel/ShopsManagementPage";

export const metadata = {
	title: "لوگاتو |  مدیریت فروشگاه ها",
};

export default function PanelShopManagement() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ShopsManagementPage />
		</Suspense>
	);
}
