import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const pathValue = searchParams.get("path");
	const imgValue = searchParams.get("img");
	const imagePath = path.join(process.cwd(), "public", pathValue, imgValue);
	const placeholderPath = path.join(
		process.cwd(),
		"public",
		"assets/images/front/placeholder.png"
	);

	if (!imgValue || !fs.existsSync(imagePath)) {
		const readStream = fs.createReadStream(placeholderPath);
		return new NextResponse(readStream);
	} else {
		const readStream = fs.createReadStream(imagePath);
		return new NextResponse(readStream);
	}
}
