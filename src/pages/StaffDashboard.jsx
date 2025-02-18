import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { EventContext } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';

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

  return <h1 className="text-4xl font-extrabold text-blue-400 mb-6">{displayedText}</h1>;
};

const StaffDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '' });
  const { someContextValue } = useContext(EventContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://event-backend-1uul.onrender.com');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://event-backend-1uul.onrender.com', newEvent);
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setNewEvent({ name: '', date: '', description: '' });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleShowRegistrations = (eventId) => {
    navigate(`/event/${eventId}/registrations`);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full filter blur-2xl animate-pulse"></div>
      
      <div className="relative z-10 text-center py-8">
        <Typewriter text="Welcome to the Staff Dashboard" />
        <p className="text-lg text-gray-300 mb-12">Manage and organize college events efficiently.</p>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg mb-12 border border-gray-700">
        <h2 className="text-2xl font-semibold text-blue-400 mb-6">Create a New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Event Date</label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105"
          >
            Submit for Approval
          </button>
        </form>
      </div>

      <div className="relative z-10 grid gap-6 w-full max-w-5xl mx-auto p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105"
          >
            <h3 className="text-xl font-bold text-blue-300 mb-2">{event.name}</h3>
            <p className="text-gray-400">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mt-2">{event.description}</p>
            <p className="text-sm text-green-400 mt-2">Status: {event.status || 'Pending Approval'}</p>
            {event.status === 'Approved' && (
              <button
                onClick={() => handleShowRegistrations(event._id)}
                className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
              >
                Show Registered People
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
