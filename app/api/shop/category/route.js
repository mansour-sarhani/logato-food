import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Shop from "@/models/Shop";
import mongoose from "mongoose";

//ADD NEW CATEGORY TO SHOP MENU => "/api/shop/category"
export async function POST(req) {
	await dbConnect();

	try {
		const formData = await req.formData();

		const name = formData.get("name");
		const shopId = formData.get("shopId");

		const shop = await Shop.findById(shopId);

		if (!shop) {
			return NextResponse.json(
				{ success: false, message: "فروشگاه پیدا نشد." },
				{ status: 404 }
			);
		}

		const existingCategory = shop.products.find(
			(category) => category.name === name
		);
		if (existingCategory) {
			return NextResponse.json(
				{ success: false, message: "دسته بندی با این نام وجود دارد." },
				{ status: 400 }
			);
		}

		const categoryData = {
			_id: new mongoose.Types.ObjectId(),
			name: name,
			items: [],
		};

		shop.products.push(categoryData);

		await shop.save();

		return NextResponse.json({
			success: true,
			menuCategory: categoryData,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//UPDATE CATEGORY OF SHOP => "/api/shop/category?shopId=66b646f4b321cdbe232c51ff&categoryId=66b646f4b321cdbe232c51ff"
export async function PUT(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const shopId = searchParams.get("shopId");
		const categoryId = searchParams.get("categoryId");

		const formData = await req.formData();
		const name = formData.get("name");

		const shop = await Shop.findById(shopId);
		if (!shop) {
			return NextResponse.json(
				{ success: false, message: "فروشگاه وجود ندارد." },
				{ status: 400 }
			);
		}

		const category = shop.products.find(
			(category) => category._id.toString() === categoryId
		);

		if (!category) {
			return NextResponse.json(
				{ success: false, message: "دسته بندی وجود ندارد." },
				{ status: 400 }
			);
		}

		if (name) category.name = name || category.name;

		shop.markModified("products");

		await shop.save();

		return NextResponse.json({ success: true, category });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//DELETE CATEGORY OF SHOP => "/api/shop/category?shopId=66b646f4b321cdbe232c51ff&categoryId=66b646f4b321cdbe232c51ff"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const shopId = searchParams.get("shopId");
		const categoryId = searchParams.get("categoryId");

		const shop = await Shop.findById(shopId);
		if (!shop) {
			return NextResponse.json(
				{ success: false, message: "فروشگاه وجود ندارد." },
				{ status: 400 }
			);
		}

		const category = shop.products.find(
			(category) => category._id.toString() === categoryId
		);

		if (!category) {
			return NextResponse.json(
				{ success: false, message: "دسته بندی وجود ندارد." },
				{ status: 400 }
			);
		}

		const index = shop.products.findIndex(
			(category) => category._id.toString() === categoryId
		);

		shop.products.splice(index, 1);
		shop.markModified("products");

		await shop.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
