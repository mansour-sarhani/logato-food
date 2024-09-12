import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

//USER ADD ADDRESS => "/api/user/address"
export async function POST(req) {
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

		const title = formData.get("title");
		const address = formData.get("address");
		const cityId = formData.get("cityId");
		const cityLabel = formData.get("cityLabel");
		const cityState = formData.get("cityState");
		const latitude = formData.get("latitude");
		const longitude = formData.get("longitude");
		let defaultAddress = formData.get("default");

		const user = await User.findOne({ token: token });
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "کاربر یافت نشد." },
				{ status: 404 }
			);
		}

		if (user.addresses.length === 0) {
			defaultAddress = true;
		}

		if (defaultAddress) {
			user.addresses.forEach((addr) => {
				addr.default = false;
			});
		}

		const newAddress = {
			title,
			address,
			cityId,
			cityLabel,
			cityState,
			latitude,
			longitude,
			default: defaultAddress,
		};

		user.addresses.push(newAddress);

		user.markModified("addresses");

		await user.save();

		return NextResponse.json({ success: true, data: user });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//USER UPDATE ADDRESS => "/api/user/address?addressId=66bdac7d19634057619f2379"
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

		const user = await User.findOne({ token: token });
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "کاربر یافت نشد." },
				{ status: 404 }
			);
		}

		const { searchParams } = new URL(req.url);
		const id = searchParams.get("addressId");

		const formData = await req.formData();
		const title = formData.get("title");
		const address = formData.get("address");
		const cityId = formData.get("cityId");
		const cityLabel = formData.get("cityLabel");
		const cityState = formData.get("cityState");
		const latitude = formData.get("latitude");
		const longitude = formData.get("longitude");
		const defaultAddress = formData.get("default");

		const addressIndex = user.addresses.findIndex(
			(address) => address.id.toString() === id
		);

		if (addressIndex === -1) {
			return NextResponse.json(
				{ success: false, message: "آدرس یافت نشد." },
				{ status: 404 }
			);
		}

		if (title)
			user.addresses[addressIndex].title =
				title || user.addresses[addressIndex].title;

		if (address)
			user.addresses[addressIndex].address =
				address || user.addresses[addressIndex].address;

		if (cityId)
			user.addresses[addressIndex].cityId =
				cityId || user.addresses[addressIndex].cityId;

		if (cityLabel)
			user.addresses[addressIndex].cityLabel =
				cityLabel || user.addresses[addressIndex].cityLabel;

		if (cityState)
			user.addresses[addressIndex].cityState =
				cityState || user.addresses[addressIndex].cityState;

		if (latitude)
			user.addresses[addressIndex].latitude =
				latitude || user.addresses[addressIndex].latitude;

		if (longitude)
			user.addresses[addressIndex].longitude =
				longitude || user.addresses[addressIndex].longitude;

		if (defaultAddress) {
			user.addresses.forEach((addr) => {
				addr.default = false;
				user.addresses[addressIndex].default = true;
			});
		}

		user.markModified("addresses");

		await user.save();

		return NextResponse.json({
			success: true,
			data: user,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

// USER DELETE ADDRESS => "/api/user/address?addressId=66bdaecd19634057619f238c"
export async function DELETE(req) {
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

		const { searchParams } = new URL(req.url);
		const id = searchParams.get("addressId");
		const addressIndex = user.addresses.findIndex(
			(addr) => addr._id.toString() === id
		);

		if (addressIndex === -1) {
			return NextResponse.json(
				{ success: false, message: "آدرس یافت نشد." },
				{ status: 404 }
			);
		}

		if (user.addresses[addressIndex].default) {
			return NextResponse.json(
				{ success: false, message: "آدرس پیش فرض قابل حذف نیست." },
				{ status: 400 }
			);
		}

		user.addresses.splice(addressIndex, 1);

		user.markModified("addresses");

		await user.save();

		return NextResponse.json({
			success: true,
			data: user,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
