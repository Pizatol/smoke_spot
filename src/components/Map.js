import React, { useEffect, useState, useRef } from "react";

import { db } from "../lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";

import {
    MapContainer,
    TileLayer,
    LayersControl,
    ZoomControl,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./Map.css";

export default function Map() {
    // entree de la db
    const smokeSpotCollection = collection(db, "smoke_spot");

    // const [newSpot, setNewSpot] = useState("")

    // parametres de base
    const location = [35.329523, 139.469281];
    const zoom = 14;
    const [map, setMap] = useState(null);
    const [spots, setSpots] = useState([]);

    const markerOptions = {
        title: "MyLocation",
        clickable: true,
        draggable: true,
    };

    // design icone
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // LECTURE DB ET AFFICHAGE SPOTS

    useEffect(() => {
        const getSpots = async (e) => {
            const data = await getDocs(smokeSpotCollection);

            // mappe à travers la data pour rendre les informations plus lisibles ...
            setSpots(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

            console.log("updated");
            console.log(spots);
        };
        getSpots();

        console.log("mounted");
    }, [map]);

    useEffect(() => {
        if (!map) return;

        // locate() permet de géolocaliser l'utilisateur
        // map.locate({
        //     setView: true,
        // });

        // CREATION MARKER DOUBLE CLICK
        const onMapClick = (e) => {
            const timer = setTimeout(() => {
                const marker = new L.marker(e.latlng, markerOptions);

                marker.on("", function (event) {
                    let marker = event.target;
                    let { position } = marker.getLatLng();
                    marker.setLatLng(new L.LatLng(position.lat, position.lng), {
                        draggable: "true",
                    });
                    map.panTo(new L.LatLng(position.lat, position.lng));
                });

                // enregistrement du marker dans la DB
                const creationSpotDB = async () => {
                    addDoc(smokeSpotCollection, {
                        commentaire: "",
                        lat: marker._latlng.lat,
                        lng: marker._latlng.lng,
                    });
                };

                map.addLayer(marker);
                creationSpotDB();
                marker.bindPopup();

                return () => clearTimeout(timer);
            }, 100);
            // if(marker !== undefined){
            //     map.removeLayer(marker)
            // }
        };

        //   ajoute le marker au double click
        map.on("dblclick", onMapClick);
    }, [map]);

    //  RETURN ******

    return (
        <div className="container">
            <MapContainer
                // WHEN CREATED permet d'acceder aux parametres de la map, qu'on place dans un state
                shadowAnchor={false}
                whenCreated={setMap}
                center={location}
                zoom={zoom}
                zoomControl={false}
            >
                {/* LayersControl est le controleur qui change le visuel de la map */}
                <LayersControl>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomright" />

                    {spots.map((e) => (
                        <Marker position={[e.lat, e.lng]}>
                            <Popup>{e.commentaire}</Popup>
                        </Marker>
                    ))}
                </LayersControl>

                {/* GeoJson utilise une db pour placer des marqueurs */}
                {/* <GeoJSON data={db} /> */}
            </MapContainer>
        </div>
    );
}
