import EditShopPage from "@/templates/panel/EditShopPage";

export const metadata = {
	title: "لوگاتو |  ویرایش فروشگاه",
};

export default function PanelEditShop({ params }) {
	return <EditShopPage shopId={params.shopId} />;
}
