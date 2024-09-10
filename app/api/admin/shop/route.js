import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Shop from "@/models/Shop";
import User from "@/models/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "@/utils/authMiddleware";
import Counter from "@/models/Counter";

//ADMIN ADD NEW SHOP => "/api/admin/shop"
export async function POST(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const formData = await req.formData();

		const subCategories = JSON.parse(formData.getAll("subCategories"));
		const categories = JSON.parse(formData.getAll("categories"));

		const shopData = {
			name: formData.get("name"),
			owner: {
				value: null,
				ownerId: null,
				ownerName: null,
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
			createdByAdmin: true,
			latitude: formData.get("latitude"),
			longitude: formData.get("longitude"),
		};

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
				"public/images/storage/shops/",
				imageUniqueName
			);

			const buffer = Buffer.from(await logoFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			shopData.logo = {
				path: "/images/storage/shops/",
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
				"public/images/storage/shops/",
				coverUniqueName
			);

			const buffer = Buffer.from(await coverFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			shopData.cover = {
				path: "/images/storage/shops/",
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

	const authError = await authMiddleware(request);
	if (authError) {
		return authError;
	}

	const { searchParams } = new URL(request.url);
	const shopId = searchParams.get("shopId");
	const ownerId = searchParams.get("ownerId");
	const typeId = searchParams.get("typeId");
	const categoryId = searchParams.get("categoryId");
	const subCategoryId = searchParams.get("subCategoryId");
	const cityId = searchParams.get("cityId");
	const status = searchParams.get("status");
	const search = searchParams.get("search");

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
			//ADMIN GET SHOP BY ID => "/api/admin/shop?shopId=66b611a1e265481edc12b026"
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
			//ADMIN GET SHOPS BY OWNER ID => "/api/admin/shop?ownerId=66b5be627f158e50829334bb"
			const shops = await Shop.find({ "owner.ownerId": ownerId });

			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (typeId) {
			//ADMIN GET SHOPS BY SHOP TYPE ID => "/api/admin/shop?typeId=66b5be627f158e50829334bb"
			const shops = await Shop.find({ "type.typeId": typeId });

			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (categoryId) {
			//ADMIN GET SHOPS BY CATEGORY ID => "/api/admin/shop?categoryId=66b5be627f158e50829334bb"
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
			//ADMIN GET SHOPS BY SUB CATEGORY ID => "/api/admin/shop?subCategoryId=66b5be627f158e50829334bb"
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
			//ADMIN GET SHOPS BY CITY ID => "/api/admin/shop?cityId=66b5be627f158e50829334bb"
			const shops = await Shop.find({ "city.cityId": cityId });
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (status) {
			//ADMIN GET SHOPS BY STATUS => "/api/admin/shop?status=active"
			const shops = await Shop.find({ status: status });
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else if (search) {
			//ADMIN GET SHOPS BY SEARCH TERM => "/api/admin/shop?search=لوگا"
			if (!search) {
				return NextResponse.json(
					{
						success: false,
						error: "لطفا یک کلمه برای جستجو وارد کنید.",
					},
					{ status: 500 }
				);
			}

			const shops = await Shop.find({
				$or: [
					{ name: { $regex: search, $options: "i" } },
					{ description: { $regex: search, $options: "i" } },
				],
			});
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

			return NextResponse.json(
				{ success: true, data: filteredShops },
				{ status: 200 }
			);
		} else {
			//ADMIN GET ALL SHOPS => "/api/admin/shop"
			const shops = await Shop.find({});
			const filteredShops = shops
				.filter((shop) => shop.deleted === false)
				.map(extractShopDetails);

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

//ADMIN EDIT SHOP => "/api/admin/shop?shopId=66b611a1e265481edc12b026"
export async function PUT(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const shopId = searchParams.get("shopId");
		const formData = await req.formData();

		const subCategories = JSON.parse(formData.getAll("subCategories"));
		const categories = JSON.parse(formData.getAll("categories"));

		const shop = await Shop.findById(shopId);
		if (!shop) {
			return NextResponse.json(
				{ success: false, error: "فروشگاه پیدا نشد." },
				{ status: 404 }
			);
		}

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

		if (formData.get("ownerValue") !== null)
			shopData.owner.ownerValue = formData.get("ownerValue");
		if (formData.get("ownerId") !== null)
			shopData.owner.ownerId = formData.get("ownerId");
		if (formData.get("ownerName") !== null)
			shopData.owner.ownerName = formData.get("ownerName");

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
				"public/images/storage/shops/",
				imageUniqueName
			);

			const buffer = Buffer.from(await logoFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (shop.logo.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/images/storage/shops/",
					shop.logo.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			shopData.logo.img = imageUniqueName;
		} else {
			shopData.logo.img = shop.logo.img;
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
				"public/images/storage/shops/",
				coverUniqueName
			);

			const buffer = Buffer.from(await coverFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (shop.cover.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/images/storage/shops/",
					shop.cover.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			shopData.cover.img = coverUniqueName;
		} else {
			shopData.cover.img = shop.cover.img;
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

//ADMIN DELETE SHOP => "/api/admin/shop?shopId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const shopId = searchParams.get("shopId");

		const shop = await Shop.findById(shopId);

		if (!shop) {
			return NextResponse.json(
				{ success: false, message: "فروشگاه وجود ندارد." },
				{ status: 400 }
			);
		}

		shop.deleted = true;
		shop.status = "deleted";
		shop.markModified("deleted");
		shop.markModified("status");

		await shop.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
