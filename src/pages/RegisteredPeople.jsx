import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnrollmentsTable = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get('https://event-backend-1uul.onrender.com');
        setEnrollments(response.data);
      } catch (err) {
        setError('Error fetching enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Enrollments</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Event</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{enrollment.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{enrollment.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {enrollment.eventId ? enrollment.eventId.name : 'N/A'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(enrollment.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentsTable;
