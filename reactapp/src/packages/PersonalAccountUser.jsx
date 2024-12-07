import React, { useState, useEffect } from 'react'
import {API_URL} from '../index'
import Header from '../components/Header'
import Footer from '../components/Footer'
import vector_bottom from '../static/img/стрелка.png';
import Vector from '../static/img/стрелка2.png';
import axios from 'axios';
import './PersonalAccountUser.css'
import TypeImg from '../static/img/TypeImg.png';
import Event from '../static/img/event.png';
import { useNavigate } from 'react-router-dom';

export default function PersonalAccountUser() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');

    const [gender, setGender] = useState('');
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

    const [activeButton, setActiveButton] = useState('profile');

    const [events, setEvents] = useState([]);
    const [popup, setPopup] = useState(false);

    const [lk , setLk] = useState("persona");
    const [notVerified, setNotVerified] = useState([]);
    const navigate = useNavigate();



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
            if (data.user.organization){
                setLk("organization")
                setUser(data.user.organization)
                setEvents(data.user.events)
                axios.get(API_URL + 'getNotVerifiedEvent', {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}}).then(res => {
                    setNotVerified(res.data)
                    console.log(res.data)
                })
            }
            else{
            console.log(data)
            setEmail(data.user.persona.user.username)
            setEvents(data.user.events)
            setUser(data.user.persona)
            console.log(data);
            console.log(data.user.events)
            }
            
        }).catch(err => {
            console.log(err)
        })
    }, [])

    function PostFormPersonal(e){
        e.preventDefault();
        const data = new FormData(e.target);
        const formData = {
            name: data.get('name'),
            id_user: data.get('id_user'),
            fio: data.get('fio'),
            phone: data.get('phone'),
            born_date: data.get('born_date'),
            country: data.get('country'),
            region: data.get('region'),
            city: data.get('city'),
            sex : gender
            
        };
        console.log(formData);
        

        axios.post(API_URL +'redactPersonalInfo', formData, {  
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            console.log('Данные успешно обновлены', res,data);
        })
        .catch(err => {
            console.error('Ошибка при обновлении данных:', err);
        });
    }
    function handleSubmit(e){
        e.preventDefault();
        const data = new FormData(e.target);
        const formData = {
            name: data.get('name'),
            type: data.get('type'),
            date_start: data.get('date_start'),
            date_end: data.get('date_end'),
            age_group: data.get('age_group'),
            
        };
        axios.post(API_URL +'createEvent', formData, {  
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            setPopup(false);
            console.log('Данные успешно добавлены', res,data);
        })
        .catch(err => {
            console.error('Ошибка при добавлении данных:', err);
        });
    }
    
    return (
        <div className="wrapper">
            <Header/>
        {lk === "persona" ?
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
                    <form className='form' action="" method="post" onSubmit={(e) => PostFormPersonal(e)}>
                    <div className="GeneralPublicData_PerAccUs">
                        <div className="PublicData_PerAccUs">
                            <div className="PublicInfo_PerAccUs">
                                <h1 className="h1_PerAccUs">Публичные данные</h1>
                                <p className="p_PerAccUs">данные, которые будут видны остальным пользователям</p>
                            </div>
                            <div className="PublicInfoInputs_PerAccUs">
                                <input type="text" name = 'name' value ={user.name} className="PublicInputName_PerAccUs" placeholder='Придумайте себе имя пользователя' /> 
                                <input type="text" name = 'id_user' value ={user.id_user} className="PublicInputId_PerAccUs" placeholder='Придумайте себе ID состоящий из букв и цифр' />
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
                                <input type="text" name ='fio' value ={user.fio} className="LocalDataInputFIO_PerAccUs" placeholder='Введите ваше ФИО'/> 

                                <div className="DivLocalInfoPhoneBirthday_PerAccUs">
                                    <input type="phone" name='phone' value ={user.phone} className="LocalDataInputPhoneBirthday_PerAccUs" placeholder='Введите ваш номер телефона' /> 
                                    <input type="date" name ='born_date' value ={user.born_date} className="LocalDataInputPhoneBirthday_PerAccUs" placeholder='Введите ваш день рождения' /> 
                                </div>

                                <div className="LocalInfoGender_PerAccUs">
                                    <div className="dropdown-header">
                                        <div className="dropdown_PerAccUs">
                                            <p className="PGender_PerAccUs">{gender || user.sex || 'Ваш пол'}</p>
                                            {isGenderDropdownOpen 
                                                ? <img src = {Vector} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsGenderDropdownOpen)} />
                                                : <img src = {vector_bottom} className = "dropdown-arrow" onClick = {() => toggleDropdown(setIsGenderDropdownOpen)} />
                                            }
                                        </div>
                                        {isGenderDropdownOpen &&(
                                            <ul className="dropdown-list">
                                                <div className='DivDropDownMale_PerAccUs'>
                                                    <li className="DropDownMale_PerAccUs" onClick = {() => selectOption(setGender, setIsGenderDropdownOpen,'Мужчина')}>Мужчина</li>
                                                </div>
                                                <div className='DropDownBorder_PerAccUs'></div>
                                                <div className="DivDropDownFemale_PerAccUs">
                                                    <li className="DropDownFemale_PerAccUs" onClick = {() => selectOption(setGender, setIsGenderDropdownOpen,'Женщина')}>Женщина</li>
                                                </div>
                                            </ul>
                                        )}
                                    </div>
                                    <input type="text" className="LocalInfoEmail_PerAccUs"  value ={email} readOnly placeholder ="Ваша почта"/>
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
                                    <input type="text" name = 'country' value ={user.country} className="LocationInputContry_PerAccUs" placeholder='Введите вашу страну' />
                                    <input type="text" name = 'region' value ={user.region} className="LocationInputRegion_PerAccUs" placeholder='Введите ваш регион' />
                                    <input type="text" name = 'city' value ={user.city} className="LocationInputCity_PerAccUs" placeholder='Введите ваш город' />
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
                        <button className="ButtSave_PerAccUs" type ="submit">СОХРАНИТЬ ДАННЫЕ</button>
                    </div>
                    </form>
                </div>
                </>
                :<>
                    <div className="GeneralListParticipation_PerAccUs">
                            {events.length === 0 ? (
                                <h1 className="h1_notevent">Вы еще нигде не участвовали</h1>
                            ):(
                            events.map((event) =>
                                (<>
                                    <h1 className="h1_Events_PerAccUs">Мои участия:</h1>
                                    <div className="ListParticipation_PerAccUs">
                                    <div className="card_event">
                                        
                                        <div className="left_event">
                                            <p className="h1_event">{event.name}</p>
                                            <div className="type_event">
                                                <img src={TypeImg} alt="" className="event_type_img"/>
                                                <p className="p_event">{event.type}</p>
                                            </div>
                                            <div className="left_bottom_event">
                                                <div className="date_event">
                                                    <img src= {Event} alt="" width="35px" height="35px" />
                                                    <p className="p_event">{event.date_start.split('-')[1]}.{event.date_start.split('-')[2]} - {event.date_end.split('-')[1]}.{event.date_end.split('-')[2]}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="DivGeneralRightEvent">
                                            <div className="right_event">
                                                <button 
                                                    onClick={() => {
                                                        axios.post(API_URL + 'removePersonEvent', {id: event.id} , {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}})
                                                            .then(res => { 
                                                                setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
                                                                }).catch(err =>{
                                                                    console.error("Ошибка при удалении ивента:", err);
                                                                });
                                                            }} 
                                                                className="RightEvent_DeleteButt" >Отменить</button>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </>))
                                
                            )}
                    </div>
                                    
                </>
            }
            </div>
            :
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
                                Наши мероприятия
                        </button>
                        {user.admin === true ?
                    <button 
                        className= {`PartButt_PerAccUs ${activeButton === 'admin'? 'active':''}`} 
                        type = "submit"
                        onClick ={() => setActiveButton('admin')}
                        >
                            валидация мероприятий
                    </button>
                    :null}
                    </div>
                    
                    
                </div>
                {activeButton === 'profile' ?
                <div className="MainDiv_PerAccUs">
                    
                    <div className="PublicInfoPerAccUs">
                        <div className="PublicData_PerAccUs">
                            <div className="PublicInfo_PerAccUs">
                                <h1 className="h1_PerAccUs">Публичные данные</h1>
                                <p className="p_PerAccUs">данные, которые будут видны остальным пользователям</p>
                            </div>
                            <div className="PublicInfoInputs_PerAccUs">
                                <p className="PublicId_PerAccUs">{user.fio}</p>
                                <p className="PublicId_PerAccUs">{user.region}</p>
                                <p className="PublicId_PerAccUs">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <button className="button_create_event" onClick={() => setPopup(true)}>Создать мероприятие</button>
                </div>
                : activeButton === 'participation' ?
                <>
                    <div className="GeneralListParticipation_PerAccUs">
                            {events.length === 0 ? (
                                <h1 className="h1_notevent">Вы еще нигде не участвовали</h1>
                            ):(
                            events.map((event) =>
                                (<>
                                    <h1 className="h1_Events_PerAccUs">Мои участия:</h1>
                                    <div className="ListParticipation_PerAccUs">
                                    <div className="card_event">
                                        
                                        <div className="left_event">
                                            <p className="h1_event">{event.name}</p>
                                            <div className="type_event">
                                                <img src={TypeImg} alt="" className="event_type_img"/>
                                                <p className="p_event">{event.type}</p>
                                            </div>
                                            <div className="left_bottom_event">
                                                <div className="date_event">
                                                    <img src= {Event} alt="" width="35px" height="35px" />
                                                    <p className="p_event">{event.date_start.split('-')[1]}.{event.date_start.split('-')[2]} - {event.date_end.split('-')[1]}.{event.date_end.split('-')[2]}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="DivGeneralRightEvent">
                                            <div className="right_event">
                                                <p className="check_verify">Статус : {event.verify ? "Проверено" : "Не проверено"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </>
                
                            ))
                                
                            )}
                    </div>
                </>
                : <>
                    <div className="MainDiv_PerAccUs">
                        <h1 className="h1_Events_PerAccUs">Вы администратор и можете валидировать мероприятия</h1>

                        <div className="validate_event">
                            {notVerified.length === 0 ? (
                                <h1 className="h1_notevent">В данный момент нет мероприятий для валидации</h1>
                            ):(
                            notVerified.map((event) =>
                                ( event.organization.email !== user.email ?<>
                              
                                    <div className="card_event">
                                        
                                        <div className="left_event">
                                            <p className="h1_event">{event.name}</p>
                                            <div className="type_event">
                                                <img src={TypeImg} alt="" className="event_type_img"/>
                                                <p className="p_event">{event.type}</p>
                                            </div>
                                            <div className="left_bottom_event">
                                                <div className="date_event">
                                                    <img src= {Event} alt="" width="35px" height="35px" />
                                                    <p className="p_event">{event.date_start.split('-')[1]}.{event.date_start.split('-')[2]} - {event.date_end.split('-')[1]}.{event.date_end.split('-')[2]}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="DivGeneralRightEvent">
                                            <div className="right_event">
                                                <button className='button_verify' onClick={() => axios.post(API_URL + 'verifyEvent' , {id : event.id}, {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}}).then(res => {window.location.reload()})}>Подтвердить</button>
                                                <button className='button_verify' onClick={() => axios.post(API_URL + 'deleteEvent' , {id : event.id}, {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}}).then(res => {window.location.reload()})}>Отклонить</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :<></>
                
                            ))
                                
                            )}
                        </div>
                    </div>
                </>
            
            }
            </div>
}
            <Footer/>
            {popup !== false ? 
            <div className="popup">
                <div className="back">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h1 className="popup-title">Создание мероприятия</h1>
                        </div>
                        <form className="popup-body" onSubmit={(e) => handleSubmit(e)}>
                            <input className="popup-input" type="text" name="name" placeholder="Название мероприятия" />
                            <input className="popup-input" type="text" name="type" placeholder="Тип мероприятия" />
                            <input className="popup-input" type="text" name="age_group" placeholder="Введите возрастную группу" />
                            <div className="popup_dates">
                                <input className="dates popup-input" type="date" name="date_start" placeholder="Дата начала" />
                                <input className="dates popup-input" type="date" name="date_end" placeholder="Дата окончания" />
                            </div>
                            <div className="popup-buttons">
                                <button className="popup-button" type="submit">Отправить на рассмотрение</button>
                                <button className="popup-button" onClick={() => setPopup(false)}>Отменить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            : null}
        </div>
        

        
     );
}