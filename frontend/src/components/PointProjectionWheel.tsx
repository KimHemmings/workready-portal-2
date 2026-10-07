import React from 'react';
import { Award, Clock, AlertCircle, Calendar } from 'lucide-react';

interface PointProjectionWheelProps {
  verifiedPoints?: number;
  pendingPoints?: number;
  targetPoints?: number;
}

export const PointProjectionWheel: React.FC<PointProjectionWheelProps> = ({
  verifiedPoints = 45,
  pendingPoints = 0,
  targetPoints = 100
}) => {
  const pointsNeeded = Math.max(0, targetPoints - verifiedPoints);
  const percentage = Math.min(100, Math.round((verifiedPoints / targetPoints) * 100));

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-[#24083b]">PBAS Point Verification & Target Gauge</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black rounded-full flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-700" /> Monthly Reporting Period
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Verified Workforce Australia mutual obligation points confirmed by your Case Manager.</p>
        </div>

        {pointsNeeded > 0 ? (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" /> {pointsNeeded} Points Needed to Target
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-xl text-xs font-black shrink-0 shadow-sm">
            🎉 Monthly PBAS Target Achieved!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Verified Points Top-Arch Gauge */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
            {/* Background Arc */}
            <div className="w-44 h-44 border-[16px] border-slate-200 rounded-full absolute top-0" />
            
            {/* Dynamic Verified Progress Arc */}
            <div 
              className="w-44 h-44 border-[16px] border-transparent border-t-emerald-500 border-r-emerald-500 border-l-emerald-500 rounded-full absolute top-0 transition-transform duration-700"
              style={{
                transform: `rotate(${Math.min(180, (percentage / 100) * 180 - 135)}deg)`
              }}
            />
            
            <div className="z-10 pb-1">
              <span className="text-3xl font-black text-slate-900 block leading-none tracking-tight">{verifiedPoints}</span>
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">/ {targetPoints} Pts</span>
            </div>
          </div>

          <span className="text-xs font-black text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            {percentage}% Verified Target Progress
          </span>
        </div>

        {/* Status Breakdown Cards */}
        <div className="md:col-span-2 space-y-3 text-xs">
          <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-slate-900 block text-xs">Verified Points</span>
                <span className="text-slate-600 font-medium text-[11px]">Confirmed & signed off by Case Manager</span>
              </div>
            </div>
            <span className="font-black text-emerald-700 text-base">{verifiedPoints} Pts</span>
          </div>

          <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-slate-900 block text-xs">Pending Verification</span>
                <span className="text-slate-600 font-medium text-[11px]">Submitted activities awaiting Case Manager assessment</span>
              </div>
            </div>
            <span className="font-extrabold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-lg border border-amber-300 text-xs">
              ⏳ {pendingPoints > 0 ? `${pendingPoints} Items Pending Review` : '0 Items Pending'}
            </span>
          </div>

          <div className="p-4 bg-[#24083b] text-white rounded-xl flex items-center justify-between shadow-md">
            <span className="font-black text-xs">Official Verified Target Claim</span>
            <span className="font-black text-amber-300 text-base">{verifiedPoints} / {targetPoints} Pts</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PointProjectionWheel;