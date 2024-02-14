import React, { useMemo } from "react";
import { Layer } from "ol/layer";
import VectorSource from "ol/source/Vector";
//have a kommunelayer when present
export function KommuneAside({ layers }: { layers: Layer[] }) {
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommune"),
    [layers],
  );
  const features = useMemo(
    () => (kommuneLayer?.getSource() as VectorSource)?.getFeatures(),
    [kommuneLayer],
  );

  return (
    <aside>
      {kommuneLayer && (
        <div>
          <h2>Kommuner</h2>
            {features?.map((f) => <div> {f.getProperties().kommunenummer} </div>)}
        </div>
      )}
    </aside>
  );
}
