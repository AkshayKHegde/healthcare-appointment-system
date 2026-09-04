import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

// onBooked() is called after a successful booking so the parent can refresh its list
export default function BookAppointmentForm({ patientId, onBooked }) {
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDoctors = async (term) => {
    try {
      const results = await api.searchDoctors(term);
      setDoctors(results);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDoctors('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors(specialty);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!doctorId || !date || !time) {
      setError('Choose a doctor, date, and time.');
      return;
    }
    const appointmentTime = `${date} ${time}:00`;

    setLoading(true);
    try {
      await api.bookAppointmentAsPatient(patientId, doctorId, appointmentTime);
      setSuccess('Appointment booked.');
      setDoctorId('');
      setDate('');
      setTime('');
      onBooked && onBooked();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <label htmlFor="specialty-search">Search by specialty (optional)</label>
          <input
            id="specialty-search"
            placeholder="e.g. Dermatology"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" style={{ alignSelf: 'flex-end', height: 42 }} type="submit">
          Search
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <form onSubmit={handleBook}>
        <div className="field">
          <label htmlFor="doctor-select">Doctor</label>
          <select id="doctor-select" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.username} — {doc.specialty} {doc.availability ? '' : '(unavailable)'}
              </option>
            ))}
          </select>
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

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Booking…' : 'Book appointment'}
        </button>
      </form>
    </div>
  );
}
