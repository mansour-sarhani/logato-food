import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import City from "@/models/City";
import { authMiddleware } from "@/utils/authMiddleware";
import Counter from "@/models/Counter";

//ADMIN ADD NEW CITY => "/api/admin/city"
export async function POST(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const formData = await req.formData();

		const cityData = {
			alias: formData.get("alias"),
			label: formData.get("label"),
			state: formData.get("state"),
		};

		const cityExists = await City.findOne({ name: cityData.alias });
		if (cityExists) {
			return NextResponse.json(
				{ success: false, message: "شهری با این نام وجود دارد." },
				{ status: 400 }
			);
		}

		const counter = await Counter.findByIdAndUpdate(
			{ _id: "cityId" },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		cityData.value = counter.seq;

		const newCity = new City(cityData);
		await newCity.save();

		return NextResponse.json({
			success: true,
			city: newCity,
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
	const cityId = searchParams.get("cityId");

	function extractCityDetails(city) {
		return {
			id: city._id,
			value: city.value,
			alias: city.alias,
			label: city.label,
			state: city.state,
			status: city.status,
			deleted: city.deleted,
			createdAt: city.createdAt,
			updatedAt: city.updated,
		};
	}

	try {
		if (cityId) {
			//ADMIN GET CITY BY ID => "/api/admin/city?cityId=66b646f4b321cdbe232c51ff"
			const city = await City.findById(cityId);

			if (!city) {
				return NextResponse.json(
					{ success: false, error: "شهر پیدا نشد." },
					{ status: 404 }
				);
			}

			if (city.deleted) {
				return NextResponse.json(
					{ success: false, error: "شهر حذف شده است." },
					{ status: 404 }
				);
			}

			const cityDetails = extractCityDetails(city);

			return NextResponse.json(
				{ success: true, data: cityDetails },
				{ status: 200 }
			);
		} else {
			//ADMIN GET ALL CITIES => "/api/admin/city"
			const cities = await City.find({});

			const filteredCities = cities
				.filter((city) => city.deleted !== true)
				.map(extractCityDetails);

			return NextResponse.json(
				{ success: true, data: filteredCities },
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

//ADMIN UPDATE CITY => "/api/admin/city?cityId=66b646f4b321cdbe232c51ff"
export async function PUT(req) {
	await dbConnect();

	const authError = await authMiddleware(req);
	if (authError) {
		return authError;
	}

	try {
		const { searchParams } = new URL(req.url);
		const cityId = searchParams.get("cityId");

		const formData = await req.formData();
		const alias = formData.get("alias");
		const label = formData.get("label");
		const state = formData.get("state");
		const status = formData.get("status");

		const city = await City.findById(cityId);
		if (!city) {
			return NextResponse.json(
				{ success: false, message: "شهر وجود ندارد." },
				{ status: 400 }
			);
		}

		if (alias) city.alias = alias || city.alias;
		if (label) city.label = label || city.label;
		if (state) city.state = state || city.state;
		if (status) city.status = status || city.status;

		city.markModified("alias");
		city.markModified("label");
		city.markModified("state");
		city.markModified("status");

		await city.save();

		return NextResponse.json({ success: true, city });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}

//ADMIN DELETE CITY => "/api/admin/city?cityId=66b77916bbce8aa586a64767"
export async function DELETE(req) {
	await dbConnect();

	try {
		const { searchParams } = new URL(req.url);
		const cityId = searchParams.get("cityId");

		const city = await City.findById(cityId);

		if (!city) {
			return NextResponse.json(
				{ success: false, message: "شهر وجود ندارد." },
				{ status: 400 }
			);
		}

		city.deleted = true;
		city.status = "deleted";
		city.markModified("deleted");
		city.markModified("status");

		await city.save();

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
