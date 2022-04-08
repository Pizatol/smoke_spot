import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../context/Context";
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
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locateImg from "../assets/locate.png";
import "./Map.css";

import { IconSelection } from "../assets/IconSelect";

export default function Map() {
    // entree de la db
    const smokeSpotCollection = collection(db, "smoke_spot");

    // parametres de base
    const location = [35.329523, 139.469281];
    const zoom = 16;

    // USE STATE
    const [
        card,
        setCard,
        addComment,
        setAddComment,
        positionMarker,
        setpositionMarker,
    ] = useContext(StateContext);

    const [map, setMap] = useState(null);
    const [spots, setSpots] = useState([]);
    const [color, setColor] = useState(null);

    // design icone

    delete L.Icon.Default.prototype._getIconUrl;

    // LOCATE
    const locate = () => {
        map.locate({ setView: true });
    };

    // LECTURE DB ET AFFICHAGE SPOTS
    useEffect(() => {
        if (!map) return;

        const getSpots = async (e) => {
            const data = await getDocs(smokeSpotCollection);

            // mappe à travers la data pour rendre les informations plus lisibles ...
            setSpots(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getSpots();
        //   ajoute le marker au double click
        map.on("dblclick", onMapClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    //   CARD LOGIC

    const handleCard = () => {
        setCard(!card);
    };

    const handleInput = (e) => {
        setAddComment(e.target.value);
    };

    const handleForm = (e) => {
        e.preventDefault();
        placingMarker();
        setCard(!card);
    };
    const handleColor = (e) => {
        if (e.target.value === "") {
            setColor("red");
        }
        setColor(e.target.value);
    };

    // CHOOSING COLOR MARKER

    const choosingColor = (e) => {
        if (e.colorIcon === "red") {
            return IconSelection.red;
        }
        if (e.colorIcon === "smoke") {
            return IconSelection.smoke;
        } else if (e.colorIcon === "blue") {
            return IconSelection.blue;
        } else if (e.colorIcon === "orange") {
            return IconSelection.orange;
        } else if (e.colorIcon === "green") {
            return IconSelection.green;
        } else {
            return IconSelection.blue;
        }
    };

    // CREATION MARKER DOUBLE CLICK

    const onMapClick = (e) => {
        setCard(!card);
        setpositionMarker(e);
    };

    const placingMarker = () => {
        const e = positionMarker;

        let marker = new L.marker(e.latlng, { icon: choosingColor(e) });
        map.addLayer(marker);

        const creationSpotDB = async () => {
            addDoc(smokeSpotCollection, {
                commentaire: addComment,
                lat: marker._latlng.lat,
                lng: marker._latlng.lng,
                colorIcon: color,
            });
        };

        creationSpotDB();
        setAddComment("");
        setpositionMarker("");
        setColor("");

        setTimeout(() => {
            window.location.reload(true);
        }, 100);
    };

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
        <div>
            <button className="btnLocate" onClick={locate}>
                <img src={locateImg} alt="locate button" />
            </button>
            <MapContainer
                className="MapContainer"
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
                        icon={choosingColor(e)}
                        // icon={`IconSelection.${e.colorIcon}`}
                    >
                        <Popup className="popup" closeButton={false}>
                            <div className="commentSection">
                                {e.commentaire}
                            </div>
                            <button
                                className="deleteBtn"
                                onClick={(id) => deleteIcon(e.id)}
                            >
                                Delete Icon
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* CARD */}

            {card && (
                <div className="containerCard">
                    <div onClick={handleCard} className="overlay"></div>
                    <form className="cardForm" onSubmit={handleForm}>
                        <div>
                            <input
                                className="cardInput"
                                onChange={(e) => handleInput(e)}
                                type="text"
                                placeholder="Optional : add Comment"
                            />
                        </div>
                        <select
                            className="select"
                            onChange={(e) => handleColor(e)}
                            name="color"
                            id="colors"
                            required
                        >
                            {" "}
                            <option value="" selected disabled hidden>
                                Color Icon
                            </option>
                            <option value="smoke">Smoking area</option>
                            <option value="red">red</option>
                            <option value="blue">blue</option>
                            <option value="green">green</option>
                            <option value="orange">orange</option>
                        </select>

                        <button
                            className="btnValidation
                        "
                        >
                            Place marker
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
