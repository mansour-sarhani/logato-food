import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

//GET CURRENT USER BY TOKEN => "/api/user"
export async function GET() {
	await dbConnect();

	try {
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

		const userData = {
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

		return NextResponse.json({ success: true, data: userData });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

async function handleBookmark(bookmarkType, bookmarkId, action) {
	try {
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

		if (action === "bookmark") {
			if (!user.bookmark[bookmarkType].includes(bookmarkId)) {
				user.bookmark[bookmarkType].push(bookmarkId);
			}
		} else if (action === "unbookmark") {
			user.bookmark[bookmarkType] = user.bookmark[bookmarkType].filter(
				(id) => id.toString() !== bookmarkId
			);
		}

		user.markModified("bookmark");
		await user.save();

		return NextResponse.json({
			success: true,
			data: user,
			message:
				action === "bookmark"
					? "با موفقیت ذخیره شد."
					: "با موفقیت حذف شد.",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	await dbConnect();

	const { searchParams } = new URL(request.url);
	const bookmarkShop = searchParams.get("bookmarkShop");
	const bookmarkProduct = searchParams.get("bookmarkProduct");
	const action = searchParams.get("action") || "bookmark";

	if (bookmarkShop) {
		//USER BOOKMARK SHOP => "/api/user?bookmarkShop=66ba746d6cb23c7210a6588b&action=bookmark"
		//USER UN-BOOKMARK SHOP => "/api/user?bookmarkShop=66ba746d6cb23c7210a6588b&action=unbookmark"
		return handleBookmark("shops", bookmarkShop, action);
	} else if (bookmarkProduct) {
		//USER BOOKMARK MENU ITEM => "/api/user?bookmarkProduct=66ba80ec572ef78539544d46&action=bookmark"
		//USER UN-BOOKMARK MENU ITEM => "/api/user?bookmarkProduct=66ba80ec572ef78539544d46&action=unbookmark"
		return handleBookmark("products", bookmarkProduct, action);
	}
}

//User Update Profile => "/api/user"
export async function PUT(req) {
	await dbConnect();

	try {
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

		const formData = await req.formData();
		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");
		const email = formData.get("email");
		const phone = formData.get("phone");
		const avatarFile = formData.get("avatar");

		const user = await User.findOne({ token: token });
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "کاربر یافت نشد." },
				{ status: 404 }
			);
		}

		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.email = email || user.email;
		user.phone = phone || user.phone;

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

		user.markModified("firstName");
		user.markModified("lastName");
		user.markModified("email");
		user.markModified("phone");

		await user.save();

		return NextResponse.json({ success: true, data: user });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
