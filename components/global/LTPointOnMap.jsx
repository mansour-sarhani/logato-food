"use client";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup } from "react-leaflet";
import { useState } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import { LTMarker } from "@/components/global/LTMarker";

export default function LTPointOnMap({
	setFieldValue,
	savedLatitude,
	savedLongitude,
}) {
	const [position, setPosition] = useState({
		lat: 35.70210836940316,
		lng: 51.44367456436158,
	});

	const markerRef = useRef(null);

	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					setPosition(marker.getLatLng());
					setFieldValue("latitude", marker.getLatLng().lat);
					setFieldValue("longitude", marker.getLatLng().lng);
				}
			},
		}),
		[]
	);

	return (
		<div>
			<MapContainer
				center={{
					lat: savedLatitude || position.lat,
					lng: savedLongitude || position.lng,
				}}
				zoom={15}
				scrollWheelZoom={false}
				style={{
					height: "500px",
					width: "100%",
					margin: "10px 0",
				}}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker
					draggable={true}
					eventHandlers={eventHandlers}
					position={{
						lat: savedLatitude || position.lat,
						lng: savedLongitude || position.lng,
					}}
					ref={markerRef}
					icon={LTMarker}
				>
					<Popup minWidth={90}>شما اینجا هستید</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
