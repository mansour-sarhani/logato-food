import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "@/utils/authMiddleware";
import Counter from "@/models/Counter";
import Type from "@/models/Type";

//ADMIN ADD NEW CATEGORY => "/api/admin/category"
export async function POST(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const formData = await req.formData();

		const categoryData = {
			alias: formData.get("alias"),
			label: formData.get("label"),
			parentTypeId: formData.get("parentTypeId"),
		};

		const type = await Type.findOne({ _id: categoryData.parentTypeId });
		if (!type) {
			return NextResponse.json(
				{
					success: false,
					message: "نوع مورد نظر یافت نشد.",
				},
				{ status: 404 }
			);
		}

		const categoryExists = type.categories.find(
			(category) => category.alias === categoryData.alias
		);

		if (categoryExists) {
			return NextResponse.json(
				{
					success: false,
					message: "دسته بندی با این نام وجود دارد.",
				},
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
				"public/images/storage/categories/",
				uniqueName
			);

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			categoryData.image = {
				path: "/images/storage/categories/",
				img: uniqueName,
			};
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "categoryId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		categoryData.value = counter.seq;
		categoryData.parentTypeLabel = type.label;

		type.categories.push(categoryData);
		await type.save();

		return NextResponse.json({
			success: true,
			category: categoryData,
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

	function extractCategoryDetails(category) {
		return {
			id: category._id,
			value: category.value,
			alias: category.alias,
			label: category.label,
			status: category.status,
			parentTypeId: category.parentTypeId,
			parentTypeLabel: category.parentTypeLabel,
			image: category.image,
			subCategories: category.subCategories,
			deleted: category.deleted,
			createdAt: category.createdAt,
			updatedAt: category.updated,
		};
	}

	try {
		//ADMIN GET ALL CATEGORIES => "/api/admin/category"
		const types = await Type.find();
		const categories = types.reduce((acc, type) => {
			return acc.concat(type.categories);
		}, []);

		const existingCategories = categories.filter(
			(category) => !category.deleted
		);

		const filteredCategories = existingCategories.map((category) => {
			const filteredSubCategories = category.subCategories.filter(
				(subCategory) => !subCategory.deleted
			);
			category.subCategories = filteredSubCategories;
			return extractCategoryDetails(category);
		});

		return NextResponse.json(
			{ success: true, data: filteredCategories },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

//ADMIN UPDATE CATEGORY => "/api/admin/category?categoryId=66bf44d3d02d846c4368ced0&parentTypeId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId");
		const parentTypeId = searchParams.get("parentTypeId");

		const type = await Type.findOne({ _id: parentTypeId });
		if (!type) {
			return NextResponse.json(
				{
					success: false,
					message: "نوع مورد نظر یافت نشد.",
				},
				{ status: 404 }
			);
		}

		const formData = await req.formData();
		const alias = formData.get("alias");
		const label = formData.get("label");
		const status = formData.get("status");
		const newParentTypeId = formData.get("newParentTypeId");

		const category = type.categories.find(
			(category) => category._id.toString() === categoryId
		);

		if (alias) category.alias = alias || category.alias;
		if (label) category.label = label || category.label;
		if (status) category.status = status || category.status;

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
				"public/images/storage/categories/",
				uniqueName
			);

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (category.image.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/images/storage/categories/",
					category.image.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			category.image.img = uniqueName;
		}

		if (newParentTypeId) {
			const newType = await Type.findOne({ _id: newParentTypeId });
			if (!newType) {
				return NextResponse.json(
					{
						success: false,
						message: "نوع مورد نظر یافت نشد.",
					},
					{ status: 404 }
				);
			}

			const newCategoryExists = newType.categories.find(
				(category) => category.alias === alias
			);

			if (newCategoryExists) {
				return NextResponse.json(
					{
						success: false,
						message: "دسته بندی با این نام وجود دارد.",
					},
					{ status: 400 }
				);
			}

			const categoryIndex = type.categories.findIndex(
				(category) => category._id.toString() === categoryId
			);
			if (categoryIndex !== -1) {
				type.categories.splice(categoryIndex, 1);
				await type.save();
			}
			category.parentTypeId = newType._id;
			category.parentTypeLabel = newType.label;

			newType.categories.push(category);
			newType.markModified("categories");
			await newType.save();
		}

		type.markModified("categories");
		await type.save();

		return NextResponse.json({ success: true, category });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//ADMIN DELETE CATEGORY => "/api/admin/category?categoryId=66b77916bbce8aa586a64767&parentTypeId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId");
		const parentTypeId = searchParams.get("parentTypeId");

		const type = await Type.findOne({ _id: parentTypeId });
		if (!type) {
			return NextResponse.json(
				{ success: false, message: "نوع مورد نظر یافت نشد." },
				{ status: 404 }
			);
		}

		const category = type.categories.find(
			(category) => category._id.toString() === categoryId
		);

		if (!category) {
			return NextResponse.json(
				{ success: false, message: "دسته بندی وجود ندارد." },
				{ status: 400 }
			);
		}

		category.deleted = true;
		category.status = "deleted";
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
