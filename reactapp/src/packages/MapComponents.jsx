import React from 'react'
import { YMaps, Map, Placemark, Rectangle } from '@pbe/react-yandex-maps';

export default function MapComponent() {
  return (
    <div>
      <YMaps>
  <Map
    defaultState={{
      center: [55.674, 37.601],
      zoom: 11,
    }}
  >
    <Rectangle
      geometry={[
        [55.66, 37.6],
        [55.71, 37.69],
        [55.71, 37.69],
      ]}
      options={{
        draggable: true,
        fillColor: "#ffff0022",
        strokeColor: "#3caa3c88",
        strokeWidth: 7,
      }}
    />
  </Map>
</YMaps>;
    </div>
  )
}
