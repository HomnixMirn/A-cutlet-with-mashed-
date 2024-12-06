
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Events from './packages/Events';
import Login from './packages/Login';
import Register from './packages/Register';
import Map from './packages/MapComponents';
import PersonalAccountUser from './packages/PersonalAccountUser.jsx';
import { BrowserRouter, Route, Routes  } from'react-router-dom';

export const API_URL = "http://localhost:8000/api/hacaton/";
export const API_MEDIA = "http://localhost:8000";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/event" element={<Events />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<Map />} />
          <Route path = "/PersonalAccountUser" element={<PersonalAccountUser />} />
        </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);


