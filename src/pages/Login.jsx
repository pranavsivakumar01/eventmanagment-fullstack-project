import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://event-backend-1uul.onrender.com', { email, password });
      localStorage.setItem('token', res.data.token);
      const userRole = res.data.role;

      if (userRole === 'student') {
        window.location.href = '/student-dashboard';
      } else if (userRole === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/staff-dashboard';
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed', error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post('https://event-backend-1uul.onrender.com', { email: forgotPasswordEmail });
      setResetMessage(res.data.message || 'Check your email for the reset link!');
      setForgotPasswordEmail('');
    } catch (error) {
      setResetMessage('Failed to send reset link. Please try again.');
      console.error('Error sending reset link', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Background Animations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 opacity-25 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-white opacity-20 rounded-full filter blur-2xl animate-pulse"></div>

      <div className="relative z-10 bg-black/80 backdrop-blur-lg shadow-xl rounded-lg p-8 max-w-md w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 mb-8">
          Event Management Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-500 transform hover:-translate-y-1 hover:shadow-xl"
            >
              Login
            </button>
            <button
              type="button"
              className="text-blue-400 hover:underline ml-4"
              onClick={() => setIsModalOpen(true)}
            >
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Sign Up</Link></p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Reset Password</h3>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>
            {resetMessage && <p className="text-green-500 mt-2 text-center">{resetMessage}</p>}
            <button
              className="mt-4 text-red-500 hover:underline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
