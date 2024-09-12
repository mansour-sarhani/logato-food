import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "@/utils/authMiddleware";
import Counter from "@/models/Counter";
import Type from "@/models/Type";

//ADMIN ADD NEW TYPE => "/api/admin/type"
export async function POST(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const formData = await req.formData();

		const typeData = {
			alias: formData.get("alias"),
			label: formData.get("label"),
		};

		const typeExists = await Type.findOne({
			alias: typeData.alias,
			deleted: false,
		});

		if (typeExists) {
			return NextResponse.json(
				{
					success: false,
					message: "نوع فروشگاه با این نام وجود دارد.",
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
				"public/assets/images/storage/types/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/types",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			typeData.image = {
				path: "/assets/images/storage/types/",
				img: uniqueName,
			};
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "typeId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		typeData.value = counter.seq;

		const newTypeData = new Type(typeData);
		await newTypeData.save();

		return NextResponse.json({
			success: true,
			type: newTypeData,
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

	const { searchParams } = new URL(req.url);
	const typeId = searchParams.get("typeId");

	function extractTypeDetails(type) {
		return {
			id: type._id,
			value: type.value,
			alias: type.alias,
			label: type.label,
			status: type.status,
			image: type.image,
			categories: type.categories,
			deleted: type.deleted,
			createdAt: type.createdAt,
			updatedAt: type.updated,
		};
	}

	try {
		if (typeId) {
			//ADMIN GET TYPE BY ID => "/api/admin/type?typeId=66b646f4b321cdbe232c51ff"
			const type = await type.findById(typeId);

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
			//ADMIN GET ALL TYPES => "/api/admin/type"
			const types = await Type.find({});

			const filteredTypes = types
				.filter((type) => type.deleted !== true)
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

//ADMIN UPDATE TYPE => "/api/admin/type?typeId=66b646f4b321cdbe232c51ff"
export async function PUT(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const { searchParams } = new URL(req.url);
		const typeId = searchParams.get("typeId");

		const formData = await req.formData();
		const alias = formData.get("alias");
		const label = formData.get("label");
		const status = formData.get("status");

		const type = await Type.findById(typeId);
		if (!type) {
			return NextResponse.json(
				{
					success: false,
					message: "این نوع نوع فروشگاه وجود ندارد.",
				},
				{ status: 400 }
			);
		}

		type.alias = alias || type.alias;
		type.label = label || type.label;
		type.status = status || type.status;

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
				"public/assets/images/storage/types/",
				uniqueName
			);

			// Ensure the directories exist
			const directories = [
				"public",
				"public/assets",
				"public/assets/images",
				"public/assets/images/storage",
				"public/assets/images/storage/types",
			];

			directories.forEach((dir) => {
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
			});

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			fs.writeFileSync(savePath, buffer);

			// Delete the old image file if it exists
			if (type.image.img) {
				const oldImagePath = path.join(
					process.cwd(),
					"public/assets/images/storage/types/",
					type.image.img
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			type.image.img = uniqueName;
			type.image.path = "/assets/images/storage/types/";
			type.markModified("image");
		}

		type.markModified("alias");
		type.markModified("label");
		type.markModified("status");

		await type.save();

		return NextResponse.json({ success: true, type });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//ADMIN DELETE TYPE => "/api/admin/type?typeId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const typeId = searchParams.get("typeId");

		const type = await Type.findById(typeId);

		if (!type) {
			return NextResponse.json(
				{ success: false, message: "نوع فروشگاه وجود ندارد." },
				{ status: 400 }
			);
		}

		type.deleted = true;
		type.status = "deleted";
		type.markModified("deleted");
		type.markModified("status");

		await type.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
