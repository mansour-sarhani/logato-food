import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import City from "@/models/City";

export async function GET(request) {
	await dbConnect();

	const { searchParams } = new URL(request.url);
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
			//GET CITY BY ID => "/api/city?cityId=66b646f4b321cdbe232c51ff"
			const city = await City.findById(cityId);

			if (!city) {
				return NextResponse.json(
					{ success: false, error: "شهر پیدا نشد." },
					{ status: 404 }
				);
			}

			const cityDetails = extractCityDetails(city);

			return NextResponse.json(
				{ success: true, data: cityDetails },
				{ status: 200 }
			);
		} else {
			//GET ALL CITIES => "/api/city"
			const cities = await City.find({});

			const activeCities = cities.filter(
				(city) => city.status === "active" && city.deleted !== true
			);
			const filteredCities = activeCities.map(extractCityDetails);

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
