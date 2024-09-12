import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Shop from "@/models/Shop";
import User from "@/models/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Counter from "@/models/Counter";

//ADD NEW SHOP => "/api/shop"
export async function POST(req) {
	await dbConnect();

	try {
		const formData = await req.formData();

		const subCategories = JSON.parse(formData.getAll("subCategories"));
		const categories = JSON.parse(formData.getAll("categories"));

		const shopData = {
			name: formData.get("name"),
			owner: {
				ownerValue: formData.get("ownerValue"),
				ownerId: formData.get("ownerId"),
				ownerName: formData.get("ownerName"),
			},
			type: {
				value: formData.get("typeValue"),
				typeId: formData.get("typeId"),
				typeLabel: formData.get("typeLabel"),
			},
			city: {
				value: formData.get("cityValue"),
				cityId: formData.get("cityId"),
				cityLabel: formData.get("cityLabel"),
				cityState: formData.get("cityState"),
			},
			categories: categories,
			subCategories: subCategories,
			description: formData.get("description"),
			address: formData.get("address"),
			phone: formData.get("phone"),
			email: formData.get("email"),
			openHour: formData.get("openHour"),
			closeHour: formData.get("closeHour"),
			hasDelivery: formData.get("hasDelivery") === "true",
			priceClass: formData.get("priceClass"),
			createdByAdmin: false,
			latitude: formData.get("latitude"),
			longitude: formData.get("longitude"),
		};

		const user = await User.findById(shopData.owner.ownerId);
		if (!user) {
			return NextResponse.json(
				{ success: false, error: "کاربر یافت نشد." },
				{ status: 404 }
			);
		}

		const userShop = user.shopId;
		if (userShop) {
			return NextResponse.json(
				{ success: false, error: "کاربر دارای فروشگاه است." },
				{ status: 404 }
			);
		}

		const logoFile = formData.get("logo");

		if (
			logoFile &&
			(logoFile.type === "image/jpeg" ||
				logoFile.type === "image/png" ||
				logoFile.type === "image/webp" ||
				logoFile.type === "image/svg+xml")
		) {
			const imageUniqueName = uuidv4() + path.extname(logoFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/shops/",
				imageUniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/shops",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await logoFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			shopData.logo = {
				path: "/assets/images/storage/shops/",
				img: imageUniqueName,
			};
		}

		const coverFile = formData.get("cover");

		if (
			coverFile &&
			(coverFile.type === "image/jpeg" ||
				coverFile.type === "image/png" ||
				coverFile.type === "image/webp" ||
				coverFile.type === "image/svg+xml")
		) {
			const coverUniqueName = uuidv4() + path.extname(coverFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/shops/",
				coverUniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/shops",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await coverFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			shopData.cover = {
				path: "/assets/images/storage/shops/",
				img: coverUniqueName,
			};
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "shopId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		shopData.value = counter.seq;

		const newShop = new Shop(shopData);
		await newShop.save();

		user.shopId = newShop._id;
		user.shopStatus = newShop.status;
		await user.save();

		return NextResponse.json({ success: true, shop: newShop });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	await dbConnect();

	const { searchParams } = new URL(request.url);
	const shopId = searchParams.get("shopId");
	const ownerId = searchParams.get("ownerId");
	const typeId = searchParams.get("typeId");
	const categoryId = searchParams.get("categoryId");
	const subCategoryId = searchParams.get("subCategoryId");
	const cityId = searchParams.get("cityId");

	function extractShopDetails(shop) {
		return {
			id: shop._id,
			value: shop.value,
			name: shop.name,
			owner: shop.owner,
			type: shop.type,
			city: shop.city,
			categories: shop.categories,
			subCategories: shop.subCategories,
			description: shop.description,
			address: shop.address,
			phone: shop.phone,
			email: shop.email,
			openHour: shop.openHour,
			closeHour: shop.closeHour,
			hasDelivery: shop.hasDelivery,
			priceClass: shop.priceClass,
			products: shop.products,
			ratingsCount: shop.ratingsCount,
			totalRatings: shop.totalRatings,
			averageRating: shop.averageRating,
			latitude: shop.latitude,
			longitude: shop.longitude,
			status: shop.status,
			logo: shop.logo,
			cover: shop.cover,
			deleted: shop.deleted,
			createdAt: shop.createdAt,
			updatedAt: shop.updatedAt,
		};
	}

	try {
		if (shopId) {
			//GET SHOP BY ID => "/api/shop?shopId=66b611a1e265481edc12b026"
			const shop = await Shop.findById(shopId);

			if (!shop) {
				return NextResponse.json(
					{ success: false, error: "فروشگاه پیدا نشد." },
					{ status: 404 }
				);
			}

			if (shop.deleted) {
				return NextResponse.json(
					{ success: false, error: "فروشگاه حذف شده است." },
					{ status: 404 }
				);
			}

			const shopDetails = extractShopDetails(shop);

			return NextResponse.json(
				{ success: true, data: shopDetails },
				{ status: 200 }
			);
		} else if (ownerId) {
			//GET SHOP BY OWNER ID => "/api/shop?ownerId=66b5be627f158e50829334bb"
			const shops = await Shop.find({ "owner.ownerId": ownerId });

			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (typeId) {
			//GET SHOPS BY SHOP TYPE ID => "/api/shop?typeId=66b5be627f158e50829334bb"
			const shops = await Shop.find({ "type.typeId": typeId });

			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (categoryId) {
			//GET SHOPS BY CATEGORY ID => "/api/shop?categoryId=66b5be627f158e50829334bb"
			const shops = await Shop.find({
				"categories.categoryId": categoryId,
			});
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (subCategoryId) {
			//GET SHOPS BY SUB CATEGORY ID => "/api/shop?subCategoryId=66b5be627f158e50829334bb"
			const shops = await Shop.find({
				"subCategories.subCategoryId": subCategoryId,
			});
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (cityId) {
			//GET SHOPS BY CITY ID => "/api/shop?cityId=66b5be627f158e50829334bb"
			const shops = await Shop.find({ "city.cityId": cityId });
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else {
			//GET ALL SHOPS => "/api/shop"
			const shops = await Shop.find({});

			const activeShops = shops.filter(
				(shop) => shop.status === "active" && shop.deleted === false
			);

			const filteredShops = activeShops.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
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

//EDIT SHOP => "/api/shop?shopId=66b611a1e265481edc12b026"
export async function PUT(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const shopId = searchParams.get("shopId");

		const shop = await Shop.findById(shopId);

		if (!shop) {
			return NextResponse.json(
				{ success: false, error: "فروشگاه یافت نشد." },
				{ status: 404 }
			);
		}

		const formData = await req.formData();

		const subCategories = JSON.parse(formData.getAll("subCategories"));
		const categories = JSON.parse(formData.getAll("categories"));

		const shopData = {
			logo: { img: "", path: "/images/storage/shops/" },
			cover: { img: "", path: "/images/storage/shops/" },
		};

		if (formData.get("name") !== null) shopData.name = formData.get("name");

		if (formData.get("cityValue") !== null)
			shopData.city.cityValue = formData.get("cityValue");
		if (formData.get("cityId") !== null)
			shopData.city.cityId = formData.get("cityId");
		if (formData.get("cityLabel") !== null)
			shopData.city.cityLabel = formData.get("cityLabel");
		if (formData.get("cityState") !== null)
			shopData.city.cityState = formData.get("cityState");

		if (formData.get("typeValue") !== null)
			shopData.type.typeValue = formData.get("typeValue");
		if (formData.get("typeId") !== null)
			shopData.type.typeId = formData.get("typeId");
		if (formData.get("typeLabel") !== null)
			shopData.type.typeLabel = formData.get("typeLabel");

		if (formData.get("categories")) shopData.categories = categories;
		if (formData.get("subCategories"))
			shopData.subCategories = subCategories;
		if (formData.get("description") !== null)
			shopData.description = formData.get("description");
		if (formData.get("address") !== null)
			shopData.address = formData.get("address");
		if (formData.get("phone") !== null)
			shopData.phone = formData.get("phone");
		if (formData.get("email") !== null)
			shopData.email = formData.get("email");
		if (formData.get("priceClass") !== null)
			shopData.priceClass = formData.get("priceClass");
		if (formData.get("openHour") !== null)
			shopData.openHour = formData.get("openHour");
		if (formData.get("closeHour") !== null)
			shopData.closeHour = formData.get("closeHour");
		if (formData.get("hasDelivery") !== null)
			shopData.hasDelivery = formData.get("hasDelivery") === "true";
		if (formData.get("status") !== null) {
			shopData.status = formData.get("status");

			if (formData.get("ownerId") !== null) {
				const owner = await User.findById(formData.get("ownerId"));
				owner.shopStatus = formData.get("status");
				owner.markModified("shopStatus");
				await owner.save();
			}
		}
		if (formData.get("latitude") !== null)
			shopData.latitude = parseFloat(formData.get("latitude"));
		if (formData.get("longitude") !== null)
			shopData.longitude = parseFloat(formData.get("longitude"));

		const logoFile = formData.get("logo");

		if (
			logoFile &&
			(logoFile.type === "image/jpeg" ||
				logoFile.type === "image/png" ||
				logoFile.type === "image/webp" ||
				logoFile.type === "image/svg+xml")
		) {
			const imageUniqueName = uuidv4() + path.extname(logoFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/shops/",
				imageUniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/shops",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await logoFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (shop.logo.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/assets/images/storage/shops/",
					shop.logo.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			shopData.logo.img = imageUniqueName;
		}

		const coverFile = formData.get("cover");

		if (
			coverFile &&
			(coverFile.type === "image/jpeg" ||
				coverFile.type === "image/png" ||
				coverFile.type === "image/webp" ||
				coverFile.type === "image/svg+xml")
		) {
			const coverUniqueName = uuidv4() + path.extname(coverFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/shops/",
				coverUniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/shops",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await coverFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (shop.cover.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/assets/images/storage/shops/",
					shop.cover.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			shopData.cover.img = coverUniqueName;
		}

		const updatedShop = await Shop.findByIdAndUpdate(shopId, shopData, {
			new: true,
		});

		return NextResponse.json(
			{ success: true, data: updatedShop },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
