import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import {Layer} from "ol/layer";

const kommuneLayer = new VectorLayer({
  className: "kommuner",
  source: new VectorSource({
    url: "/kommuner_komprimert.json",
    format: new GeoJSON(),
  }),
});

export function useLayer(layer: Layer, checked: boolean) {
  const { setLayers } = useContext(MapContext);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, layer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== layer));
    };
  }, [checked]);
}

export function KommuneLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  useLayer(kommuneLayer, checked);

  return (
      <div>
        <label>
          <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
          />
          {checked ? "Hide" : "Show"} kommuner
        </label>
      </div>
  );
}