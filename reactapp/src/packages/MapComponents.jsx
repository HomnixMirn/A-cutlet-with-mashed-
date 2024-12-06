import React from "react";
import { YMaps, Map } from '@pbe/react-yandex-maps';
import { API_URL } from "..";
import axios from "axios";

const mapState = {
  center: [60.704272, 100.60203],
  zoom: 4
};

const DEFAULT_STROKE_COLOR = "#B0B0B0"; // Серый
const HOVER_STROKE_COLOR = "#49C0B5"; // Цвет при наведении

function App() {
  const [mapData, setMapData] = React.useState([]);
  const mapRef = React.createRef(null);
  const [popup, setPopup] = React.useState([]); // Хранение попапа

  React.useEffect(() => {
    axios.get(API_URL + 'get_organization/')
      .then((res) => {
        setMapData(res.data);
        console.log(res.data); // Сохраняем данные о регионах
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
          var regions = result.features.reduce(function (acc, feature) {
            var iso = feature.properties.iso3166;
            var name = feature.properties.name;
  
            feature.id = iso;
            feature.name = name;
            feature.options = {
              fillColor: 'rgba(255, 255, 255, 0)',
              strokeColor: DEFAULT_STROKE_COLOR,
              strokeOpacity: 1,
              strokeWidth: 1,
            };
  
            acc[iso] = feature;
            return acc;
          }, {});
  
          objectManager.add(result);
          mapRef.current.geoObjects.add(objectManager);
  
          objectManager.objects.events.add('mouseenter', function (e) {
            const objectId = e.get('objectId');
            const object = objectManager.objects.getById(objectId); // Получаем объект по ID
  
            if (object) {
            
  
              objectManager.objects.setObjectOptions(objectId, {
                strokeColor: HOVER_STROKE_COLOR,
                strokeWidth: 3,
              });
  
              const originalRegionName = object.name;
              let regionData = mapData.find(item => item.region === originalRegionName);

              setPopup(regionData);
              
            }
          });
  
          objectManager.objects.events.add('mouseleave', function (e) {
            const objectId = e.get('objectId');
            objectManager.objects.setObjectOptions(objectId, {
              strokeColor: DEFAULT_STROKE_COLOR,
              strokeWidth: 1,
            });
            setPopup([]);
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
            onLoad={getRegions}
            modules={["borders", "ObjectManager", "balloon"]}
          />
          {popup && (
            <div className="popup" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 4000}}>
              <div>{popup.fio}</div>
              <div>{popup.region}</div>
            </div>
          )}
        </YMaps>
      </div>
    );
  }
  
  export default App;
  