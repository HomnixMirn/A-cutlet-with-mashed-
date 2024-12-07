import './header.css';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import event from '../static/img/event.png';
import region from '../static/img/region.png';
import axios from "axios";
import { API_URL } from '../index';
import { useNavigate } from 'react-router-dom';



function Header() {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Header";
    }, []);
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return;
        }
        axios.get(API_URL + 'personalInfo', {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}}).then(res => {
            const data = res.data
        }).catch(err => {
            console.log(err)
        })
    })
    return (
        <header>
            <Link to={"/"} className="logo"></Link>
            <>  
                <ul className="ul-header">
                    <div className="fix-header">
                        <Link className="Event">
                        <img src={event}  alt='' className="Event-img"/>
                        <h1 className="event-h1">Событие</h1>
                        </Link>
                        <Link className="Region">
                        <img src={region}  alt='' className="Region-img"/>
                        <h1 className="regions-h1">Список регионов</h1>
                        </Link>
                    </div>
                        {localStorage.getItem('token') ?
                        <div className='Personal-profile'> <Link to="/PersonalAccountUser" className="personal_info">Личный кабинет</Link>
                        <button onClick={() => {localStorage.removeItem('token')
                        navigate('/')
                        }} className="register-header">Выход</button>
                        </div> : 
                        <div className='ul-header'>
                        <Link to="/login" className="rounded">Вход</Link>
                        <Link to ="/register" className="register-header">Регистрация</Link>
                    </div>}
                    
                </ul>
            </>
        </header>
    )
}   

export default Header