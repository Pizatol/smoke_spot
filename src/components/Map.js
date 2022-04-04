import React, { useEffect, useState } from "react";

import { db } from "../lib/firebase";
import {
    collection,
    getDocs,
    addDoc,  
    doc,
    deleteDoc,
} from "firebase/firestore";

import {
    MapContainer,
    TileLayer,
    ZoomControl,
    Marker,
    Popup,
    useMapEvents
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

    const [test, setTest] = useState("")
    
    
    // design icone
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    useEffect(() => {
        const getSpots = async (e) => {
            const data = await getDocs(smokeSpotCollection);

            // mappe à travers la data pour rendre les informations plus lisibles ...
            setSpots(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getSpots();
    },[])


    // LECTURE DB ET AFFICHAGE SPOTS
    useEffect(() => {
        if (!map) return;


        // fetch db
      

       
        // CREATION MARKER DOUBLE CLICK
        const onMapClick = (e) => {
           

            if (zoom !== 14) {
            console.log(spots)
            } else {
             
                let   marker = new L.marker(e.latlng);
                
                
                  
                // marker.on("", function (event) {
                //     let marker = event.target;
                //     let { position } = marker.getLatLng();
                //     marker.setLatLng(new L.LatLng(position.lat, position.lng));
                //     map.panTo(new L.LatLng(position.lat, position.lng));
                // });

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

                console.log("SPOT ADDED");
                setTest("")
               
            }
        };

        //   ajoute le marker au double click
        map.on("dblclick", onMapClick);

        console.log("Reload useEffect");
        console.log( "SPOTS", spots);
    }, [map]);

    const deleteIcon = async (id) => {
            const spotDoc = doc(db, "smoke_spot", id);
            console.log(spotDoc);
            await deleteDoc(spotDoc);
            setTest("")

    };

    

    console.log("Reload Global");
    //  RETURN ******

    return (
        <div className="container">
            <MapContainer               
                draggable={false}
                shadowAnchor={true}
                whenCreated={setMap}
                center={location}
                zoom={zoom}
                zoomControl={true}
                doubleClickZoom={false}
            >

                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
                

                {spots.map((e, index) => (
                    <Marker
                        key={index}
                        position={[e.lat, e.lng]}
                        draggable={false}
                        clickable={true}
                    >
                        <Popup>
                            <button onMouseEnter={(id) => deleteIcon(e.id)}>
                                delete
                            </button>
                            <div>{e.commentaire}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
