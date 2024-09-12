import Image from "next/image";

export default function Logo({ color, width = 243, height = 50 }) {
	return (
		<Image
			src={`/assets/images/front/logo-${color}.png`}
			width={width}
			height={height}
			alt="لوگاتو"
			className="logo"
		/>
	);
}
