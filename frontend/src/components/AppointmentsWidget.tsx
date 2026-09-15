import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, UserCheck, Plus } from 'lucide-react';

export interface AppointmentItem {
  id: string;
  title: string;
  type: 'Case Manager Check-In' | 'Job Interview' | 'Training Session';
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  hostName: string;
}

export const AppointmentsWidget: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([
    {
      id: 'apt-1',
      title: 'Bi-Weekly Mutual Obligation Catch-Up',
      type: 'Case Manager Check-In',
      date: '18/09/2026',
      time: '10:30 AM',
      location: 'Straight Up Training Hub / Video Call',
      isVirtual: true,
      hostName: 'Casey Smith (Case Manager)',
    },
    {
      id: 'apt-2',
      title: 'Warehouse Logistics Safety Orientation',
      type: 'Training Session',
      date: '22/09/2026',
      time: '01:00 PM',
      location: 'Training Room B',
      isVirtual: false,
      hostName: 'Straight Up Skills Team',
    },
  ]);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAptTitle, setSelectedAptTitle] = useState('');

  const handleRescheduleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRescheduleModal(false);
    alert(`💬 Reschedule request for "${selectedAptTitle}" sent directly to Casey.`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">Upcoming Appointments & Support Schedule</h2>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {appointments.length} Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of upcoming Case Manager check-ins, interviews, and face-to-face workshops.
          </p>
        </div>

        <button
          onClick={() => alert("📅 Appointment Schedule Request sent to Casey (Case Manager).")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> + Add / Schedule Appointment
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="p-4 border border-slate-200 hover:border-purple-300 rounded-xl bg-slate-50/50 flex flex-col justify-between space-y-3 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                apt.type === 'Case Manager Check-In'
                  ? 'bg-purple-50 text-[#24083b] border-purple-200'
                  : apt.type === 'Job Interview'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {apt.type}
              </span>

              {apt.isVirtual ? (
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-purple-600" /> Virtual / Online
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> In-Person
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{apt.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" /> Host: {apt.hostName}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1 text-purple-900 font-bold">
                <Calendar className="w-3.5 h-3.5 text-purple-700" /> {apt.date}
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
              </span>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setSelectedAptTitle(apt.title);
                  setShowRescheduleModal(true);
                }}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
              >
                Request Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRescheduleRequest} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Request Reschedule 🗓️</h3>
              <button type="button" onClick={() => setShowRescheduleModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <p className="text-slate-500">
              Send a note to Casey regarding <strong>"{selectedAptTitle}"</strong>:
            </p>

            <textarea
              required
              rows={3}
              placeholder="Provide a preferred alternative date or time..."
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowRescheduleModal(false)} className="px-4 py-2 font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#24083b] text-white font-bold rounded-xl shadow-sm">
                Send Request
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AppointmentsWidget;
