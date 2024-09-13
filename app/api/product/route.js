import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Shop from "@/models/Shop";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Counter from "@/models/Counter";
import Product from "@/models/Product";

//ADD NEW PRODUCT => "/api/product"
export async function POST(req) {
	await dbConnect();

	try {
		const formData = await req.formData();

		const productData = {
			name: formData.get("name"),
			price: formData.get("price"),
			finalPrice: null,
			discount: formData.get("discount"),
			discountType: formData.get("discountType"),
			categoryId: formData.get("categoryId"),
			categoryName: formData.get("categoryName"),
			shopId: formData.get("shopId"),
			description: formData.get("description"),
			quantity: formData.get("quantity"),
			weight: formData.get("weight"),
			weightUnit: formData.get("weightUnit"),
			size: formData.get("size"),
			sizeUnit: formData.get("sizeUnit"),
		};

		if (productData.discount !== "") {
			if (productData.discountType === "percent") {
				productData.finalPrice =
					productData.price -
					(productData.price * productData.discount) / 100;
			} else if (productData.discountType === "amount") {
				productData.finalPrice =
					productData.price - productData.discount;
			}
		} else {
			productData.finalPrice = productData.price;
		}

		const imageFile = formData.get("image");

		if (
			imageFile &&
			(imageFile.type === "image/jpeg" ||
				imageFile.type === "image/png" ||
				imageFile.type === "image/webp" ||
				imageFile.type === "image/svg+xml")
		) {
			const uniqueName = uuidv4() + path.extname(imageFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/products/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/products",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			productData.image = {
				path: "/assets/images/storage/products/",
				img: uniqueName,
			};
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "productId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		productData.value = counter.seq;

		const newProduct = new Product(productData);
		await newProduct.save();

		const shop = await Shop.findById(productData.shopId);

		const existingMenuCategory = shop.products.find(
			(category) => category._id.toString() === productData.categoryId
		);

		existingMenuCategory.items.push(newProduct);

		shop.markModified("products");
		await shop.save();

		return NextResponse.json({
			success: true,
			product: newProduct,
		});
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
	const productId = searchParams.get("productId");
	const shopId = searchParams.get("shopId");

	function extractProductDetails(product) {
		return {
			id: product._id,
			value: product.value,
			shopId: product.shopId,
			name: product.name,
			price: product.price,
			finalPrice: product.finalPrice,
			discount: product.discount,
			discountType: product.discountType,
			categoryId: product.categoryId,
			categoryName: product.categoryName,
			description: product.description,
			quantity: product.quantity,
			weight: product.weight,
			weightUnit: product.weightUnit,
			size: product.size,
			sizeUnit: product.sizeUnit,
			ratingsCount: product.ratingsCount,
			totalRating: product.totalRating,
			averageRating: product.averageRating,
			image: product.image,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		};
	}

	try {
		if (productId) {
			//GET PRODUCT BY ID => "/api/product?productId=66b77916bbce8aa586a64767"
			const product = await Product.findById(productId);

			if (!product) {
				return NextResponse.json(
					{ success: false, error: "آیتم مورد نظر پیدا نشد." },
					{ status: 404 }
				);
			}

			const productDetails = extractProductDetails(product);

			return NextResponse.json(
				{ success: true, data: productDetails },
				{ status: 200 }
			);
		} else if (shopId) {
			//GET PRODUCTS BY SHOP ID => "/api/product?shopId=66b646f4b321cdbe232c51ff"
			const products = await Product.find({
				shopId: shopId,
			});

			if (!products) {
				return NextResponse.json(
					{ success: false, error: "آیتم مورد نظر پیدا نشد." },
					{ status: 404 }
				);
			}

			const filteredProducts = products.map(extractProductDetails);

			return NextResponse.json(
				{ success: true, data: filteredProducts },
				{ status: 200 }
			);
		} else {
			//GET ALL PRODUCTS => "/api/product"
			const products = await product.find({});

			const filteredProducts = products.map(extractProductDetails);

			return NextResponse.json(
				{ success: true, data: filteredProducts },
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

//UPDATE PRODUCT => "/api/product?productId=66b77916bbce8aa586a64767"
export async function PUT(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const productId = searchParams.get("productId");

		const formData = await req.formData();

		const name = formData.get("name");
		const price = formData.get("price");
		const discount = formData.get("discount");
		const discountType = formData.get("discountType");
		const description = formData.get("description");
		const quantity = formData.get("quantity");
		const weight = formData.get("weight");
		const weightUnit = formData.get("weightUnit");
		const size = formData.get("size");
		const sizeUnit = formData.get("sizeUnit");

		const product = await Product.findById(productId);

		if (!product) {
			return NextResponse.json(
				{ success: false, message: "این آیتم وجود ندارد." },
				{ status: 400 }
			);
		}

		const imageFile = formData.get("image");

		if (
			imageFile &&
			(imageFile.type === "image/jpeg" ||
				imageFile.type === "image/png" ||
				imageFile.type === "image/webp" ||
				imageFile.type === "image/svg+xml")
		) {
			const uniqueName = uuidv4() + path.extname(imageFile.name);
			const savePath = path.join(
				process.cwd(),
				"public/assets/images/storage/products/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/products",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (product.image.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/assets/images/storage/products/",
					product.image.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			product.image.img = uniqueName;
			product.markModified("image");
		}

		if (name) product.name = name || product.name;
		if (price) product.price = price || product.price;
		if (discount) {
			product.discount = discount || product.discount;
			if (product.discountType === "percent") {
				product.finalPrice =
					product.price - (product.price * product.discount) / 100;
			} else if (product.discountType === "amount") {
				product.finalPrice = product.price - product.discount;
			}
		}
		if (discountType) {
			product.discountType = discountType || product.discountType;
			if (product.discountType === "percent") {
				product.finalPrice =
					product.price - (product.price * product.discount) / 100;
			} else if (product.discountType === "amount") {
				product.finalPrice = product.price - product.discount;
			}
		}
		if (description)
			product.description = description || product.description;
		if (quantity) product.quantity = quantity || product.quantity;
		if (weight) product.weight = weight || product.weight;
		if (weightUnit) product.weightUnit = weightUnit || product.weightUnit;
		if (size) product.size = size || product.size;
		if (sizeUnit) product.sizeUnit = sizeUnit || product.sizeUnit;

		const shop = await Shop.findById(product.shopId);

		const category = shop.products.find(
			(category) => category._id.toString() === product.categoryId
		);

		const itemIndex = category.items.findIndex(
			(item) => item._id.toString() === productId
		);
		category.items[itemIndex] = product;

		shop.markModified("products");
		await shop.save();

		[
			"name",
			"price",
			"discount",
			"discountType",
			"description",
			"quantity",
			"weight",
			"weightUnit",
			"size",
			"sizeUnit",
		].forEach((field) => product.markModified(field));

		await product.save();

		return NextResponse.json({ success: true, product });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//DELETE PRODUCT => "/api/product?productId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const productId = searchParams.get("productId");

		const product = await Product.findById(productId);

		if (!product) {
			return NextResponse.json(
				{ success: false, message: "این آیتم وجود ندارد." },
				{ status: 400 }
			);
		}

		const shop = await Shop.findById(product.shopId);

		const category = shop.products.find(
			(category) => category._id.toString() === product.categoryId
		);

		const itemIndex = category.items.findIndex(
			(item) => item._id.toString() === productId
		);
		category.items.splice(itemIndex, 1);

		shop.markModified("products");
		await shop.save();

		await product.findByIdAndDelete(productId);

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
