import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "@/utils/authMiddleware";
import Counter from "@/models/Counter";
import Type from "@/models/Type";

//ADMIN ADD NEW SUB CATEGORY => "/api/admin/sub-category"
export async function POST(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const formData = await req.formData();

		const subCategoryData = {
			alias: formData.get("alias"),
			label: formData.get("label"),
			parentCategoryId: formData.get("parentCategoryId"),
			typeId: formData.get("typeId"),
		};

		const type = await Type.findById(subCategoryData.typeId);

		if (!type) {
			return NextResponse.json(
				{ success: false, message: "نوع وجود ندارد." },
				{ status: 400 }
			);
		}

		const category = type.categories.find(
			(category) =>
				category._id.toString() === subCategoryData.parentCategoryId
		);

		if (!category) {
			return NextResponse.json(
				{ success: false, message: "دسته بندی وجود ندارد." },
				{ status: 400 }
			);
		}

		if (
			category.subCategories.find(
				(subCategory) => subCategory.alias === subCategoryData.alias
			)
		) {
			return NextResponse.json(
				{ success: false, message: "زیر دسته با این نام وجود دارد." },
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
				"public/assets/images/storage/categories/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/categories",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			subCategoryData.image = {
				path: "/assets/images/storage/categories/",
				img: uniqueName,
			};
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "subCategoryId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);

		const newSubcategory = {
			value: counter.seq,
			alias: subCategoryData.alias,
			label: subCategoryData.label,
			image: subCategoryData.image,
			parentCategoryId: subCategoryData.parentCategoryId,
			parentCategoryLabel: category.label,
			typeId: subCategoryData.typeId,
			status: "active",
			deleted: false,
			createdAt: new Date(),
		};

		category.subCategories.push(newSubcategory);
		type.markModified("categories");

		await type.save();

		return NextResponse.json({
			success: true,
			subCategory: newSubcategory,
		});
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

	try {
		//ADMIN GET ALL SUB CATEGORIES => "/api/admin/sub-category"
		const types = await Type.find({});

		const categories = types.reduce((acc, type) => {
			return [
				...acc,
				...type.categories.filter(
					(category) => category.deleted === false
				),
			];
		}, []);

		const subCategories = categories
			.filter((category) => category.deleted === false)
			.reduce((acc, category) => {
				return [
					...acc,
					...category.subCategories
						.filter((subCategory) => subCategory.deleted === false)
						.map((subCategory) => {
							return {
								id: subCategory._id,
								value: subCategory.value,
								alias: subCategory.alias,
								label: subCategory.label,
								parentCategoryId: subCategory.parentCategoryId,
								parentCategoryLabel:
									subCategory.parentCategoryLabel,
								typeId: subCategory.typeId,
								status: subCategory.status,
								deleted: subCategory.deleted,
								image: subCategory.image,
								createdAt: subCategory.createdAt,
							};
						}),
				];
			}, []);

		return NextResponse.json(
			{ success: true, data: subCategories },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

//ADMIN UPDATE SUB CATEGORY => "/api/admin/sub-category?subCategoryId=66bf44d3d02d846c4368ced0&categoryId=66bf44d3d02d846c4368ced0&typeId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const { searchParams } = new URL(req.url);
		const subCategoryId = searchParams.get("subCategoryId");
		const categoryId = searchParams.get("categoryId");
		const typeId = searchParams.get("typeId");

		const formData = await req.formData();
		const alias = formData.get("alias");
		const label = formData.get("label");
		const status = formData.get("status");
		const newParentCategoryId = formData.get("newParentCategoryId");

		const type = await Type.findById(typeId);
		if (!type) {
			return NextResponse.json(
				{
					success: false,
					error: "نوع پیدا نشد.",
				},
				{ status: 404 }
			);
		}

		const category = type.categories.id(categoryId);
		if (!category) {
			return NextResponse.json(
				{
					success: false,
					error: "دسته پیدا نشد.",
				},
				{ status: 404 }
			);
		}

		const subCategory = category.subCategories.id(subCategoryId);
		if (!subCategory) {
			return NextResponse.json(
				{
					success: false,
					error: "زیر دسته پیدا نشد.",
				},
				{ status: 404 }
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
				"public/assets/images/storage/categories",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/categories",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (subCategory.image.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/assets/images/storage/categories/",
					subCategory.image.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			subCategory.image.img = uniqueName;
			type.markModified("categories");
		}

		if (alias) subCategory.alias = alias || subCategory.alias;
		if (label) subCategory.label = label || subCategory.label;
		if (status) subCategory.status = status || subCategory.status;

		type.markModified("categories");

		await type.save();

		if (
			newParentCategoryId &&
			newParentCategoryId !== subCategory.parentCategoryId.toString()
		) {
			const oldParentCategory = type.categories.find(
				(category) =>
					category._id.toString() ===
					subCategory.parentCategoryId.toString()
			);

			const newParentCategory = type.categories.find(
				(category) => category._id.toString() === newParentCategoryId
			);

			if (!oldParentCategory || !newParentCategory) {
				return NextResponse.json(
					{
						success: false,
						error: "دسته بندی پیدا نشد.",
					},
					{ status: 404 }
				);
			}

			const newSubCategory = oldParentCategory.subCategories.find(
				(subCategory) => subCategory._id.toString() === subCategoryId
			);

			oldParentCategory.subCategories.pull(subCategoryId);

			newSubCategory.parentCategoryId = newParentCategoryId;
			newSubCategory.parentCategoryLabel = newParentCategory.label;

			newParentCategory.subCategories.push(newSubCategory);
			type.markModified("categories");

			await type.save();
		}

		return NextResponse.json({ success: true, subCategory });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//ADMIN DELETE SUB CATEGORY => "/api/admin/sub-category?subCategoryId=66bf44d3d02d846c4368ced0&categoryId=66bf44d3d02d846c4368ced0&typeId=66bf44d3d02d846c4368ced0"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const subCategoryId = searchParams.get("subCategoryId");
		const categoryId = searchParams.get("categoryId");
		const typeId = searchParams.get("typeId");

		const type = await Type.findById(typeId);

		if (!type) {
			return NextResponse.json(
				{
					success: false,
					error: "نوع پیدا نشد.",
				},
				{ status: 404 }
			);
		}

		const category = type.categories.id(categoryId);
		if (!category) {
			return NextResponse.json(
				{
					success: false,
					error: "دسته پیدا نشد.",
				},
				{ status: 404 }
			);
		}

		const subCategory = category.subCategories.id(subCategoryId);
		if (!subCategory) {
			return NextResponse.json(
				{
					success: false,
					error: "زیر دسته پیدا نشد.",
				},
				{ status: 404 }
			);
		}

		subCategory.deleted = true;
		subCategory.status = "deleted";
		type.markModified("categories");

		await type.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
