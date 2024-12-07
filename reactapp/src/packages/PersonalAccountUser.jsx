import React, { useState, useEffect } from 'react'
import {API_URL} from '../index'
import Header from '../components/Header'
import Footer from '../components/Footer'
import vector_bottom from '../static/img/стрелка.png';
import Vector from '../static/img/стрелка2.png';
import axios from 'axios';
import './PersonalAccountUser.css'


export default function PersonalAccountUser() {
    const [email, setEmail] = useState('');

    const [gender, setGender] = useState('');
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

    const [activeButton, setActiveButton] = useState('profile');

    const toggleDropdown = (setDropdownOpen) => {
        setDropdownOpen(prevState => !prevState);
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
        <>
        <Header/>
        <Footer/>
        <div class="GeneralDiv_PerAccUs">

            <div className="LeftMenu_PerAccUsmain">
                <div className="LeftMenuButt_PerAccUs">
                    <button 
                        className= {`ProfileButt_PerAccUs ${activeButton === 'profile' ? 'active':''}`}
                        type = "button"
                        onClick ={() => setActiveButton('profile')}
                        >
                            Данные профиля
                    </button>
                    <button 
                        className= {`PartButt_PerAccUs ${activeButton === 'participation'? 'active':''}`} 
                        type = "submit"
                        onClick ={() => setActiveButton('participation')}
                        >
                            Мои участия
                    </button>
                </div>
            </div>
            {activeButton ==='profile' ?<>
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
                                <p className="p_PerAccUs">данные, которые будут использоваться для идентефицирования личности и подготовки сертификатов</p>
                            </div>
                            <div className="LocalInfoInputs_PerAccUs">
                                <input type="text" className="LocalDataInputFIO_PerAccUs" placeholder='Введите ваше ФИО'/> 

                                <div className="DivLocalInfoPhoneBirthday_PerAccUs">
                                    <input type="phone" className="LocalDataInputPhoneBirthday_PerAccUs" placeholder='Введите ваш номер телефона' /> 
                                    <input type="date" className="LocalDataInputPhoneBirthday_PerAccUs" placeholder='Введите ваш день рождения' /> 
                                </div>

                                <div className="LocalInfoGender_PerAccUs">
                                    <div className="dropdown-header">
                                        <div className="dropdown_PerAccUs">
                                            <p className="PGender_PerAccUs">{gender || 'Ваш пол'}</p>
                                            {isGenderDropdownOpen 
                                                ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsGenderDropdownOpen)} />
                                                : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsGenderDropdownOpen)} />
                                            }
                                        </div>
                                        {isGenderDropdownOpen &&(
                                            <ul className="dropdown-list">
                                                <div className='DivDropDownMale_PerAccUs'>
                                                    <li className="DropDownMale_PerAccUs" onClick = {() => selectOption(setGender, setIsGenderDropdownOpen,'Мужской')}>Мужской</li>
                                                </div>
                                                <div className='DropDownBorder_PerAccUs'></div>
                                                <div className="DivDropDownFemale_PerAccUs">
                                                    <li className="DropDownFemale_PerAccUs" onClick = {() => selectOption(setGender, setIsGenderDropdownOpen,'Женский')}>Женский</li>
                                                </div>
                                            </ul>
                                        )}
                                    </div>
                                    <input type="text" className="LocalInfoEmail_PerAccUs" value ={email} readOnly placeholder ="Ваша почта"/>
                                </div>
                            </div>  
                        </div>
                    </div>

                    <div className="GeneralMainLocation_PerAccUs">
                        <div className="MainLocation_PerAccUs">
                            <div className="LocationInfo_PerAccUs">
                                <h1 className="h1_PerAccUs">Местоположение</h1>
                                <p className="p_PerAccUs">местоположение, которое будет использоваться для идентификации личности и подготовки сертификатов</p>
                            </div>

                            <div className="Location_PerAccUs">
                                <div className="LocationInputs_PerAccUs">
                                    <input type="text" className="LocationInputContry_PerAccUs" placeholder='Введите вашу страну' />
                                    <input type="text" className="LocationInputRegion_PerAccUs" placeholder='Введите ваш регион' />
                                    <input type="text" className="LocationInputCity_PerAccUs" placeholder='Введите ваш город' />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="GeneralChangePassword_PerAccUs">
                        <div className='ChangePassword_PerAccUs'>
                            <div className="ChangePasswordInfo_PerAccUs">
                                <h1 className="h1_PerAccUs">Смена пароля</h1>
                                <p className="p_PerAccUs">При нажатии на кнопку смены пароля,вам на почту придет ссылка для подтвеждения и выбора нового пароля</p>
                            </div>
                            <div className="DivChange_PerrAccUs">
                                <button className="ButtChange_PerrAccUs">Сменить пароль</button>
                            </div>
                        </div>    
                    </div>

                    <div className="DivSave_PerAccUs">
                        <button className="ButtSave_PerAccUs">СОХРАНИТЬ ДАННЫЕ</button>
                    </div>
                </div>
                </>
                :<>
                    <div className="GeneralListParticipation_PerAccUs">
                        <h1 className="">Список участий</h1>
                        <div className="ListParticipation_PerAccUs">

                        
                        </div>
                    </div>
                                    
                </>
            }
            </div>
        </>
        
     );
}