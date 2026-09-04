import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

const ROLES = [
  { key: 'PATIENT', label: 'Patient' },
  { key: 'DOCTOR', label: 'Doctor' },
  { key: 'RECEPTIONIST', label: 'Receptionist' },
];

export default function RegistrationPage() {
  const [role, setRole] = useState('PATIENT');
  const [form, setForm] = useState({ username: '', password: '', email: '', specialty: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'DOCTOR' && !form.specialty.trim()) {
      setError('Please enter a specialty for the doctor account.');
      return;
    }

    setLoading(true);
    try {
      const payload = { username: form.username, password: form.password, email: form.email };
      if (role === 'DOCTOR') payload.specialty = form.specialty;

      if (role === 'PATIENT') await api.registerPatient(payload);
      else if (role === 'DOCTOR') await api.registerDoctor(payload);
      else await api.registerReceptionist(payload);

      setSuccess('Account created. You can now sign in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand">
          <span className="mark">M+</span>
          MediSchedule
        </div>
        <p className="auth-sub">Create an account to get started</p>

        <div className="role-tabs">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.key}
              className={`role-tab ${role === r.key ? 'active' : ''}`}
              onClick={() => setRole(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" value={form.username} onChange={update('username')} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={update('email')} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={update('password')} required minLength={4} />
          </div>

          {role === 'DOCTOR' && (
            <div className="field">
              <label htmlFor="specialty">Specialty</label>
              <input
                id="specialty"
                placeholder="e.g. Cardiology"
                value={form.specialty}
                onChange={update('specialty')}
                required
              />
            </div>
          )}

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account…' : `Register as ${role.toLowerCase()}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
