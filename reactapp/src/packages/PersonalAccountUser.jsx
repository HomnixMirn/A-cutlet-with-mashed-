import React, { useState } from 'react'
import {API_URL} from '../index'
import Header from '../components/Header'
import Footer from '../components/Footer'
import vector_bottom from '../static/img/стрелка.png';
import Vector from '../static/img/Vector.png';

export default function PersonalAccountUser() {
    const [gender, setGender] = useState('');
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

    const [country, setCountry] = useState('');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    const [region, setRegion] = useState('');
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

    const [city, setCity] = useState('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    const toggleDropdown = (setDropdownOpen) => {
        setDropdownOpen(prevState => !prevState);
    };

    const handleInputChange = (setFunction, setDropdownOpen, value) =>{
        setFunction(value);
        setDropdownOpen(true);
    };

    const selectOption = (setOption, setDropdownOpen, option) => {
        setOption(option);
        setDropdownOpen(false);
    };

    return (
        <>
        <Header/>
        <Footer/>
        <div className="">

            <div className="">
                <button className= "" type = " ">Данные профиля</button>
                <button className= "" type = " ">Мои участия</button>
            </div>

            <div className="">

                <div className="">
                    <div className="">
                        <h1 className="">Публичные данные</h1>
                        <p className="">данные, которые будут видны остальным пользователям</p>
                    </div>
                    <div className="">
                        <input type="text" className="" /> Придумайте себе имя пользователя
                        <input type="text" className="" /> Придумайте себе ID состоящий из букв и цифр
                    </div>
                </div>

                <div className="">
                    <div className="">
                        <h1 className="">Личные данные</h1>
                        <p className="">Данные, которые будут использоваться для идентефицирования личности и подготовки сертификатов</p>
                    </div>
                    <div className="">
                        <input type="text" className="" /> Введите ваше ФИО
                        <div className="">
                            <input type="text" className="" /> Введите ваш номер телефона
                            <input type="text" className="" /> Введите ваш день рождения
                        </div>
                        <div className="">
                            <div className="dropdown-header">
                                {gender || 'Ваш пол'}
                                {isGenderDropdownOpen 
                                    ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsGenderDropdownOpen)} />
                                    : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsGenderDropdownOpen)} />
                                }
                            </div>
                            {isGenderDropdownOpen &&(
                                <ul className="dropdown-list">
                                    <li onClick = {() => selectOption(setGender, setIsGenderDropdownOpen,'Мужской')}>Мужской</li>
                                    <li onClick = {() => selectOption(setGender, setIsGenderDropdownOpen,'Женский')}>Женский</li>
                                </ul>
                            )}
                        </div>

                        <div className=' '>
                            <input type="text" className="" /> Ваша почта
                        </div>

                    </div>
                </div>

                <div className="">
                    <div className="">
                        <h1 className="">местоположение</h1>
                        <p className="">Местоположение, которое будет использоваться для идентификации личности и подготовки сертификатов</p>
                    </div>
                    <div className="">

                        <div className="">
                            {country || 'Выберите страну'}
                            {isCountryDropdownOpen 
                                    ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCountryDropdownOpen)} />
                                    : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCountryDropdownOpen)} />
                                }
                        </div>
                        {isCountryDropdownOpen &&(
                            <input 
                                type="text" 
                                className="input"
                                value = {country}
                                onChange ={(e) => handleInputChange(setCountry,setIsCountryDropdownOpen, e.target.value)}
                                placeholder="Введите или выберите страну" 
                            />
                        )}

                        <div className="">
                            {region || 'Выберите регион' }
                            {isRegionDropdownOpen 
                                    ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown( setIsRegionDropdownOpen)} />
                                    : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown( setIsRegionDropdownOpen)} />
                                }
                        </div>
                        {isRegionDropdownOpen &&(
                            <input 
                                type="text" 
                                className=""
                                onChange={(e) => handleInputChange(setRegion, setIsRegionDropdownOpen,e.target.value)}
                                placeholder="Введите или выберите регион"
                             /> 
                        )}

                        <div className="">
                            <div className="">
                                {city || 'Выберите город'}
                                {isCityDropdownOpen 
                                        ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCityDropdownOpen)} />
                                        : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCityDropdownOpen)} />
                                    }
                            </div>
                            {isCityDropdownOpen &&(
                                <input 
                                    type="text" 
                                    className=""
                                    onChange={(e) => handleInputChange(setCity,setIsCityDropdownOpen, e.target.value)} 
                                    placeholder="Введите или выберите город"
                                />
                            )}

                        </div>                
                    </div>
                </div>

                <div className="">
                    <div className="">
                        <h1 className="">Смена пароля</h1>
                        <p className="">При нажатии на кнопку смены пароля,вам на почту придет ссылка для подтвеждения и выбора нового пароля</p>
                    </div>
                    <div className="">
                        <input type="text" className="type" />Ваш пароль
                        <button className="">Сменить пароль</button>
                    </div>
                </div>

                <div className="">
                    <button className="">Сохранить данные</button>
                </div>
            </div>
        </div>
        </>
        
     );
}