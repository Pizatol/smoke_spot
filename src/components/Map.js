import React, { useContext, useEffect, useState} from "react";
import { StateContext } from "../context/Context";
import { db } from "../lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

import {
    MapContainer,
    TileLayer,
    ZoomControl,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import { smokeIcon } from "./Icon";
import "./Map.css";

export default function Map() {
    

    // entree de la db
    const smokeSpotCollection = collection(db, "smoke_spot");

    // parametres de base
    const location = [35.329523, 139.469281];
    const zoom = 14;

    // USE STATE
    const [commentCard, setCommentCard] = useContext(StateContext)

    const [map, setMap] = useState(null);
    const [spots, setSpots] = useState([]);
    const [inputs, setInputs] = useState("");
    
    
 


    // design icone

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // LECTURE DB ET AFFICHAGE SPOTS
    useEffect(() => {
        if (!map) return;

        const getSpots = async (e) => {
            const data = await getDocs(smokeSpotCollection);

            // mappe à travers la data pour rendre les informations plus lisibles ...
            setSpots(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getSpots();

        // filtre doublons
        let filArr = [...spots];

        let uniqueArr = [...new Set(filArr.lat)];

        setSpots(uniqueArr);

        const updateSpots = async () => {
            const spotDoc = doc(db, "smoke_spot");
            await updateDoc(spotDoc, uniqueArr);
        };

        // CREATION MARKER DOUBLE CLICK
        const onMapClick = (e) => {
            if (zoom !== 14) {
            } else {
                let marker = new L.marker(e.latlng);
                map.addLayer(marker);

                // enregistrement du marker dans la DB
                const creationSpotDB = async () => {
                    addDoc(smokeSpotCollection, {
                        commentaire: "",
                        lat: marker._latlng.lat,
                        lng: marker._latlng.lng,
                    });
                };

                creationSpotDB();
            }
        };

        updateSpots();

        //   ajoute le marker au double click
        map.on("dblclick", onMapClick);
    }, [map]);

    // UPDATE COMMENTAIRE

    const handleInput = (el) => {
        setInputs(el.target.value);
        console.log(el.target.value);
    };

    // MOFIC COMMENTAIRE
    const handleForm = async (id) => {
        // userDoc définit quel User est sélectionné (db, collection, id )
        // const inputDoc = setDoc(db, "smoke_spot", el);
        // const newComm = { commentaire : inputs };
        // await updateDoc(inputDoc, newComm);
    };

    // updateComm()

    // DELETE ICON
    const deleteIcon = async (id) => {
        const spotDoc = doc(db, "smoke_spot", id);

        await deleteDoc(spotDoc);

        setTimeout(() => {
            window.location.reload(true);
        }, 100);
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
                zoomControl={false}
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
                            <button onClick={(id) => deleteIcon(e.id)}>
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
