import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { EventContext } from '../context/EventContext';

const Typewriter = ({ text, speed = 150 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex(index + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [index, text, speed]);

    return <h1 className="text-5xl font-bold text-gradient bg-clip-text mb-6">{displayedText}</h1>;
};

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const { someContextValue } = useContext(EventContext);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://event-backend-1uul.onrender.com');
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleApprove = async (eventId) => {
        try {
            await axios.patch(`http://localhost:5000/api/events/${eventId}`, { status: 'Approved' });
            setEvents((prevEvents) => prevEvents.map(event => event._id === eventId ? { ...event, status: 'Approved' } : event));
        } catch (error) {
            console.error("Error approving event:", error);
        }
    };

    const handleReject = async (eventId) => {
        try {
            await axios.patch(`http://localhost:5000/api/events/${eventId}`, { status: 'Rejected' });
            setEvents((prevEvents) => prevEvents.map(event => event._id === eventId ? { ...event, status: 'Rejected' } : event));
        } catch (error) {
            console.error("Error rejecting event:", error);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600 opacity-30 rounded-full filter blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-500 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center pt-16 pb-8 px-4">
                <Typewriter text="Admin Dashboard" />
                <p className="text-lg text-gray-300 mb-10">Efficiently manage and approve college events.</p>

                <div className="w-full max-w-6xl grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event._id} className="bg-gray-800/70 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                            <h3 className="text-2xl font-semibold text-gradient mb-3">{event.name}</h3>
                            <p className="text-gray-400 mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-gray-400 mb-4">{event.description}</p>
                            <p className="text-sm text-gray-500 mb-4">Status: <span className={`font-semibold ${event.status === 'Approved' ? 'text-green-400' : event.status === 'Rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{event.status || 'Pending Approval'}</span></p>
                            <div className="flex justify-between mt-4">
                                {event.status === 'Pending Approval' && (
                                    <div className="space-x-4">
                                        <button
                                            onClick={() => handleApprove(event._id)}
                                            className="py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-transform duration-300 transform hover:scale-105"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(event._id)}
                                            className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-transform duration-300 transform hover:scale-105"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
