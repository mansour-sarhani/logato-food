import { Suspense } from "react";
import HomePage from "@/templates/front/HomePage";

export const metadata = {
	title: "لوگاتو - بهترین  غذای نزدیک تو",
};

export default function Home() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<HomePage />
		</Suspense>
	);
}
