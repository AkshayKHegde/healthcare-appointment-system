import React from 'react';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// appointments: array of { id, patient, doctor, appointmentTime, status }
// perspective: 'patient' | 'doctor' | 'receptionist' — controls which name is shown
// actions: optional render prop (appointment) => JSX for row-level buttons
export default function ViewAppointmentsPage({ appointments, perspective = 'receptionist', actions }) {
  if (!appointments || appointments.length === 0) {
    return <div className="empty-state">No appointments yet.</div>;
  }

  return (
    <div>
      {appointments.map((appt) => (
        <div className="list-row" key={appt.id}>
          <div>
            <div style={{ fontWeight: 600 }}>
              {perspective === 'doctor'
                ? `Patient: ${appt.patient?.username ?? 'Unknown'}`
                : `Dr. ${appt.doctor?.username ?? 'Unknown'} · ${appt.doctor?.specialty ?? ''}`}
              {perspective === 'receptionist' && ` — Patient: ${appt.patient?.username ?? 'Unknown'}`}
            </div>
            <div className="meta">{formatDate(appt.appointmentTime)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`status-badge status-${appt.status}`}>{appt.status}</span>
            {actions && actions(appt)}
          </div>
        </div>
      ))}
    </div>
  );
}
