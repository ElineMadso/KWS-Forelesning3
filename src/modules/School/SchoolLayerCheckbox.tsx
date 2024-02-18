import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import { useLayer } from "../kommune/KommuneLayerCheckbox";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import {Circle, Fill, Stroke, Style, Text} from "ol/style";
import { Feature, MapBrowserEvent } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../map/mapContext";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/schools.json",
    format: new GeoJSON(),
  }),
  //snarvei til styling funksjonen
  style: schoolStyle,
});

//this implements the data of the geoJSON file
interface SchoolProperties {
  navn: string,
  antall_elever: number;
  eierforhold: "Offentlig" | "Privat";
}

//ts, expect these features to be pointfeatures
type SchoolFeature = { getProperties(): SchoolProperties } & Feature<Point>;

//endrer utseende på punktene
function schoolStyle(f: FeatureLike) {
  //our featurelike is a schoolfeature
  const feature = f as SchoolFeature;
  const school = feature.getProperties();

  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 1 }),
      fill: new Fill({
        color: school.eierforhold === "Offentlig" ? "green" : "purple",
      }),
      radius: 3 + school.antall_elever / 150,
    }),
  });
}

//when hovering. this style will be in action
function activeSchoolStyle(f: FeatureLike) {
  //our featurelike is a schoolfeature
  const feature = f as SchoolFeature;
  const school = feature.getProperties();

  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 3 }),
      fill: new Fill({
        color: school.eierforhold === "Offentlig" ? "green" : "purple",
      }),
      radius: 3 + school.antall_elever / 150,
    }),
    text: new Text({
      text: school.navn,
      //text over point
      offsetY: -15,
      //must be correct order to function
      font: " bold 15px sans-serif",
      fill: new Fill({ color: "black"}),
      stroke: new Stroke({color: "white"}),
    }),
  });
}

export function SchoolLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(true);
  const [activeFeature, setActiveFeature] = useState<SchoolFeature>();

  //what happens when the pointer is moved only when schools are on
  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    //when the mouse is moving, this message will show
    //console.log("pointermove", e.coordinate);

    const features: FeatureLike[] = [];
    //to get closest to the point in pixels
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 1,
      layerFilter: (l) => l === schoolLayer,
    });
    //this could also be kommunefilter
    if (features.length === 1) {
      setActiveFeature(features[0] as SchoolFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  //this shows the name the user is hovering
  useEffect(() => {
    activeFeature?.setStyle(activeSchoolStyle);

    //this makes the hovering disappear when not hovering
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useLayer(schoolLayer, checked);

  //when the pointer is moved
  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show schools
        {activeFeature && " ( " + activeFeature.getProperties().navn + " )"}
      </label>
    </div>
  );
}
