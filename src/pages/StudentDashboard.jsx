// StudentDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  return <h1 className="text-4xl font-extrabold text-blue-300 mb-4">{displayedText}</h1>;
};

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const [enrolledEvents, setEnrolledEvents] = useState(new Set());
  const { someContextValue } = useContext(EventContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://event-backend-1uul.onrender.com');
        const approvedEvents = response.data.filter(event => event.status === 'Approved');
        setEvents(approvedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleEnrollment = (event) => {
    setEnrolledEvents((prev) => new Set(prev).add(event.name));
    navigate('/enrollment', { state: { event } });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 opacity-30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-20 rounded-full filter blur-2xl animate-pulse"></div>

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto text-center py-8">
        <Typewriter text="Welcome to the Student Dashboard" />
        <p className="text-lg text-gray-400 mb-10">
          Explore and join college events with ease.
        </p>
      </div>

      {/* Event Cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
           <div
           key={index}
           className={`bg-gradient-to-r p-10 rounded-lg shadow-lg transform transition duration-300 ease-in-out 
             ${enrolledEvents.has(event.name) 
               ? 'bg-gradient-to-r from-teal-500 to-indigo-500 scale-105 border-4 border-teal-600 shadow-2xl animate-pulse' 
               : 'hover:bg-gradient-to-r hover:from-teal-500 hover:to-indigo-500 hover:shadow-2xl hover:scale-105'} 
             w-96 sm:w-104 md:w-120`}
         >
           <h3 className="text-2xl font-semibold text-white mb-4">{event.name}</h3>
           <p className="text-gray-300">
             <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
           </p>
           <p className="text-gray-300 mt-4">{event.description}</p>
           <p className="text-sm text-gray-400 mt-4">
             Status:{' '}
             <span className={`${event.status === 'Approved' ? 'text-teal-400' : 'text-gray-400'}`}>
               {enrolledEvents.has(event.name) ? 'Enrolled' : event.status}
             </span>
           </p>
           <button
  className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg py-3 px-6 transition duration-200 ${
    enrolledEvents.has(event.name) 
      ? 'bg-green-500 cursor-not-allowed' 
      : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700'
  }`}
  onClick={() => handleEnrollment(event)}
  disabled={enrolledEvents.has(event.name)}
>
  {enrolledEvents.has(event.name) ? 'Enrolled' : 'Enroll'}
</button>

         </div>
         
          ))}
        </div>

        {/* No Events Message */}
        {events.length === 0 && (
          <p className="text-gray-400 mt-6 text-center">No approved events available at this time.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
