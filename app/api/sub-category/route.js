import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Type from "@/models/Type";

export async function GET(req) {
	await dbConnect();

	const { searchParams } = new URL(req.url);
	const subCategoryId = searchParams.get("subCategoryId");
	const parentCategoryId = searchParams.get("parentCategoryId");
	const categoryId = searchParams.get("categoryId");
	const typeId = searchParams.get("typeId");

	function extractSubCategoryDetails(subCategory) {
		return {
			id: subCategory._id,
			value: subCategory.value,
			alias: subCategory.alias,
			label: subCategory.label,
			parentCategoryId: subCategory.parentCategoryId,
			parentCategoryLabel: subCategory.parentCategoryLabel,
			typeId: subCategory.typeId,
			status: subCategory.status,
			deleted: subCategory.deleted,
			image: subCategory.image,
			createdAt: subCategory.createdAt,
		};
	}

	try {
		if (subCategoryId && parentCategoryId && typeId) {
			//GET SUB CATEGORIES OF CATEGORY => "/api/sub-category?subCategoryId=${subCategoryId}&parentCategoryId=${parentCategoryId}&typeId=${typeId}"
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

			//get all the sub categories of the category with the given parentCategoryId
			const subCategories = category.subCategories
				.filter(
					(subCategory) =>
						subCategory.deleted === false &&
						subCategory.parentCategoryId === parentCategoryId
				)
				.map(extractSubCategoryDetails);

			return NextResponse.json(
				{ success: true, data: subCategories },
				{ status: 200 }
			);
		} else if (subCategoryId && categoryId && typeId) {
			//GET SUB CATEGORY BY ID => "/api/sub-category?subCategoryId=${subCategoryId}&categoryId=${categoryId}&typeId=${typeId}"
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

			return NextResponse.json(
				{ success: true, data: subCategory },
				{ status: 200 }
			);
		} else {
			//GET ALL SUB CATEGORIES => "/api/sub-category"
			const types = await Type.find({});

			filteredTypes = types.filter(
				(type) => type.deleted === false && type.status === "active"
			);

			const categories = filteredTypes.reduce((acc, type) => {
				return [
					...acc,
					...type.categories.filter(
						(category) =>
							category.deleted === false &&
							category.status === "active"
					),
				];
			}, []);

			const subCategories = categories
				.filter(
					(category) =>
						category.deleted === false &&
						category.status === "active"
				)
				.reduce((acc, category) => {
					return [
						...acc,
						...category.subCategories
							.filter(
								(subCategory) =>
									subCategory.deleted === false &&
									subCategory.status === "active"
							)
							.map(extractSubCategoryDetails),
					];
				}, []);

			return NextResponse.json(
				{ success: true, data: subCategories },
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
