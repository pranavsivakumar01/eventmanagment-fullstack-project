import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import PrivateRoute from './pages/PrivateRoute';
import Enrollment from './pages/Enrollment';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventProvider from './context/EventContext';
import RegisteredPeople from './pages/RegisteredPeople'; // Add the RegisteredPeople page import

const App = () => {
  return (
    <Router>
      <EventProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/enrollment" element={<Enrollment />} />
          {/* Register route can now accept state */}
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff-dashboard"
            element={
              <PrivateRoute>
                <StaffDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/event/:eventId/registrations"
            element={<RegisteredPeople />}  // RegisteredPeople component to show registered people for a specific event
          />
        </Routes>
      </EventProvider>
    </Router>
  );
};

export default App;
