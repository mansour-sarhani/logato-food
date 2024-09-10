import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { verifyPassword } from "@/utils/verifyPassword";

//USER LOGIN => "/api/auth/login"
export async function POST(req) {
	await dbConnect();

	try {
		const formData = await req.formData();
		const email = formData.get("email");
		const password = formData.get("password");

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "کاربری با این ایمیل پیدا نشد." },
				{ status: 404 }
			);
		}

		const isValid = await verifyPassword(password, user.password);

		if (!isValid) {
			return NextResponse.json(
				{ success: false, message: "رمز عبور اشتباه است." },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true, token: user.token });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
