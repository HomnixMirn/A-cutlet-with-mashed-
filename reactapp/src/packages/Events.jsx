import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '..';
import { use } from 'react';

function Events() {
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
        <div>
            <Header />
            <Footer />
            <h2>Verified Events</h2>
            <div className='events'>
                {events.map((event) => (
                    <div className='card' key={event.id}> 
                    
                        <h3>{event.name}</h3>
                        <p>НАЗВАНИЕ: {event.type}</p>
                        <p>{event.date_start}</p>
                        <p>{event.date_end}</p>
                        <button type='button' onClick={() => handleDescriptionClick(event.description)}>
                            ОПИСАНИЕ
                        </button>
                    </div>
                ))}
            </div>
            <div className='pagination'>
                {Array.from({ length: pages+1 }, (_, index) => index + 1).map((page) => (
                    <button key={page} onClick={() => {setPageNum(page-1); console.log(page)}}>
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Events;