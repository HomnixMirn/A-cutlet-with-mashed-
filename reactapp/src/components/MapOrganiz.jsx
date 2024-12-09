import React from "react";
import { YMaps, Map } from '@pbe/react-yandex-maps';

const mapState = {
  center: [60.704272, 100.60203],
  zoom: 4
};

export default function MapOrganiz({ regionName }) {
  const mapRef = React.useRef(1);
  console.log(regionName);
  
  
  const getRegions = (ymaps) => {
    
      console.log(mapRef.current)
      const objectManager = new ymaps.ObjectManager();
      mapRef.current.objectManager = objectManager;
      console.log(mapRef.current)

      ymaps.borders.load("RU", { lang: "ru", quality: 2 })
        .then(function (result) {
          console.log(result);

          const filteredRegions = result.features.filter(feature => {
            console.log(feature.properties.name);
            console.log(regionName);
            return feature.properties.name === regionName;
          });

          console.log(filteredRegions);

          if (filteredRegions.length > 0) {
            filteredRegions.forEach(feature => {
              feature.options = {
                fillColor: "#B0B0B0",
                strokeColor: "#B0B0B0",
                strokeOpacity: 1,
                strokeWidth: 1,
                fillOpacity: 0.4,
              };

              objectManager.add(feature);
            });

            mapRef.current.geoObjects.add(objectManager);
            const bounds = objectManager.getBounds();
            if (bounds) {
              mapRef.current.setBounds(bounds);
            }
          } else {
            console.warn(` Region not found: ${regionName}`);
          }
        })
        .catch(err => console.error("гг гг", err));
    
  };

  return (
    <div>
      <YMaps>
        <Map
          style={{ width: "588px", height: "644px", boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          instanceRef={mapRef}
          state={mapState}
          onLoad={getRegions}
          modules={["borders", "ObjectManager"]}
        />
      </YMaps>
    </div>
  );
}