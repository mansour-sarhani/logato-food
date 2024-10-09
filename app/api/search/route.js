import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Shop from '@/models/Shop';

export async function GET(request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const city = searchParams.get('city');
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'desc' ? -1 : 1;

    try {
        const query = { status: 'active' };

        if (term) {
            query.name = { $regex: term, $options: 'i' };
        }
        if (city) {
            query['city.value'] = parseInt(city);
        }
        if (type) {
            query['type.value'] = parseInt(type);
        }
        if (category) {
            query['categories.value'] = parseInt(category);
        }
        if (subCategory) {
            query['subCategories.value'] = parseInt(subCategory);
        }
        if (latitude) {
            query.latitude = parseFloat(latitude);
        }
        if (longitude) {
            query.longitude = parseFloat(longitude);
        }

        const results = await Shop.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: order });

        const shopResults = results.map((shop) => {
            return {
                id: shop._id,
                value: shop.value,
                name: shop.name,
                ownerName: shop.owner.ownerName,
                ownerId: shop.owner.ownerId,
                typeLabel: shop.type.typeLabel,
                typeId: shop.type.typeId,
                cityLabel: shop.city.cityLabel,
                cityId: shop.city.cityId,
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
        });

        return NextResponse.json({
            success: true,
            shops: shopResults,
            page,
            limit,
            total: await Shop.countDocuments(query),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
