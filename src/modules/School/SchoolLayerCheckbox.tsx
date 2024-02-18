import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import { useLayer } from "../kommune/KommuneLayerCheckbox";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/schools.json",
    format: new GeoJSON(),
  }),
  //endrer utseende på punktene
  style: new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "green" }),
      radius: 4,
    }),
  }),
});

export function SchoolLayerCheckbox() {
  const [checked, setChecked] = useState(true);

  useLayer(schoolLayer, checked);

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
