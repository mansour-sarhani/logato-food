"use client";

import Typography from "@mui/material/Typography";
import TypesGrid from "@/components/global/TypesGrid";
import HomeSearch from "@/components/global/HomeSearch";

export default function HomePage() {
	return (
		<div className="home-container">
			<div className="home-bg">
				<div className="lt-container">
					<div className="home-search-wrapper">
						<Typography variant="h1" component="h1">
							لوگاتو
						</Typography>
						<Typography variant="h2" component="h2">
							بهترین جاهای نزدیک تو
						</Typography>
						<HomeSearch />
					</div>
					<TypesGrid />
				</div>
			</div>
		</div>
	);
}
