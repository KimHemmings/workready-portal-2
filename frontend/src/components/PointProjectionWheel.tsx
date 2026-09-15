import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface PointProjectionProps {
  verifiedPoints: number;
  pendingPoints: number;
  targetPoints?: number;
  daysRemainingInPeriod?: number;
}

export const PointProjectionWheel: React.FC<PointProjectionProps> = ({
  verifiedPoints,
  pendingPoints,
  targetPoints = 100,
  daysRemainingInPeriod = 12,
}) => {
  const totalProjected = verifiedPoints + pendingPoints;
  const verifiedPct = Math.min(Math.round((verifiedPoints / targetPoints) * 100), 100);
  const pendingPct = Math.min(Math.round((pendingPoints / targetPoints) * 100), 100 - verifiedPct);
  const totalPct = Math.min(verifiedPct + pendingPct, 100);

  const isTargetMet = totalProjected >= targetPoints;
  const pointsShort = Math.max(targetPoints - totalProjected, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">PBAS Point Projection & Target Wheel</h2>
            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {daysRemainingInPeriod} Days Left in Reporting Period
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time projection of your monthly Workforce Australia mutual obligation points.
          </p>
        </div>

        {isTargetMet ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Target On Track! 🎉
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 font-bold text-xs rounded-xl border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" /> {pointsShort} Points Needed
          </div>
        )}
      </div>

      {/* Projection Graphic & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Visual Progress Wheel Representation */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Ring */}
              <path
                className="text-slate-200"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Pending Points Arc */}
              <path
                className="text-amber-400 stroke-current transition-all duration-700"
                strokeWidth="3.8"
                strokeDasharray={`${totalPct}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Verified Points Arc */}
              <path
                className="text-[#16a34a] stroke-current transition-all duration-700"
                strokeWidth="3.8"
                strokeDasharray={`${verifiedPct}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <div className="absolute text-center">
              <span className="text-2xl font-black text-[#24083b]">{totalProjected}</span>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">/ {targetPoints} Pts</span>
            </div>
          </div>
        </div>

        {/* Breakdown Breakdown Stat Cards */}
        <div className="md:col-span-2 space-y-3">
          
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500 text-white rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Verified Points</div>
                <div className="text-[11px] text-slate-500">Confirmed by Case Manager</div>
              </div>
            </div>
            <span className="font-black text-[#16a34a] text-sm">{verifiedPoints} Pts</span>
          </div>

          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-white rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Pending Verification</div>
                <div className="text-[11px] text-slate-500">Job searches & interviews awaiting sign-off</div>
              </div>
            </div>
            <span className="font-black text-amber-600 text-sm">+{pendingPoints} Pts</span>
          </div>

          <div className="p-3.5 bg-purple-50/60 border border-purple-200/80 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#24083b] text-white rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Total Projected End-of-Month Status</div>
                <div className="text-[11px] text-slate-500">Combined Verified + Submitted activities</div>
              </div>
            </div>
            <span className="font-black text-[#24083b] text-sm">{totalProjected} / {targetPoints} Pts</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PointProjectionWheel;
