import React, { useState, useEffect } from 'react'
import {API_URL} from '../index'
import Header from '../components/Header'
import Footer from '../components/Footer'
import vector_bottom from '../static/img/стрелка.png';
import Vector from '../static/img/Vector.png';
import axios from 'axios';
import './PersonalAccountUser.css'


export default function PersonalAccountUser() {
    const [email, setEmail] = useState('');

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
    useEffect(() => {
        axios.get(API_URL + 'personalInfo', {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}})
        .then(res => {
            const data = res.data
            setEmail(data.user.persona.user.username)
            console.log(data);
            
        }).catch(err => {
            console.log(err)
        })
    })
    
    return (
        <div className="wrapper">
            <Header/>
        <div class="GeneralDiv_PerAccUs">

            <div className="LeftMenu_PerAccUsmain">
                <div className="LeftMenuButt_PerAccUs">
                    <button className= "ProfileButt_PerAccUs" type = "submit">Данные профиля</button>
                    <button className= "PartButt_PerAccUs" type = "submit">Мои участия</button>
                </div>
            </div>

            <div className="MainDiv_PerAccUs">

                <div className="GeneralPublicData_PerAccUs">
                    <div className="PublicData_PerAccUs">
                        <div className="PublicInfo_PerAccUs">
                            <h1 className="h1_PerAccUs">Публичные данные</h1>
                            <p className="p_PerAccUs">данные, которые будут видны остальным пользователям</p>
                        </div>
                        <div className="PublicInfoInputs_PerAccUs">
                            <input type="text" className="PublicInputName_PerAccUs" placeholder='Придумайте себе имя пользователя' /> 
                            <input type="text" className="PublicInputId_PerAccUs" placeholder='Придумайте себе ID состоящий из букв и цифр' />
                        </div>
                    </div>
                </div>

                <div className="GeneralLocalData_PerAccUs">
                    <div className="LocalData_PerAccUs">
                        <div className="LocalInfo_PerAccUs">
                            <h1 className="h1_PerAccUs">Личные данные</h1>
                            <p className="p_PerAccUs">Данные, которые будут использоваться для идентефицирования личности и подготовки сертификатов</p>
                        </div>
                        <div className="LocalInfoInputs_PerAccUs">
                            <input type="text" className="LocalDataInputFIO_PerAccUs" placeholder='Введите ваше ФИО'/> 

                            <div className="DivLocalInfoPhoneBirthday_PerAccUs">
                                <input type="text" className="LocalDataInputPhoneBirthday_PerAccUs" placeholder='Введите ваш номер телефона' /> 
                                <input type="text" className="LocalDataInputPhoneBirthday_PerAccUs" placeholder='Введите ваш день рождения' /> 
                            </div>

                            <div className="LocalInfoGender_PerAccUs">
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
                                <input type="text" className="LocalInfoEmail_PerAccUs" value ={email} readOnly placeholder ="Ваша почта"/>
                            </div>
                        </div>  
                    </div>
                </div>

                <div className="GeneralMainLocation_PerAccUs">
                    <div className="MainLocation_PerAccUs">
                        <div className="LocationInfo_PerAccUs">
                            <h1 className="h1_PerAccUs">местоположение</h1>
                            <p className="p_PerAccUs">Местоположение, которое будет использоваться для идентификации личности и подготовки сертификатов</p>
                        </div>

                        <div className="Location_PerAccUs">
                            <div className="LocationCountry_PerAccUs">
                                {country || 'Выберите страну'}
                                {isCountryDropdownOpen 
                                        ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCountryDropdownOpen)} />
                                        : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCountryDropdownOpen)} />
                                    }
                            </div>
                            {isCountryDropdownOpen &&(
                                <input 
                                    type="text" 
                                    className="Input_PerAccUs"
                                    value = {country}
                                    onChange ={(e) => handleInputChange(setCountry,setIsCountryDropdownOpen, e.target.value)}
                                    placeholder="Введите или выберите страну" 
                                />
                            )}

                            <div className="LocationRegion_PerAccUs">
                                {region || 'Выберите регион' }
                                {isRegionDropdownOpen 
                                        ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown( setIsRegionDropdownOpen)} />
                                        : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown( setIsRegionDropdownOpen)} />
                                    }
                            </div>
                            {isRegionDropdownOpen &&(
                                <input 
                                    type="text" 
                                    className="Input_PerAccUs"
                                    onChange={(e) => handleInputChange(setRegion, setIsRegionDropdownOpen,e.target.value)}
                                    placeholder="Введите или выберите регион"
                                /> 
                            )}

                                <div className="LocationCity_PerAccUs">
                                    {city || 'Выберите город'}
                                    {isCityDropdownOpen 
                                            ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCityDropdownOpen)} />
                                            : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsCityDropdownOpen)} />
                                        }
                                </div>
                                {isCityDropdownOpen &&(
                                    <input 
                                        type="text" 
                                        className="Input_PerAccUs"
                                        onChange={(e) => handleInputChange(setCity,setIsCityDropdownOpen, e.target.value)} 
                                        placeholder="Введите или выберите город"
                                    />
                                )}
                
                        </div>
                    </div>
                </div>

                <div className="ChangePassword_PerAccUs">
                    <div className="ChangePasswordInfo_PerAccUs">
                        <h1 className="h1_PerAccUs">Смена пароля</h1>
                        <p className="p_PerAccUs">При нажатии на кнопку смены пароля,вам на почту придет ссылка для подтвеждения и выбора нового пароля</p>
                    </div>
                    <div className="DivChange_PerrAccUs">
                        <input type="text" className="type" />Ваш пароль
                        <button className="ButtChange_PerrAccUs">Сменить пароль</button>
                    </div>
                </div>

                <div className="DivSave_PerAccUs">
                    <button className="ButtSave_PerAccUs">Сохранить данные</button>
                </div>
            </div>
        </div>
            <Footer/>
        </div>
        
     );
}