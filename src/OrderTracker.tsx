import React from 'react';

interface OrderTrackerProps {
  orderId: string;
  totalAmount: number;
  riderCoords: { lat: number; lng: number };
}

export default function OrderTracker({ orderId, totalAmount, riderCoords }: OrderTrackerProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border shadow-sm mt-4 space-y-4 transition-all">
      {/* Active Tracking Header Indicator */}
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">🚴 Active Order Tracking</h2>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {orderId}</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
          Rider Dispatching
        </span>
      </div>

      {/* Modern Live Visual Progress Flow Timeline */}
      <div className="relative pl-6 space-y-4">
        {/* Continuous Connecting Path Line */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-100"></div>

        {/* Milestone Node 1: Confirmed */}
        <div className="relative">
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
          <p className="text-xs font-bold text-slate-800">Order Placed & Confirmed</p>
          <p className="text-[10px] text-slate-400">Payment successfully logged via zero-fee UPI</p>
        </div>

        {/* Milestone Node 2: Kitchen Packing */}
        <div className="relative">
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
          <p className="text-xs font-bold text-slate-800">Tiffins Prepared & Packed</p>
          <p className="text-[10px] text-slate-400">Fresh breakfast handed over to Warangal runner node</p>
        </div>

        {/* Milestone Node 3: Out for Delivery */}
        <div className="relative">
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-50 animate-ping"></div>
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-50"></div>
          <p className="text-xs font-bold text-slate-700">Rider Commuting to Destination</p>
          <p className="text-[10px] text-slate-400 font-medium">Live telemetry coordinates tracking active below</p>
        </div>
      </div>

      {/* Live Map Representation Card */}
      <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] space-y-2 relative overflow-hidden border shadow-inner">
        {/* Tech Grid Background Graphics Effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">🗺️ Telemetry Map Matrix View:</div>
        
        {/* Dynamic Vector Radar Map Display */}
        <div className="h-24 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col justify-center items-center text-center px-4 relative">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
            Subedari Gateway Router Active
          </span>
          <p className="text-[10px] text-slate-500 max-w-[200px]">
            Lat: {riderCoords.lat.toFixed(5)} <br /> Lng: {riderCoords.lng.toFixed(5)}
          </p>
          <div className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-semibold">
            Dist: ~0.45 km away
          </div>
        </div>

        {/* Financial Split Validation Information */}
        <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[10px]">
          <span>Settlement Value: ₹{totalAmount.toFixed(2)}</span>
          <span className="text-emerald-400">Split Verified ✓</span>
        </div>
      </div>
    </div>
  );
}
