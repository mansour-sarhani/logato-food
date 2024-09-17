import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import Shop from "@/models/Shop";
import Product from "@/models/Product";

export async function GET(req) {
	await dbConnect();

	const { searchParams } = new URL(req.url);
	const type = searchParams.get("type");

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

	try {
		//GET USER BOOKMARKED SHOPS => "/api/bookmark?type=shops"
		if (type === "shops") {
			const bookmarkedShops = userData.bookmark.shops;
			const shops = [];
			for (let i = 0; i < bookmarkedShops.length; i++) {
				const shop = await Shop.findById(bookmarkedShops[i]);
				shops.push(shop);
			}

			return NextResponse.json({
				success: true,
				data: shops,
			});
		} else if (type === "products") {
			//GET USER BOOKMARKED PRODUCTS => "/api/bookmark?type=products"
			const bookmarkedProducts = userData.bookmark.products;
			const products = [];
			for (let i = 0; i < bookmarkedProducts.length; i++) {
				const product = await Product.findById(bookmarkedProducts[i]);
				products.push(product);
			}

			return NextResponse.json({
				success: true,
				data: products,
			});
		} else {
			return NextResponse.json(
				{ success: false, message: "نوع نامعتبر است." },
				{ status: 400 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
