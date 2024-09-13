import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";

export default function LTImage({
	width = 50,
	height = 50,
	variant = "rounded",
	name,
	alt = "Logato",
}) {
	const [isLoading, setIsLoading] = useState(true);

	const imageUrl = `/api/images?path=${name.path}&img=${name.img}`;

	const skeleton = (
		<Skeleton
			variant={
				variant === "circle"
					? "circular"
					: variant === "rectangular"
					? "rectangular"
					: "rounded"
			}
			width={width}
			height={height}
			animation="wave"
		/>
	);

	return (
		<>
			{isLoading && skeleton}
			<img
				src={imageUrl}
				alt={alt}
				width={width}
				height={height}
				style={{
					borderRadius:
						variant === "circle"
							? "50%"
							: variant === "rectangular"
							? "0"
							: "4px",
					display: isLoading ? "none" : "block",
				}}
				onLoad={() => setIsLoading(false)}
				onError={() => setIsLoading(false)}
			/>
		</>
	);
}
