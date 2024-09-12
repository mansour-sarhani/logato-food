import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "@/utils/authMiddleware";
import generateToken from "@/utils/jwt";
import { hashPassword } from "@/utils/hashPassword";
import Counter from "@/models/Counter";

export async function POST(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const formData = await req.formData();
		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");
		const password = formData.get("password");
		const email = formData.get("email");
		const phone = formData.get("phone");
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
			password: hashedPassword,
			email,
			phone,
			role,
		});

		const avatarFile = formData.get("avatar");

		if (
			avatarFile &&
			(avatarFile.type === "image/jpeg" ||
				avatarFile.type === "image/png" ||
				avatarFile.type === "image/webp" ||
				avatarFile.type === "image/svg+xml")
		) {
			const uniqueName = uuidv4() + path.extname(avatarFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/users/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/users",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await avatarFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			user.avatar = {
				img: uniqueName,
				url: `/assets/images/storage/users/${uniqueName}`,
			};
		}

		const token = generateToken(user);
		user.token = token;

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "userId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		user.value = counter.seq;

		await user.save();

		return NextResponse.json(
			{ success: true, message: "کاربر با موفقیت اضافه شد." },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");

	function extractUserDetails(user) {
		return {
			id: user._id,
			value: user.value,
			token: user.token,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
			shopId: user.shopId,
			shopStatus: user.shopStatus,
			status: user.status,
			avatar: user.avatar,
			bookmark: user.bookmark,
			addresses: user.addresses,
			createdAt: user.createdAt,
			updatedAt: user.updated,
		};
	}

	try {
		if (userId) {
			//ADMIN GET USER BY ID => "/api/admin/users?userId=66b5be627f158e50829334bb"
			const user = await User.findById(userId);

			if (!user) {
				return NextResponse.json(
					{ success: false, error: "کاربر پیدا نشد." },
					{ status: 404 }
				);
			}

			const userDetails = extractUserDetails(user);

			return NextResponse.json(
				{ success: true, data: userDetails },
				{ status: 200 }
			);
		} else {
			//ADMIN GET ALL USERS => "/api/admin/users"
			const users = await User.find({});

			const filteredUsers = users.map(extractUserDetails);

			return NextResponse.json(
				{ success: true, data: filteredUsers },
				{ status: 200 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

//Admin Update User => "/api/admin/users?userId=66b5be627f158e50829334bb"
export async function PUT(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		const formData = await req.formData();

		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");
		const email = formData.get("email");
		const phone = formData.get("phone");
		const role = formData.get("role");
		const status = formData.get("status");

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "این کاربر وجود ندارد." },
				{ status: 400 }
			);
		}

		if (firstName) user.firstName = firstName || user.firstName;
		if (lastName) user.lastName = lastName || user.lastName;
		if (email) user.email = email || user.email;
		if (phone) user.phone = phone || user.phone;
		if (role) user.role = role || user.role;
		if (status) user.status = status || user.status;

		user.markModified("firstName");
		user.markModified("lastName");
		user.markModified("email");
		user.markModified("phone");
		user.markModified("role");
		user.markModified("status");

		const avatarFile = formData.get("avatar");

		if (
			avatarFile &&
			(avatarFile.type === "image/jpeg" ||
				avatarFile.type === "image/png" ||
				avatarFile.type === "image/webp" ||
				avatarFile.type === "image/svg+xml")
		) {
			const uniqueName = uuidv4() + path.extname(avatarFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/users/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/users",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await avatarFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (user.avatar.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/assets/images/storage/users/",
					user.avatar.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			user.avatar.img = uniqueName;
			user.markModified("avatar");
		}

		await user.save();

		return NextResponse.json({ success: true, user });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
