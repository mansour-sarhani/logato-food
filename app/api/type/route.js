import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Type from "@/models/Type";

export async function GET(req) {
	await dbConnect();

	const { searchParams } = new URL(req.url);
	const typeId = searchParams.get("typeId");

	function extractTypeDetails(type) {
		return {
			id: type._id,
			value: type.value,
			alias: type.alias,
			label: type.label,
			image: type.image,
			status: type.status,
			categories: type.categories,
			deleted: type.deleted,
			createdAt: type.createdAt,
			updatedAt: type.updated,
		};
	}

	try {
		if (typeId) {
			//GET TYPE BY ID => "/api/type?typeId=66b646f4b321cdbe232c51ff"
			const type = await Type.findById(typeId);

			if (!type) {
				return NextResponse.json(
					{
						success: false,
						error: "نوع نوع فروشگاه پیدا نشد.",
					},
					{ status: 404 }
				);
			}

			if (type.deleted) {
				return NextResponse.json(
					{ success: false, error: "نوع فروشگاه حذف شده است." },
					{ status: 404 }
				);
			}

			const typeDetails = extractTypeDetails(type);

			return NextResponse.json(
				{ success: true, data: typeDetails },
				{ status: 200 }
			);
		} else {
			//GET ALL TYPES => "/api/type"
			const types = await Type.find({});

			const filteredTypes = types
				.filter(
					(type) => type.deleted !== true && type.status === "active"
				)
				.map(extractTypeDetails);

			return NextResponse.json(
				{ success: true, data: filteredTypes },
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
