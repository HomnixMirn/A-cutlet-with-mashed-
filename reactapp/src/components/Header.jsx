import './header.css';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import event from '../static/img/event.png';
import region from '../static/img/region.png';


function Header() {
    useEffect(() => {
        document.title = "Header";
    }, []);
    return (
        <header>
            <Link className="logo"></Link>
            <>  
                <ul className="ul-header">
                    <Link className="Event">
                    <img src={event}  alt='' className="Event-img"/>
                    <h1 className="event-h1">Событие</h1>
                    </Link>
                    <Link className="Region">
                    <img src={region}  alt='' className="Region-img"/>
                    <h1 className="regions-h1">Список регионов</h1>
                    </Link>
                    <Link className="personal_info">Вход</Link>
                    <Link className="register-header">Регистрация</Link>
                </ul>
            </>
        </header>
    )
}   

export default Header