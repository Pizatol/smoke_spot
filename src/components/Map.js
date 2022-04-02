import React, { useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    LayersControl,  
    ZoomControl,   
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



import "./Map.css";



export default function Map() {
    const location = [48.856613, 2.352222];
    const zoom = 6;
    const [map, setMap] = useState(null);


    useEffect(() => {
        if (!map) return;

   


        // locate() permet de géolocaliser l'utilisateur

        // map.locate({
        //     setView: true,
        //
        // });

        // donne les coordonnées (lat long) du clic

        // map.on("click", function (e) {
        //     let coord = e.latlng;
        //     let lat = coord.lat;
        //     let lng = coord.lng;

        //     // place le marqueur sur la carte
        //     L.marker(e.latlng, {draggable:'true'} ).addTo(map);
        //     L.bindPopup(
        //         ` <div>
        //    <p> ${lat}  </p>
        //    <p>  ${lng}  </p>
        //  </div> `
        //     );
        // });

        function onMapClick(e) {
            let pos;
           const  marker = new L.marker(e.latlng, {draggable:'true'});
            marker.on('dragend', function(event){
              let marker = event.target;
              let {position} = marker.getLatLng();
              pos = {position};
              marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
              map.panTo(new L.LatLng(position.lat, position.lng))
            });
              map.addLayer(marker);
              marker.bindPopup(`<p> ${pos} </p>`).openPopup();

            // if(marker !== undefined){
            //     map.removeLayer(marker)
            // }
          };

        //   Stoppe le zoom en double click
          map.doubleClickZoom.disable();

        //   ajoute le marker au double click
          map.on('dblclick', onMapClick);


    }, [map]);

    // Permet de changer le visuel de la map
    const { BaseLayer } = LayersControl;

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
                    {/* BaseLayer est une couche de la map */}
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomright" />
                    </BaseLayer>
                </LayersControl>
               

                {/* GeoJson utilise une db pour placer des marqueurs */}
                {/* <GeoJSON data={db} /> */}
            </MapContainer>
        </div>
    );
}
