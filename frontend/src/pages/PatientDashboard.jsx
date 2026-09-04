import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../api/AuthContext.jsx';
import BookAppointmentForm from '../components/BookAppointmentForm.jsx';
import ViewAppointmentsPage from '../components/ViewAppointmentsPage.jsx';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setError('');
    try {
      const [appts, recs] = await Promise.all([
        api.getPatientAppointments(user.id),
        api.getPatientRecords(user.id),
      ]);
      setAppointments(appts);
      setRecords(recs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome back, {user.username}</h1>
        <p>Book appointments and keep track of your care.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3>Book an appointment</h3>
        <BookAppointmentForm patientId={user.id} onBooked={loadAll} />
      </div>

      <div className="card">
        <h3>Your appointments</h3>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : (
          <ViewAppointmentsPage appointments={appointments} perspective="patient" />
        )}
      </div>

      <div className="card">
        <h3>Medical records</h3>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : records.length === 0 ? (
          <div className="empty-state">No medical records yet.</div>
        ) : (
          records.map((rec) => (
            <div className="list-row" key={rec.id}>
              <div>
                <div style={{ fontWeight: 600 }}>Dr. {rec.doctor?.username}</div>
                <div className="meta">{rec.notes}</div>
              </div>
              <div className="meta">{new Date(rec.date).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
