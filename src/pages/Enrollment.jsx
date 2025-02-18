import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Enrollment = () => {
  const location = useLocation();
  const { event } = location.state || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) {
      alert('No event selected!');
      return;
    }

    try {
      const response = await fetch('https://event-backend-1uul.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,  // Assuming event object has an _id field
          name,
          email,
        }),
      });

      if (response.ok) {
        alert('Enrollment successful!');
      } else {
        alert('Error during enrollment');
      }
    } catch (error) {
      console.error('Enrollment submission error:', error);
      alert('Error during enrollment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {event ? (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Enrollment for {event.name}</h1>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p className="mt-2">{event.description}</p>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-400 mb-1" htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1" htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-blue-700 transition duration-200"
            >
              Submit Enrollment
            </button>
          </form>
        </div>
      ) : (
        <p>No event selected.</p>
      )}
    </div>
  );
};

export default Enrollment;
