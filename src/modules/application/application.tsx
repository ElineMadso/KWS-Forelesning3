import React, {MutableRefObject, useEffect, useRef} from "react";
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source';
import {useGeographic} from 'ol/proj';
import "./application.css";
import 'ol/ol.css';
import {KommuneLayerCheckbox} from "../kommune/KommuneLayerCheckbox";

useGeographic();

const map = new Map({
    layers: [ new TileLayer({source: new OSM()})],
    view: new View({center: [10,59], zoom: 10 })
})
export function Application() {
    //function to zoom in where the user is
    function handleFocusUser(e : React.MouseEvent) {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(pos =>{
            const {latitude, longitude } = pos.coords;
            map.getView().animate({
                center: [longitude, latitude],
                zoom: 13
            })
        })
    }
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
    useEffect(() => {
        map.setTarget(mapRef.current);
    }, []);
    return <>
        <header>
            <h1>Kommune Kart</h1>
        </header>
        <nav>
            <a href={"#"} onClick={handleFocusUser}>Focus on me</a>
            <KommuneLayerCheckbox />
        </nav>
        <div ref={mapRef}></div>
    </>;
}

