import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '..';
import { use } from 'react';
import './OrganizationInfo.css';
import './userevents.css';
import TypeImg from '../static/img/TypeImg.png';
import user_icon from '../static/img/user_icon.png';
import { useNavigate } from 'react-router-dom';
import loopa from '../static/img/loopa.png';

function UseEvents() {
    const navigate = useNavigate();
    const [report, setReport] = useState([]);
    const [popup, setPopup] = useState(false);
    const [closePopup, setClosePopup] = useState(false);
    const [ended, setEnded] = useState(false);
    const [events,  setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNum, setPageNum] =  useState(useRef(0)["current"])
    const [pages, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const url = new URL(window.location.href);
    const year = url.pathname.split('/')[2];
    const month = url.pathname.split('/')[3];
    const day = url.pathname.split('/')[4];
    const fetchEvents = async (id) => {
        try {
            const response = await axios.get(`${API_URL}getEventsOnDay?search=${search}&month=${month}&year=${year}&day=${day}`);
            setPage(response.data.pages);
            
            return response.data.events;
        } catch (err) {
            throw err.response ? err.response.data.error : 'Что-то пошло не так';
        }
    };


    useEffect(() => {
/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Loads events of the day, specified by the current 'pageNum',
     * and sets the state variables 'events', 'error', and 'loading'
     * accordingly. If an error occurs, sets 'error' to it and
     * 'loading' to false.
     */
/******  e986af1a-3538-4fef-8a30-c7f165aa72aa  *******/        const loadEvents = async () => {
            try {
                const events = await fetchEvents(pageNum);
                setEvents(events);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }

        };

        loadEvents();
    }, [ pageNum,search]);



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleDescriptionClick = (description) => {
        alert(description);
    };
    console.log(events);
    
    return (
        <div className='wrapper'>
            <Header />
            <div className="search_input-even">
            <input type="text" placeholder="Поиск"  className='search' value={search} onChange={(e) => setSearch(e.target.value)}/>
            <div><img src={loopa} alt=""  className="loopa"/></div>
            </div>
            <div className='events'>
            {events.map((event) => (
                    <div className="event">
                        <div className="event_top">
                            <div className="date-use-event">
                                <p className="day_start">{event.date_start.split('-')[1]}.{event.date_start.split('-')[2]} - {event.date_end.split('-')[1]}.{event.date_end.split('-')[2]}</p>

                            </div>
                            <div className="event_title-use">
                                <p className="event_name">{event.name}</p>
                            </div>
                            <div className="event_city">
                                {event.organization ?<p className="event_date">{event.organization.region}</p>: <p className="event_date">Проводиться Онлайн</p>}
                            </div>
                        </div>
                        <div className="event_bottom-useev">
                            <div className="event_type">
                                <img src={TypeImg} alt="" className="event_type_img"/>
                                <p className="event_type_name">{event.type}</p>
                            </div>
                            <div className="event_age_group-ev">
                                <img src={user_icon} alt="" className="event_type_img" />
                                <p className="event_age_group_name">{event.age_group}</p>
                            </div>
                            <div className='button-Sign'>
                            <button className="event_button-opisani"
                                        onClick={() => {
                                            if (!localStorage.getItem('token')) {
                                                navigate('/Login');
                                                return;
                                            }
                                            if (event.ended == 1) {
                                                setPopup (true);
                                            }
                                        }}>
                                    {event.ended == 1 && 'Результаты' || 'Записаться'}
                                </button>
                                {popup && (
                                <div className='popup2'>
                                    <div className="back2">
                                        <div className="popup-content-use">
                                            <h2 className='popup-title'>Результаты события</h2>
                                            <p>{report.event_id}</p>
                                            <p className='popup-description'>{event.description}</p>
                                            <button className='popup-button' onClick={() => setPopup(false)}>Закрыть</button>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='pagination'>
                {Array.from({ length: pages+1 }, (_, index) => index + 1).map((page) => (
                    <button className={page === pageNum+1 ? 'page active' : 'page'} key={page} onClick={() => {setPageNum(page-1); console.log(page)}}>
                        {page}
                    </button>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default UseEvents;