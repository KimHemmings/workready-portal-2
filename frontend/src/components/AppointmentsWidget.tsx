import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Plus, ChevronRight, X, Download, UserCheck } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  type: 'virtual' | 'in-person';
  location: string;
  notes: string;
}

export const AppointmentsWidget: React.FC = () => {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNotes, setRequestNotes] = useState('');

  const [appointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      title: 'Bi-Weekly Mutual Obligation Catch-Up',
      host: 'Casey Smith (Case Manager)',
      date: '18/09/2026',
      time: '10:30 AM',
      type: 'virtual',
      location: 'https://teams.microsoft.com/l/meetup-join/workready-catchup',
      notes: 'Please bring your updated ATS Resume draft and recent job search logs.'
    },
    {
      id: 'apt-2',
      title: 'Warehouse Logistics Safety Orientation',
      host: 'Straight Up Skills Team',
      date: '22/09/2026',
      time: '01:00 PM',
      type: 'in-person',
      location: 'Straight Up Skills Training Center, Room 4B',
      notes: 'Closed-toe safety shoes required. PPE provided on site.'
    }
  ]);

  const downloadCalendarFile = (appt: Appointment) => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nSUMMARY:${appt.title}\nDESCRIPTION:${appt.notes}\nLOCATION:${appt.location}\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appt.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-extrabold text-base text-[#24083b] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-700" /> Upcoming Appointments & Support Schedule
          </h3>
          <p className="text-xs text-slate-500">Manage virtual, phone, and face-to-face check-ins with your Case Manager.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="px-3.5 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-300" /> Request / Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            onClick={() => setSelectedAppt(appt)}
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50/60 hover:bg-white transition-all cursor-pointer space-y-2 group shadow-2xl/0 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                {appt.host}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 font-black ${
                appt.type === 'virtual' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {appt.type === 'virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {appt.type === 'virtual' ? 'Virtual / Online' : 'In-Person'}
              </span>
            </div>

            <h4 className="font-black text-slate-900 text-sm group-hover:text-purple-900 transition-colors">
              {appt.title}
            </h4>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1 border-t border-slate-200/80">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-purple-700" /> {appt.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-700" /> {appt.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Appointment Details</h3>
              <button onClick={() => setSelectedAppt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500 font-bold block">Event Title</span>
                <span className="font-black text-slate-900 text-sm">{selectedAppt.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-bold block">Host</span>
                  <span className="font-bold text-purple-900">{selectedAppt.host}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Date & Time</span>
                  <span className="font-bold text-slate-800">{selectedAppt.date} at {selectedAppt.time}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1">Location / Join Link</span>
                <p className="p-2.5 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-800 break-all">{selectedAppt.location}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1">Case Manager Agenda Notes</span>
                <p className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-slate-800 leading-relaxed font-medium">{selectedAppt.notes}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => downloadCalendarFile(selectedAppt)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download .ICS Calendar File
              </button>

              {selectedAppt.type === 'virtual' && (
                <a
                  href={selectedAppt.location}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl"
                >
                  Join Meeting Now
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST APPOINTMENT MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Request Case Manager Check-In</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-slate-800">Select Preferred Time & Reason:</label>
              <textarea
                rows={4}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="e.g. Requesting a 15-minute phone catch-up next Tuesday afternoon to review my job search log..."
                className="w-full p-3 border rounded-xl font-medium text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestNotes('');
                  alert('✨ Appointment booking request submitted to your Case Manager queue!');
                }}
                className="px-5 py-2 bg-[#24083b] text-white font-black rounded-xl"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsWidget;