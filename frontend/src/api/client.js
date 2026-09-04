const BASE_URL = 'http://localhost:8080/api';

async function request(path, { method = 'GET', body, params } = {}) {
  let url = `${BASE_URL}${path}`;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    ).toString();
    if (query) url += `?${query}`;
  }

  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // ---- Auth ----
  registerPatient: (payload) => request('/patient/register', { method: 'POST', body: payload }),
  registerDoctor: (payload) => request('/doctor/register', { method: 'POST', body: payload }),
  registerReceptionist: (payload) => request('/receptionist/register', { method: 'POST', body: payload }),
  login: (payload) => request('/user/login', { method: 'POST', body: payload }),

  // ---- Patient ----
  searchDoctors: (specialty) => request('/patient/doctors', { params: { specialty } }),
  bookAppointmentAsPatient: (patientId, doctorId, appointmentTime) =>
    request('/patient/appointment', {
      method: 'POST',
      params: { patientId, doctorId },
      body: { appointmentTime },
    }),
  getPatientAppointments: (patientId) =>
    request('/patient/appointments', { params: { patientId } }),
  getPatientRecords: (patientId) =>
    request('/patient/records', { params: { patientId } }),

  // ---- Doctor ----
  getDoctorAppointments: (doctorId) =>
    request('/doctor/appointments', { params: { doctorId } }),
  setDoctorAvailability: (doctorId, availability) =>
    request('/doctor/availability', { method: 'POST', params: { doctorId, availability } }),
  addMedicalRecord: (patientId, doctorId, notes) =>
    request('/doctor/record', { method: 'POST', params: { patientId, doctorId }, body: { notes } }),

  // ---- Receptionist ----
  getAllAppointments: () => request('/receptionist/appointments'),
  scheduleAppointmentAsReceptionist: (patientId, doctorId, appointmentTime) =>
    request('/receptionist/appointment', {
      method: 'POST',
      params: { patientId, doctorId },
      body: { appointmentTime },
    }),
  rescheduleAppointment: (appointmentId, appointmentTime) =>
    request(`/receptionist/appointment/reschedule/${appointmentId}`, {
      method: 'PUT',
      body: { appointmentTime },
    }),
  cancelAppointment: (appointmentId) =>
    request(`/receptionist/appointment/cancel/${appointmentId}`, { method: 'PUT' }),
};
