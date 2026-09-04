import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../api/AuthContext.jsx';
import ViewAppointmentsPage from '../components/ViewAppointmentsPage.jsx';
import DoctorAvailabilityForm from '../components/DoctorAvailabilityForm.jsx';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [recordPatientId, setRecordPatientId] = useState('');
  const [recordNotes, setRecordNotes] = useState('');
  const [recordSaving, setRecordSaving] = useState(false);
  const [recordMessage, setRecordMessage] = useState('');

  const loadAppointments = useCallback(async () => {
    setError('');
    try {
      const appts = await api.getDoctorAppointments(user.id);
      setAppointments(appts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setRecordMessage('');
    if (!recordPatientId || !recordNotes.trim()) {
      setRecordMessage('Enter a patient ID and notes.');
      return;
    }
    setRecordSaving(true);
    try {
      await api.addMedicalRecord(recordPatientId, user.id, recordNotes);
      setRecordMessage('Record added.');
      setRecordPatientId('');
      setRecordNotes('');
    } catch (err) {
      setRecordMessage(err.message);
    } finally {
      setRecordSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dr. {user.username}</h1>
        <p>Manage your availability, appointments, and patient records.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3>Availability</h3>
        <DoctorAvailabilityForm doctorId={user.id} initialAvailability={true} />
      </div>

      <div className="card">
        <h3>Your appointments</h3>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : (
          <ViewAppointmentsPage appointments={appointments} perspective="doctor" />
        )}
      </div>

      <div className="card">
        <h3>Add a patient record</h3>
        {recordMessage && (
          <div className={recordMessage === 'Record added.' ? 'success-banner' : 'error-banner'}>
            {recordMessage}
          </div>
        )}
        <form onSubmit={handleAddRecord}>
          <div className="field">
            <label htmlFor="patientId">Patient ID</label>
            <input
              id="patientId"
              type="number"
              value={recordPatientId}
              onChange={(e) => setRecordPatientId(e.target.value)}
              placeholder="e.g. 3"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              rows={4}
              value={recordNotes}
              onChange={(e) => setRecordNotes(e.target.value)}
              placeholder="Diagnosis, treatment plan, follow-up instructions…"
              required
            />
          </div>
          <button className="btn" type="submit" disabled={recordSaving}>
            {recordSaving ? 'Saving…' : 'Save record'}
          </button>
        </form>
      </div>
    </div>
  );
}
