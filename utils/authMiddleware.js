import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import User from "@/models/User";

export async function authMiddleware(req) {
	const cookieStore = cookies();
	const tokenObj = cookieStore.get("logato_token");
	const token = tokenObj?.value;
	const secretKey = process.env.JWT_SECRET;

	if (!token) {
		return NextResponse.json(
			{ success: false, message: "توکن وجود ندارد." },
			{ status: 401 }
		);
	}

	const validToken = verifyToken(token, secretKey);
	if (!validToken) {
		return NextResponse.json(
			{ success: false, message: "توکن معتبر نیست." },
			{ status: 401 }
		);
	}

	const user = await User.findOne({ token: token });
	if (!user) {
		return NextResponse.json(
			{ success: false, message: "کاربر یافت نشد." },
			{ status: 404 }
		);
	}

	if (user.role !== "superAdmin") {
		return NextResponse.json(
			{
				success: false,
				message: "شما مجوز لازم را ندارید.",
			},
			{ status: 403 }
		);
	}

	// Attach user to the request object for further use
	req.user = user;
	return null; // No error, proceed with the request
}
