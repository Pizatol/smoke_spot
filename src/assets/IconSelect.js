import L from 'leaflet'


import blueColor from "../assets/map-marker-blue.svg"
import redColor from "../assets/map-marker-red.svg"
import greenColor from "../assets/map-marker-green.svg"
import orangeColor from "../assets/map-marker-orange.svg"
import smokeIcon from "../assets/smoke.svg"

export const IconSelection = {

	red : L.icon({
		iconUrl : redColor,
		iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -50],
	}),

	green : L.icon({
		iconUrl :greenColor,
		iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -50],
	}),

	blue : L.icon({
		iconUrl : blueColor,
		iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -50],
	}),
	orange : L.icon({
		iconUrl : orangeColor,
		iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -50],
	}),
	smoke : L.icon({
		iconUrl : smokeIcon,
		iconSize: [40, 40],
        iconAnchor: [20, 30],
        popupAnchor: [0, -50],
	}),


}


