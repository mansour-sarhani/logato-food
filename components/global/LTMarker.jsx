import L from "leaflet";
import marker from "@/public/marker-icon.png";
import shadow from "@/public/marker-shadow.png";

export const LTMarker = new L.Icon({
	iconUrl: marker.src,
	iconRetinaUrl: marker.src,
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl: shadow.src,
	shadowSize: new L.Point(41, 41),
	shadowAnchor: null,
	iconSize: new L.Point(25, 41),
	className: "lt-marker",
});
