import React, { useState, useEffect } from 'react';
import { useCheckout } from './hooks/useCheckout';
import OrderTracker from './OrderTracker';

// 1. GLOBAL ENVIRONMENT STRINGS
const VENDOR_UPI = '9963088662@ybl';

// 2. STATIC TIFFIN MASTER DIRECTORY
const FOOD_MENU = [
  { id: 1, name: 'Special Idli (2 Pcs)', price: 40, category: 'Tiffins' },
  { id: 2, name: 'Masala Dosa', price: 60, category: 'Tiffins' }
];

export default function FoodPlatformApp() {
  // 3. REACT STATE LOGIC HOOKS
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [checkoutAddress, setCheckoutAddress] = useState('Subedari, Hanamkonda, Warangal');
  const [riderCoords, setRiderCoords] = useState({ lat: 17.97827, lng: 79.53191 });
  const [logMsg, setLogMsg] = useState('Cloud database linked. Awaiting shop actions...');
  const [activeOrder, setActiveOrder] = useState<{ id: string; total: number } | null>(null);

  // 4. CUSTOM DATABASE UPI INTEGRATION HOOK
  const { processCheckout, loading, error } = useCheckout();

  // 5. LIVE MOCK COORDINATE POLLING PIPELINE
  useEffect(() => {
    const coordInterval = setInterval(() => {
      setRiderCoords(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lng: prev.lng + (Math.random() - 0.5) * 0.0001
      }));
    }, 4000);
    return () => clearInterval(coordInterval);
  }, []);

  // 6. FINANCIAL TRANSACTION CALCULATIONS
  const totalBill = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = FOOD_MENU.find((f) => f.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const vendorShare = (totalBill * 0.90).toFixed(2);
  const platformShare = (totalBill * 0.10).toFixed(2);

  // 7. CART UTILITIES
  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setLogMsg(`Updated item quantities in checkout matrix successfully.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Dynamic Header Component */}
      <header className="bg-white border-b sticky top-0 z-50 px-4 py-3 shadow-sm flex justify-between items-center max-w-md mx-auto">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Breakfast Warangal PWA</h1>
          <p className="text-xs text-slate-400 font-medium">Linked to Supabase: nytrfiofpknyvkigphfm</p>
        </div>
      </header>

      {/* Main Core Viewport Panel */}
      <main className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Navigation Filter Badges */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {['Tiffins', 'Meals', 'Biryani', 'Snacks', 'Soft Drinks', 'Ice Creams'].map((cat, idx) => (
            <span key={cat} className={`px-3 py-1.5 rounded-full font-semibold border whitespace-nowrap cursor-pointer transition ${idx === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* Hot Menu Showcase List Grid */}
        <div className="space-y-3">
          {FOOD_MENU.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center transition hover:shadow-md">
              <div>
                <h3 className="font-bold text-slate-800 text-base">{item.name}</h3>
                <p className="text-sm font-semibold text-emerald-600 mt-0.5">₹{item.price}</p>
              </div>
              <button onClick={() => addToCart(item.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 text-xs rounded-xl transition active:scale-95 border flex items-center gap-1">
                ADD <span className="text-slate-400">+</span>
              </button>
            </div>
          ))}
        </div>

        {/* Core Live Shopping Basket Integration Card */}
        <div className="bg-white p-4 rounded-2xl border shadow-sm">
          <h2 className="text-lg font-black text-slate-800 border-b pb-2 tracking-tight">Your Basket</h2>
          
          {Object.keys(cart).length > 0 ? (
            <div className="mt-3 space-y-3">
              {/* Dynamic Summary Breakdown list */}
              <div className="space-y-2">
                {Object.entries(cart).map(([id, qty]) => {
                  const item = FOOD_MENU.find((f) => f.id === Number(id));
                  if (!item || qty <= 0) return null;
                  return (
                    <div key={id} className="flex justify-between text-sm font-medium text-slate-600">
                      <span>{item.name} × {qty}</span>
                      <span className="text-slate-800">₹{(item.price * qty).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Node Address Input Box */}
              <div className="pt-2 border-t">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  📍 Delivery Destination
                </label>
                <input
                  type="text"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  placeholder="Type dispatch coordinate street info..."
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition font-medium"
                />
              </div>

              {/* Live Telemetry Moving Rider Node Coordinates Display */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-semibold text-slate-600 border border-slate-100">
                <div className="flex items-center gap-1 text-slate-700">
                  <span className="animate-ping w-1.5 h-1.5 rounded-full bg-red-500 inline-block mr-1"></span>
                  Live Moving Rider Coordinates:
                </div>
                <div className="pl-3.5 text-slate-500 font-mono text-[11px] space-y-0.5">
                  <div>Latitude: {riderCoords.lat.toFixed(5)}</div>
                  <div>Longitude: {riderCoords.lng.toFixed(5)}</div>
                </div>
              </div>

              {/* Expected Operational Settlement Splits Calculation Showcase */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-semibold text-slate-600 border border-slate-100">
                <div className="text-slate-700">📊 Expected Settlement Ratios Split:</div>
                <div className="pl-3.5 space-y-0.5 text-slate-500">
                  <div className="flex justify-between">
                    <span>Restaurant Share (90%):</span>
                    <span className="text-slate-700 font-bold">₹{vendorShare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>App Profit Cut (10%):</span>
                    <span className="text-slate-700 font-bold">₹{platformShare}</span>
                  </div>
                </div>
              </div>

              {/* Zero-Fee Production Ready UPI Executive Button */}
              <button
                onClick={async () => {
                  const itemsArray = Object.entries(cart)
                    .map(([id, qty]) => {
                      const item = FOOD_MENU.find((f) => f.id === Number(id));
                      return { id, name: item?.name || 'Item', price: item?.price || 0, quantity: qty };
                    })
                    .filter(item => item.quantity > 0);

                  const res = await processCheckout({
                    cartItems: itemsArray,
                    totalAmount: totalBill,
                    restaurantId: 'warangal-central-001',
                    vendorUpiId: VENDOR_UPI,
                    vendorName: 'Breakfast Warangal'
                  });

                  if (res && res.success) {
                    setActiveOrder({ id: res.orderId, total: totalBill });
                    setLogMsg(`Order logged securely. Active delivery pipeline running.`);
                  }
                }}
                disabled={loading || !checkoutAddress}
                className={`w-full text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 mt-2 tracking-wide text-sm ${
                  loading || !checkoutAddress
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                }`}
              >
                {loading ? '🚀 Connecting UPI Apps...' : `Pay ₹${totalBill} via UPI`}
              </button>

              {/* Live Real-time Database Error Exception Message Banner */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl font-medium text-center">
                  ⚠️ Database Sync Error: {error}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium py-6 text-center italic">Your delivery basket is empty. Add hot fresh tiffins above to start!</p>
          )}
        </div>

        {/* Live Active Delivery Tracker Interface Component Module */}
        {activeOrder && (
          <OrderTracker 
            orderId={activeOrder.id} 
            totalAmount={activeOrder.total} 
            riderCoords={riderCoords} 
          />
        )}
      </main>

      {/* Persistent Operations System Debug Console Log Footer */}
      <footer className="bg-slate-900 text-slate-400 p-4 mt-8 max-w-md mx-auto rounded-t-2xl border-t border-slate-800 text-[11px] font-mono shadow-xl">
        <div className="text-slate-500 uppercase text-[9px] font-bold tracking-wider mb-1">💻 Live Sync Status Console:</div>
        <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          {logMsg}
        </p>
      </footer>
    </div>
  );
}
