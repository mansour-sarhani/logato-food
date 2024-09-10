import { Suspense } from "react";
import LoginPage from "@/templates/auth/LoginPage";

export const metadata = {
	title: "لوگاتو | ورود",
};

export default function Login() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginPage />
		</Suspense>
	);
}
