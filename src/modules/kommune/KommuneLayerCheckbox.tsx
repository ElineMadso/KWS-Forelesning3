import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Layer} from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";

const kommunelayer = new VectorLayer({
        source: new VectorSource({
            url: "/kommuner_komprimert.json",
            format: new GeoJSON()
        }),
    });

export function KommuneLayerCheckbox(
    {setLayers,
    }: {
    setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if (checked) {
            setLayers(old => [...old, kommunelayer]);
        }
        return () => {
            setLayers((old) => old.filter(l => l != kommunelayer));
        }
    }, [checked]);

    return (<div>
            <label>
                <input type={"checkbox"} checked={checked} onChange={e => setChecked(e.target.checked)}/>
                {checked ? "hide" : "show"} kommune Layer
            </label>
        </div>
    );
}