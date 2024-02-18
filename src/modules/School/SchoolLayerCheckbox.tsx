import React, { useContext, useEffect, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import { useLayer } from "../kommune/KommuneLayerCheckbox";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";
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

interface SchoolProperties {
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
      stroke: new Stroke({ color: "white", width: 3 }),
      fill: new Fill({
        color: school.eierforhold === "Offentlig" ? "green" : "purple",
      }),
      radius: 3 + school.antall_elever / 150,
    }),
  });
}

export function SchoolLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(true);

  //what happens when the pointer is moved only when schools are on
  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    //when the mouse is moving, this message will show
    console.log("pointermove", e.coordinate);

    const featuresAtCoordinate = schoolLayer
      .getSource()
        //need to have "closest", cus u cant move at the point
      ?.getClosestFeatureToCoordinate(e.coordinate);

    //console to see what the name of the closest school
    console.log(featuresAtCoordinate?.getProperties().navn);
  }

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
      </label>
    </div>
  );
}
