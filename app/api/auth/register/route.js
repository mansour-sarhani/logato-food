import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import generateToken from "@/utils/jwt";
import { hashPassword } from "@/utils/hashPassword";
import Counter from "@/models/Counter";

//USER REGISTER => "/api/auth/register"
export async function POST(req) {
	await dbConnect();

	try {
		const formData = await req.formData();
		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");
		const email = formData.get("email");
		const password = formData.get("password");
		const role = formData.get("role");

		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return NextResponse.json(
				{ success: false, message: "این ایمیل قبلا ثبت شده است." },
				{ status: 400 }
			);
		}

		const hashedPassword = await hashPassword(password);

		const user = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			role,
		});

		const token = generateToken(user);
		user.token = token;

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "userId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		user.value = counter.seq;

		await user.save();

		return NextResponse.json({ success: true, user });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
