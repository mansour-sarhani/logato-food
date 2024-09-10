import Avatar from "@mui/material/Avatar";

export default function LTImage({
	width = 50,
	height = 50,
	variant = "rounded",
	name,
	alt = "Logato",
}) {
	return (
		<Avatar
			src={name.path + name.img}
			sx={{ width: width, height: height }}
			variant={variant}
			alt={alt}
		/>
	);
}
