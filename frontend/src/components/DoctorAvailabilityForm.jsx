import React, { useState } from 'react';
import { api } from '../api/client.js';

export default function DoctorAvailabilityForm({ doctorId, initialAvailability, onUpdated }) {
  const [available, setAvailable] = useState(initialAvailability);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggle = async () => {
    setError('');
    setSaving(true);
    const next = !available;
    try {
      await api.setDoctorAvailability(doctorId, next);
      setAvailable(next);
      onUpdated && onUpdated(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className={`status-badge ${available ? 'status-SCHEDULED' : 'status-CANCELLED'}`}>
          {available ? 'Accepting appointments' : 'Not available'}
        </span>
        <button className="btn btn-secondary" onClick={toggle} disabled={saving}>
          {saving ? 'Updating…' : available ? 'Mark as unavailable' : 'Mark as available'}
        </button>
      </div>
    </div>
  );
}
