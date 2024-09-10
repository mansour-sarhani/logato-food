import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Type from "@/models/Type";

export async function GET(req) {
	await dbConnect();

	const { searchParams } = new URL(req.url);
	const categoryId = searchParams.get("categoryId");
	const parentTypeId = searchParams.get("parentTypeId");
	const typeId = searchParams.get("typeId");
	const typeValue = searchParams.get("typeValue");

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
		if (categoryId && parentTypeId) {
			//GET CATEGORY BY ID => "/api/category?categoryId=66bf44d3d02d846c4368ced0&parentTypeId=66bf44d3d02d846c4368ced0"
			const type = await Type.findOne({ _id: parentTypeId });
			if (!type) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع مورد نظر یافت نشد.",
					},
					{ status: 404 }
				);
			}
			if (type.deleted) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع حذف شده است.",
					},
					{ status: 404 }
				);
			}

			const category = type.categories.find(
				(category) => category._id.toString() === categoryId
			);

			if (!category) {
				return NextResponse.json(
					{
						success: false,
						error: "دسته بندی پیدا نشد.",
					},
					{ status: 404 }
				);
			}

			if (category.deleted) {
				return NextResponse.json(
					{
						success: false,
						error: "دسته بندی حذف شده است.",
					},
					{ status: 404 }
				);
			}

			const categoryDetails = extractCategoryDetails(category);

			return NextResponse.json(
				{ success: true, data: categoryDetails },
				{ status: 200 }
			);
		} else if (typeId) {
			//GET CATEGORIES OF TYPE => "/api/category?typeId=66bf44d3d02d846c4368ced0"
			const type = await Type.findOne({ _id: typeId });
			if (!type) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع مورد نظر یافت نشد.",
					},
					{ status: 404 }
				);
			}
			if (type.deleted) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع حذف شده است.",
					},
					{ status: 404 }
				);
			}

			const categories = type.categories.filter(
				(category) => !category.deleted && category.status === "active"
			);

			const filteredCategories = categories.map((category) => {
				const filteredSubCategories = category.subCategories.filter(
					(subCategory) =>
						!subCategory.deleted && subCategory.status === "active"
				);
				category.subCategories = filteredSubCategories;
				return extractCategoryDetails(category);
			});
			return NextResponse.json(
				{ success: true, data: filteredCategories },
				{ status: 200 }
			);
		} else if (typeValue) {
			//GET CATEGORIES BY TYPE VALUE => "/api/category?typeValue=66bf44d3d02d846c4368ced0"
			const type = await Type.findOne({ value: typeValue });
			if (!type) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع مورد نظر یافت نشد.",
					},
					{ status: 404 }
				);
			}
			if (type.deleted) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع حذف شده است.",
					},
					{ status: 404 }
				);
			}

			const categories = type.categories.filter(
				(category) => !category.deleted && category.status === "active"
			);

			const filteredCategories = categories.map((category) => {
				const filteredSubCategories = category.subCategories.filter(
					(subCategory) =>
						!subCategory.deleted && subCategory.status === "active"
				);
				category.subCategories = filteredSubCategories;
				return extractCategoryDetails(category);
			});
			return NextResponse.json(
				{ success: true, data: filteredCategories },
				{ status: 200 }
			);
		} else {
			//GET ALL CATEGORIES => "/api/category"
			const types = await Type.find();
			const categories = types.reduce((acc, type) => {
				return acc.concat(type.categories);
			}, []);

			const existingCategories = categories.filter(
				(category) => !category.deleted && category.status === "active"
			);

			const filteredCategories = existingCategories.map((category) => {
				const filteredSubCategories = category.subCategories.filter(
					(subCategory) =>
						!subCategory.deleted && subCategory.status === "active"
				);
				category.subCategories = filteredSubCategories;
				return extractCategoryDetails(category);
			});

			return NextResponse.json(
				{ success: true, data: filteredCategories },
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
