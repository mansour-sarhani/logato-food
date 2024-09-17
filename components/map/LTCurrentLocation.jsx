"use client";

import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";

function LocationMarker() {
	const [position, setPosition] = useState(null);

	const map = useMapEvents({
		click() {
			map.locate();
		},
		locationfound(e) {
			setPosition(e.latlng);
			map.flyTo(e.latlng, map.getZoom());
		},
	});

	return position === null ? null : (
		<Marker position={position}>
			<Popup>شما اینجا هستید</Popup>
		</Marker>
	);
}

export default function LTCurrentLocation() {
	return (
		<MapContainer
			center={{ lat: 51.505, lng: -0.09 }}
			zoom={13}
			scrollWheelZoom={false}
			style={{ height: "400px", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<LocationMarker />
		</MapContainer>
	);
}
