import React from "react";
import { YMaps, Map } from '@pbe/react-yandex-maps';
import { API_URL } from "..";
import axios from "axios";
import './MapComponets.css';
import poisk from '../static/img/poisk-app.png'
import {Link} from 'react-router-dom';

const mapState = {
  center: [60.704272, 100.60203],
  zoom: 4
};

const DEFAULT_STROKE_COLOR = "#B0B0B0"; // Серый
const HOVER_STROKE_COLOR = "#49C0B5"; // Цвет при наведении

function MapComp(width, height) {

  const [mapData, setMapData] = React.useState(React.useRef([])['current']);
  const mapRef = React.createRef(null);
  const mapDataRef = React.useRef(mapData);
  const [popup, setPopup] = React.useState([]); // Хранение попапа
  const [popupState, setPopupState] = React.useState(false);

  const [popupActive,setPopupActive] = React.useState(false);
  const [popupActiveData,setPopupActiveData] = React.useState([]);

  const [popupPoisk, setPopupPoisk] = React.useState('');
  const [filteredRegions, setFilteredRegions] = React.useState([]);

  const [search, setSearch] = React.useState(true);

  React.useEffect(() => {
    axios.get(API_URL + 'get_organization')
      .then((res) => {
        setMapData(res.data);
        console.log(res.data); // Сохраняем данные о регионах
      })
      .catch(err => console.log(err));
  }, [search]);
  
  React.useEffect(() => {
    mapDataRef.current = mapData;
  }, [mapData]);

  React.useEffect(() => {
    console.log(popupPoisk);
}, [popupPoisk]);
  React.useEffect(()=>{
    console.log("ичишл курасаки",filteredRegions)
  },[filteredRegions])

  const getHexColor = (regionName) => {
    // Преобразуем название региона в число
    let hash = 0;
    for (let i = 0; i < regionName.length; i++) {
      hash += regionName.charCodeAt(i);
    }
  
    // Генерируем HEX-цвет на основе хеша
    const color = ((hash & 0x00FFFFFF) | 0x00000000).toString(16).slice(1).toUpperCase();
    console.log(color);
    return `#${color}`;
    };


  const handlePoiskFilter = (e) => {
    setPopupPoisk(e.target.value);
    const value = e.target.value.toLowerCase();

    // Преобразуем объект в массив
    const regionsArray = Object.values(filteredRegions);

    // Фильтруем массив по имени региона
    const filtered = regionsArray.filter(region =>
      region.name.toLowerCase().includes(value)
    );

    console.log("Отфильтрованные регионы:", filtered);
    if (mapRef.current) {
      const objectManager = mapRef.current.objectManager; // Предполагаем, что вы сохранили ссылку на objectManager
  
      // Удаляем старые объекты
      objectManager.removeAll();
  
      // Добавляем отфильтрованные регионы
      objectManager.add(filtered);
    }
  };

  const getRegions = ymaps => {
    if (mapRef && mapRef.current) {
      var objectManager = new ymaps.ObjectManager();
      mapRef.current.objectManager = objectManager;

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
              fillColor: getHexColor(name),
              strokeColor: DEFAULT_STROKE_COLOR,
              strokeOpacity: 1,
              strokeWidth: 1,
              fillOpacity: 0.4,
            };
  
            acc[iso] = feature;
            return acc;
          }, {});

          
          
          objectManager.add(result);
          setFilteredRegions(regions);
          mapRef.current.geoObjects.add(objectManager);
          
          // У меня есть useEffect который получает mapData но в эту функцию почему приходит пустой массив mapData
          objectManager.objects.events.add('mouseenter', async function (e) {
            const objectId = e.get('objectId');
            const object = objectManager.objects.getById(objectId); // Получаем объект по ID
            
            if (object) {
              setSearch(!search);
              console.log(search);
              objectManager.objects.setObjectOptions(objectId, {
                strokeColor: HOVER_STROKE_COLOR,
                strokeWidth: 3,
              });
              console.log(mapData);
              console.log(mapDataRef.current);
              const originalRegionName = object.name;
              let regionData = mapDataRef.current.find(item => item.region === originalRegionName);

              setPopup(regionData);
              setPopupState(!popupState);
            }
          });
  
          objectManager.objects.events.add('mouseleave', function (e) {
            const objectId = e.get('objectId');
            objectManager.objects.setObjectOptions(objectId, {
              strokeColor: DEFAULT_STROKE_COLOR,
              strokeWidth: 1,
            });
            setPopup([]);
            setPopupState(false);
          });
        });
        objectManager.objects.events.add('click', function (e) {
          const objectId = e.get('objectId');
          const object = objectManager.objects.getById(objectId); // Получаем объект по ID
      
          if (object) {
              const originalRegionName = object.name;
              let regionData = mapDataRef.current.find(item => item.region === originalRegionName);
      
              // Устанавливаем данные попапа при клике
              setPopupActiveData(regionData);
              setPopupActive(true);
          }
      });
    }
  };



    return (
      <div className="App">
        <div className="poisk-app-glav">
          <div className="poisk-app">
              <input type="text" className="poisk-input" placeholder="Поиск по региону" value={popupPoisk} onChange={(e) => handlePoiskFilter(e)}/>
              <img src={poisk} alt="" className="poisk-img"/>
            </div>
        </div>
        <YMaps >
          <Map
            style={{ width: `1400px`, height: `551px`, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}
            instanceRef={mapRef}
            state={mapState}
            onLoad={getRegions}
            modules={["borders", "ObjectManager", "balloon"]}
          />
          
          {popupActive ? (
              <div className="popup-map">
                <div className="popup-map-active">
                  <div className="block-data-popup-active">
                <div>{popupActiveData.fio}</div>
                <div>{popupActiveData.region}</div>
                </div>
                <button className="button-popup-app-active" onClick={() => setPopupActive(false)}>&times;</button>
                <Link className="link-popup-app-active" to={`/OrganizationInfo/${popupActiveData.id}`}>Подробнее</Link>
                </div>
              </div>
            ) : popupState ? (
              <div className="popup-map">
                <div>{popup ? popup.fio : ''}</div>
                <div>{popup ? popup.region : ''}</div>
              </div>
            ) : (
              <h1 className="a"></h1>
            )}
        </YMaps>
      </div>
      
    );
  }
  
  export default MapComp;
  