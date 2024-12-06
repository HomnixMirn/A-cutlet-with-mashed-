import React from "react";
import { YMaps, Map } from '@pbe/react-yandex-maps';
import { API_URL } from "..";
import axios from "axios";

const mapState = {
  center: [60.704272, 100.60203],
  zoom: 4
};

// Цвет обводки по умолчанию и цвет обводки при наведении
const DEFAULT_STROKE_COLOR = "#B0B0B0"; // Серый
const HOVER_STROKE_COLOR = "#49C0B5"; // Цвет при наведении

function App() {
  const [mapData, setMapData] = React.useState([]);
  const mapRef = React.createRef(null);

  React.useEffect(() => {
    axios.get(API_URL + 'get_organization/')
      .then((res) => {
        setMapData(res.data);
        console.log(res.data) // Сохраняем данные о регионах
      })
      .catch(err => console.log(err));
  }, []);

  const getRegions = ymaps => {
    if (mapRef && mapRef.current) {
      var objectManager = new ymaps.ObjectManager();
      ymaps.borders
        .load("RU", {
          lang: "ru",
          quality: 2
        })
        .then(function (result) {
          // Создаем объект regions, где ключи это ISO код региона.
          var regions = result.features.reduce(function (acc, feature) {
              var iso = feature.properties.iso3166;
              var name = feature.properties.name; // Предположим, что имя региона находится здесь
      
              feature.id = iso;
              feature.name = name; // Добавляем наименование региона
              feature.options = {
                  fillColor: 'rgba(255, 255, 255, 0)', // Прозрачный цвет заливки
                  strokeColor: DEFAULT_STROKE_COLOR,
                  strokeOpacity: 1,
                  strokeWidth: 1, // Ширина обводки
              };
      
              acc[iso] = feature;
              return acc;
          }, {});
          
          // Теперь вы можете использовать regions, и в каждом объекте будет id, iso и name
      

          // Добавляем регионы на карту.
          objectManager.add(result);
          mapRef.current.geoObjects.add(objectManager);

          // Обработчики событий для наведения и ухода с регионов
          objectManager.objects.events.add('mouseenter', function (e) {
            const objectId = e.get('objectId');
            
            // Получаем объект по его ID
            const object = objectManager.objects.getById(objectId);
            
            if (object) {
                // Устанавливаем опции для объекта при наведении
                objectManager.objects.setObjectOptions(objectId, {
                    strokeColor: HOVER_STROKE_COLOR,
                    strokeWidth: 3,
                });
        
                // Предполагаем, что имя региона хранится в свойстве name
                const regionName = object.name || 'Неизвестный регион'; // Устанавливаем значение по умолчанию
      
 
                console.log(regionName) 
            }
        });

          objectManager.objects.events.add('mouseleave', function (e) {
            const objectId = e.get('objectId');
            objectManager.objects.setObjectOptions(objectId, {
              strokeColor: DEFAULT_STROKE_COLOR,
              strokeWidth: 1,
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