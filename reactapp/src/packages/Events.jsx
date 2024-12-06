import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Events({ pageId }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchEvents = async (id) => {
        try {
            const response = await axios.get(`/api/verified-events/?id=${id}`);
            return response.data.events;
        } catch (err) {
            throw err.response ? err.response.data.error : 'Что-то пошло не так';
        }
    };

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const events = await fetchEvents(pageId);
                setEvents(events);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [pageId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleDescriptionClick = (description) => {
        alert(description);
    };

    return (
        <div>
            <Header />
            <Footer />
            <h2>Verified Events</h2>
            <ul>
                {events.map((event) => (
                    <li key={event.id}> 
                        <h3>{event.name}</h3>
                        <p>НАЗВАНИЕ: {event.type}</p>
                        <p>{event.date_start}</p>
                        <p>{event.date_end}</p>
                        <button type='button' onClick={() => handleDescriptionClick(event.description)}>
                            ОПИСАНИЕ
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Events;