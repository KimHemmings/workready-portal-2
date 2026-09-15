import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, Phone, UserCheck, Plus } from 'lucide-react';

export interface AppointmentItem {
  id: string;
  title: string;
  type: 'Case Manager Check-In' | 'Job Interview' | 'Training Session';
  mode: 'Virtual / Online' | 'Phone Call' | 'In-Person';
  date: string;
  time: string;
  hostName: string;
}

export const AppointmentsWidget: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'apt-1',
      title: 'Bi-Weekly Mutual Obligation Catch-Up',
      type: 'Case Manager Check-In',
      mode: 'Virtual / Online',
      date: '18/09/2026',
      time: '10:30 AM',
      hostName: 'Casey Smith (Case Manager)',
    },
    {
      id: 'apt-2',
      title: 'Warehouse Logistics Safety Orientation',
      type: 'Training Session',
      mode: 'In-Person',
      date: '22/09/2026',
      time: '01:00 PM',
      hostName: 'Straight Up Skills Team',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AppointmentItem['type']>('Job Interview');
  const [newMode, setNewMode] = useState<AppointmentItem['mode']>('Virtual / Online');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      title: newTitle,
      type: newType,
      mode: newMode,
      date: newDate,
      time: newTime || '09:00 AM',
      hostName: 'Casey Smith / Employer',
    };

    setAppointments((prev) => [newApt, ...prev]);
    setShowAddModal(false);
    setNewTitle(''); setNewDate(''); setNewTime('');
    alert(`🗓️ Appointment "${newTitle}" added to your schedule!`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#24083b]">Upcoming Appointments & Support Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage virtual, phone, and face-to-face check-ins.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> + Add / Schedule Appointment
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-4 border border-slate-200 hover:border-purple-300 rounded-xl bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-purple-50 text-[#24083b] border-purple-200">
                {apt.type}
              </span>

              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                {apt.mode === 'Virtual / Online' && <Video className="w-3.5 h-3.5 text-purple-600" />}
                {apt.mode === 'Phone Call' && <Phone className="w-3.5 h-3.5 text-blue-600" />}
                {apt.mode === 'In-Person' && <MapPin className="w-3.5 h-3.5 text-amber-600" />}
                {apt.mode}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{apt.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" /> Host: {apt.hostName}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-purple-900">
                <Calendar className="w-3.5 h-3.5 text-purple-700" /> {apt.date}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Schedule New Appointment 🗓️</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointment Title *</label>
                <input required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Second Round Interview with Apex" className="w-full p-2.5 border rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select value={newType} onChange={(e) => setNewType(e.target.value as any)} className="w-full p-2.5 border rounded-xl">
                    <option value="Job Interview">Job Interview</option>
                    <option value="Case Manager Check-In">Case Manager Check-In</option>
                    <option value="Training Session">Training Session</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode / Location *</label>
                  <select value={newMode} onChange={(e) => setNewMode(e.target.value as any)} className="w-full p-2.5 border rounded-xl">
                    <option value="Virtual / Online">Virtual / Online</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="In-Person">In-Person Site Visit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input required type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input type="text" value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="e.g. 10:00 AM" className="w-full p-2.5 border rounded-xl" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#24083b] text-white font-bold rounded-xl shadow-sm">Save Appointment</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AppointmentsWidget;
