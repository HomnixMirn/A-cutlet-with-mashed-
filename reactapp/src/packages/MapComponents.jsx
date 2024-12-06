import React from "react";
import { YMaps, Map } from '@pbe/react-yandex-maps';

const mapState = {
  center: [60.704272, 100.60203],
  zoom: 4
};

// Цвет обводки по умолчанию и цвет обводки при наведении
const DEFAULT_STROKE_COLOR = "#B0B0B0"; // Серый
const HOVER_STROKE_COLOR = "#49C0B5"; // Цвет при наведении

function App() {
  const mapRef = React.createRef(null);

  const getRegions = ymaps => {
    if (mapRef && mapRef.current) {
      var objectManager = new ymaps.ObjectManager();
      ymaps.borders
        .load("RU", {
          lang: "ru",
          quality: 2
        })
        .then(function(result) {
          // Создадим объект regions, где ключи это ISO код региона.
          var regions = result.features.reduce(function(acc, feature) {
            // Добавим ISO код региона в качестве feature.id для objectManager.
            var iso = feature.properties.iso3166;
            feature.id = iso;
            // Установим серый цвет границы по умолчанию.
            feature.options = {
              fillColor: 'rgba(255, 255, 255, 0)', // Прозрачный цвет заливки
              strokeColor: DEFAULT_STROKE_COLOR,
              strokeOpacity: 1,
              strokeWidth: 1, // Ширина обводки
            };
            acc[iso] = feature;
            return acc;
          }, {});

          // Добавляем регионы на карту.
          objectManager.add(result);
          mapRef.current.geoObjects.add(objectManager);

          // Обработчики событий для наведения и ухода с регионов
          objectManager.objects.events.add('mouseenter', function (e) {
            const objectId = e.get('objectId');
            objectManager.objects.setObjectOptions(objectId, {
              strokeColor: HOVER_STROKE_COLOR, // Изменяем цвет обводки при наведении
              strokeWidth: 3, // Увеличиваем ширину обводки при наведении
            });
          });

          objectManager.objects.events.add('mouseleave', function (e) {
            const objectId = e.get('objectId');
            objectManager.objects.setObjectOptions(objectId, {
              strokeColor: DEFAULT_STROKE_COLOR, // Возвращаем цвет обводки по умолчанию
              strokeWidth: 1, // Возвращаем ширину обводки по умолчанию
            });
          });
        });
    }
  };

  return (
    <div className="App">
      <YMaps>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          instanceRef={mapRef}
          state={mapState}
          onLoad={ymaps => getRegions(ymaps)}
          modules={["borders", "ObjectManager"]}
        />
      </YMaps>
    </div>
  );
}

export default App;