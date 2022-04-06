import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/Context";
import Card from "./Card";
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
    const [
        card,
        setCard,
        addComment,
        setAddComment,
        validation,
        setValidation,
    ] = useContext(StateContext);

    const [map, setMap] = useState(null);
    const [spots, setSpots] = useState([]);

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

        // CREATION MARKER DOUBLE CLICK
       
        const onMapClick = (e) => {
            if (zoom !== 14) {
            } else {
                setCard(!card);
          
              
            }
            
            
                    let marker = new L.marker(e.latlng);
                    map.addLayer(marker);
                    
                    
                    const creationSpotDB = async () => {
                        addDoc(smokeSpotCollection, {
                            commentaire: addComment,
                            lat: marker._latlng.lat,
                            lng: marker._latlng.lng,
                        });
                    };
                    
                    creationSpotDB();
                    setAddComment("");
                    setValidation(false);
                };
                    
         
     

        // updateSpots();

        //   ajoute le marker au double click
        map.on("dblclick", onMapClick);
    }, [map]);

    // DELETE ICON
    const deleteIcon = async (id) => {
        const spotDoc = doc(db, "smoke_spot", id);

        await deleteDoc(spotDoc);

        setTimeout(() => {
            window.location.reload(true);
        }, 100);
    };

  

 

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
