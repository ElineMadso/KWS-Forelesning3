import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source';
import {useGeographic} from 'ol/proj';
import "./application.css";
import 'ol/ol.css';
import {KommuneLayerCheckbox} from "../kommune/KommuneLayerCheckbox";
import {Layer} from "ol/layer";

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
    const [layers, setLayers] = useState<Layer[]>([
        new TileLayer({source: new OSM()
        })]
    );
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
    useEffect(() => map.setTarget(mapRef.current), []);
    useEffect(() => map.setLayers(layers), [layers]);

    return <>
        <header>
            <h1>Kommune Kart</h1>
        </header>
        <nav>
            <a href={"#"} onClick={handleFocusUser}>Focus on me</a>
            <KommuneLayerCheckbox setLayers={setLayers}/>
        </nav>
        <div ref={mapRef}></div>
    </>;
}

