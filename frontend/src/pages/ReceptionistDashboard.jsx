import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../api/AuthContext.jsx';
import ViewAppointmentsPage from '../components/ViewAppointmentsPage.jsx';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // schedule form
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scheduleMsg, setScheduleMsg] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // reschedule inline state: { [appointmentId]: { date, time } }
  const [rescheduleDrafts, setRescheduleDrafts] = useState({});

  const loadAppointments = useCallback(async () => {
    setError('');
    try {
      const appts = await api.getAllAppointments();
      setAppointments(appts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setScheduleMsg('');
    if (!patientId || !doctorId || !date || !time) {
      setScheduleMsg('Fill in patient ID, doctor ID, date, and time.');
      return;
    }
    setScheduling(true);
    try {
      await api.scheduleAppointmentAsReceptionist(patientId, doctorId, `${date} ${time}:00`);
      setScheduleMsg('Appointment scheduled.');
      setPatientId('');
      setDoctorId('');
      setDate('');
      setTime('');
      loadAppointments();
    } catch (err) {
      setScheduleMsg(err.message);
    } finally {
      setScheduling(false);
    }
  };

  const updateDraft = (id, field, value) => {
    setRescheduleDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleReschedule = async (id) => {
    const draft = rescheduleDrafts[id];
    if (!draft?.date || !draft?.time) return;
    try {
      await api.rescheduleAppointment(id, `${draft.date} ${draft.time}:00`);
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.cancelAppointment(id);
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Front desk</h1>
        <p>Schedule and reschedule appointments on behalf of patients.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h3>Schedule an appointment</h3>
        {scheduleMsg && (
          <div className={scheduleMsg === 'Appointment scheduled.' ? 'success-banner' : 'error-banner'}>
            {scheduleMsg}
          </div>
        )}
        <form onSubmit={handleSchedule}>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="patientId">Patient ID</label>
              <input id="patientId" type="number" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="doctorId">Doctor ID</label>
              <input id="doctorId" type="number" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="time">Time</label>
              <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <button className="btn" type="submit" disabled={scheduling}>
            {scheduling ? 'Scheduling…' : 'Schedule appointment'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>All appointments</h3>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">No appointments yet.</div>
        ) : (
          <ViewAppointmentsPage
            appointments={appointments}
            perspective="receptionist"
            actions={(appt) => (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="date"
                  style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line)' }}
                  value={rescheduleDrafts[appt.id]?.date || ''}
                  onChange={(e) => updateDraft(appt.id, 'date', e.target.value)}
                />
                <input
                  type="time"
                  style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line)' }}
                  value={rescheduleDrafts[appt.id]?.time || ''}
                  onChange={(e) => updateDraft(appt.id, 'time', e.target.value)}
                />
                <button className="btn btn-secondary" onClick={() => handleReschedule(appt.id)}>
                  Reschedule
                </button>
                <button className="btn btn-danger" onClick={() => handleCancel(appt.id)}>
                  Cancel
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
