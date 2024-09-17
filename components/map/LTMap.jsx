"use client";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup } from "react-leaflet";
import { useRef } from "react";
import { LTMarker } from "@/components/map/LTMarker";

export default function LTMap({ latitude, longitude, height = "400px" }) {
	const markerRef = useRef(null);

	const center = {
		lat: latitude || 35.70210836940316,
		lng: longitude || 51.44367456436158,
	};

	return (
		<MapContainer
			center={center}
			zoom={13}
			scrollWheelZoom={false}
			style={{
				height: height,
				width: "100%",
				margin: "15px 0",
			}}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker
				draggable={false}
				position={center}
				ref={markerRef}
				icon={LTMarker}
			>
				<Popup minWidth={90}>مکان فروشگاه</Popup>
			</Marker>
		</MapContainer>
	);
}
