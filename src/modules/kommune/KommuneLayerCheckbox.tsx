import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, Map, MapBrowserEvent, Overlay } from "ol";
import { Polygon } from "ol/geom";

type KommuneProperties = {
  kommunenummer: string;
  navn: {
    sprak: string;
    navn: string;
  }[];
};

type KommuneFeatures = Feature<Polygon> & {
  getProperties(): KommuneProperties;
};

const kommuneSource = new VectorSource<KommuneFeatures>({
  url: "/kommuner_komprimert.json",
  format: new GeoJSON(),
});
const kommunelayer = new VectorLayer({
  source: kommuneSource,
  className: "kommune",
});

export function KommuneLayerCheckbox({
  setLayers,
  map,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);

  const overlay = useMemo(() => new Overlay({}), []);

  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, []);

  //forteller hvilken kommune som er valgt
  const [selectedKommune, setSelectedKommune] = useState<
    KommuneFeatures | undefined
  >();
  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedKommune = kommuneSource.getFeaturesAtCoordinate(
      e.coordinate,
    ) as KommuneFeatures[];
    if (clickedKommune.length === 1) {
      setSelectedKommune(clickedKommune[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedKommune(undefined);
      overlay.setPosition(undefined);
    }
    const properties = clickedKommune[0].getProperties() as KommuneProperties;
    //alert(properties.navn.find((n) => n.sprak === "nor")!.navn);
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommunelayer]);
      //on = adds
      map.on("click", handleClick);
    }
    return () => {
      setLayers((old) => old.filter((l) => l != kommunelayer));
      //un = removes
      map.un("click", handleClick);
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "hide" : "show"} kommune Layer
      </label>

      <div ref={overlayRef} className={"kommune-overlay"}>
        {selectedKommune && (
          <>
            {
                (selectedKommune.getProperties() as KommuneProperties)
                .navn.find((n) => n.sprak === "nor",
                )!.navn
            }
          </>
        )}
      </div>
    </div>
  );
}
