import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-700 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600 opacity-30 rounded-full filter blur-2xl animate-pulse"></div>

      {/* Header Section */}
      <header className="relative z-10 w-full text-center py-16">
        <p className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400 mb-6 drop-shadow-lg">
          Welcome to College Event Management
        </p>
        <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
          Organize, manage, and participate in college events effortlessly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/register" className="py-3 px-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-teal-600 transition duration-500 transform hover:scale-105 hover:shadow-xl">
            Get Started
          </Link>
          <Link to="/login" className="py-3 px-8 bg-transparent border border-blue-500 text-blue-400 font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition duration-500 transform hover:scale-105 hover:shadow-xl">
            Login
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 max-w-5xl">
        <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-xl transform hover:scale-105 transition duration-500">
          <h3 className="text-2xl font-semibold text-teal-400">Organize Events</h3>
          <p className="text-gray-300 mt-4">
            Plan and manage college events seamlessly with our robust event management tools.
          </p>
        </div>
        <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-xl transform hover:scale-105 transition duration-500">
          <h3 className="text-2xl font-semibold text-teal-400">Register & Participate</h3>
          <p className="text-gray-300 mt-4">
            Join events with ease. Our streamlined registration keeps you in the loop.
          </p>
        </div>
        <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-xl transform hover:scale-105 transition duration-500">
          <h3 className="text-2xl font-semibold text-teal-400">Analytics & Feedback</h3>
          <p className="text-gray-300 mt-4">
            Get insights into participation and feedback for future event improvements.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <div className="relative z-10 w-full bg-gradient-to-br from-gray-900 to-gray-800 py-16 text-center">
        <div className="text-center text-white max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to make your college events unforgettable?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Our platform has everything you need for an exceptional college event experience.
          </p>
          <Link to="/register" className="py-4 px-10 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-indigo-600 transition duration-500 transform hover:scale-105 hover:shadow-xl">
            Register Now
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 w-full bg-gray-900 py-8 text-center">
        <p className="text-gray-500">© 2024 College Event Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
