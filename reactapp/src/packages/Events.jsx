import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '..';
import { use } from 'react';
import './OrganizationInfo.css';
import './Events.css';
import TypeImg from '../static/img/TypeImg.png';
import user_icon from '../static/img/user_icon.png';
import { useNavigate } from 'react-router-dom';

function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNum, setPageNum] =  useState(useRef(0)["current"])
    const [pageId, setPageId] = useState(0);
    const [pages, setPage] = useState(0);
    const fetchEvents = async (id) => {
        try {
            const response = await axios.get(`${API_URL}getVerifiedEvents/${id}`);
            setPage(response.data.pages);
            return response.data.events;
        } catch (err) {
            throw err.response ? err.response.data.error : 'Что-то пошло не так';
        }
    };

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const events = await fetchEvents(pageNum);
                setEvents(events);
                setPageId(0);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        console.log(pageId);
        loadEvents();
    }, [pageId, pageNum]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleDescriptionClick = (description) => {
        alert(description);
    };
    console.log(events);
    
    return (
        <div className='wrapper'>
            <Header />
            <Footer />
            <h2>Verified Events</h2>
            <div className='events'>
            {events.map((event) => (
                    <div className="event">
                        <div className="event_top">
                            <div className="date">
                                <p className="day_start">{event.date_start}</p>
                                <p className="day_start">{event.date_end}</p>
                            </div>
                            <div className="event_title">
                                <p className="event_name">{event.name}</p>
                            </div>
                            <div className="event_city">
                                {event.organization ?<p className="event_date">{event.organization.region}</p>: <p className="event_date">Проводиться Онлайн</p>}
                            </div>
                        </div>
                        <div className="event_bottom">
                            <div className="event_type">
                                <img src={TypeImg} alt="" className="event_type_img"/>
                                <p className="event_type_name">{event.type}</p>
                            </div>
                            <div className="event_age_group">
                                <img src={user_icon} alt="" className="event_type_img" />
                                <p className="event_age_group_name">{event.age_group}</p>
                            </div>
                            <button className="event_button" onClick={() => {
                                if (!localStorage.getItem('token')) {
                                    navigate('/Login');
                                    return;
                                }
                                axios.post(API_URL + 'addEventToPerson' , {id: event.id} , {  headers: {'Authorization': 'Token ' + localStorage.getItem('token')}}).then(res => {
                                    const data = res.data
                                    navigate('/PersonalAccountUser');
                                    console.log(data);
                                }).catch(err => {
                                    navigate('/PersonalAccountUser');
                                })
                            }}
                                >Записаться</button>
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
        </div>
    );
}

export default Events;