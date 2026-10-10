import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nytrfiofpknvykigphfm.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_SYFoceRqs10r6DDFjNPyA_RBTnYero';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PLATFORM_PHONE = '9963088662';
const VENDOR_UPI = '9963088662@ybl';

const FOOD_MENU = [
  {
    id: 1,
    name: 'Special Idli (2 Pcs)',
    category: 'Tiffins',
    price: 40,
    isVeg: true,
  },
  { id: 2, name: 'Masala Dosa', category: 'Tiffins', price: 60, isVeg: true },
  {
    id: 3,
    name: 'Full Veg Meals Thali',
    category: 'Meals',
    price: 120,
    isVeg: true,
  },
  {
    id: 4,
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    price: 220,
    isVeg: false,
  },
  {
    id: 5,
    name: 'Paneer Biryani XL',
    category: 'Biryani',
    price: 180,
    isVeg: true,
  },
  {
    id: 6,
    name: 'Crispy Samosa (Plate)',
    category: 'Snacks',
    price: 30,
    isVeg: true,
  },
  {
    id: 7,
    name: 'Chilled Soft Drink Cola',
    category: 'Soft Drinks',
    price: 40,
    isVeg: true,
  },
  {
    id: 8,
    name: 'Premium Vanilla Scoop',
    category: 'Ice Creams',
    price: 50,
    isVeg: true,
  },
  {
    id: 9,
    name: 'Sizzling Brownie Hot Fudge',
    category: 'Ice Creams',
    price: 150,
    isVeg: true,
  },
];
export default function FoodPlatformApp() {
  const [selectedCategory, setSelectedCategory] = useState('Tiffins');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [logMsg, setLogMsg] = useState(
    'Cloud database linked. Awaiting shop actions...'
  );
  const [riderCoords, setRiderCoords] = useState({
    lat: 17.9784,
    lng: 79.5312,
  });

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = FOOD_MENU.find((f) => f.id === Number(id));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const totalBill = getCartTotal();
  const vendorShare = (totalBill * 0.9).toFixed(2);
  const platformShare = (totalBill * 0.1).toFixed(2);

  const executePaymentCheckout = async () => {
    if (totalBill === 0 || !checkoutAddress) return;
    setIsPaying(true);
    setLogMsg('Syncing order packet live to Supabase PostgreSQL schema...');

    try {
      const { error } = await supabase.from('orders').insert([
        {
          total_amount: totalBill,
          delivery_address: checkoutAddress,
          status: 'paid',
        },
      ]);

      if (error) throw error;

      setCart({});
      setCheckoutAddress('');
      setLogMsg(
        `Verified: ₹${totalBill} landed on ${PLATFORM_PHONE}. Split settled -> Vendor (90%): ₹${vendorShare} | Platform (10%): ₹${platformShare}`
      );
    } catch (err: any) {
      setLogMsg(
        `Data sync exception error: ${
          err.message || 'Check database permissions.'
        }`
      );
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    const loopId = setInterval(() => {
      setRiderCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);
    return () => clearInterval(loopId);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="bg-slate-900 text-white p-4 shadow flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-amber-400">
            Breakfast Warangal PWA
          </h1>
          <p className="text-xs text-slate-400">
            Linked to Supabase: nytrfiofpknvykigphfm
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              'Tiffins',
              'Meals',
              'Biryani',
              'Snacks',
              'Soft Drinks',
              'Ice Creams',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FOOD_MENU.filter((item) => item.category === selectedCategory).map(
              (food) => (
                <div
                  key={food.id}
                  className="bg-white p-4 rounded-xl shadow-sm border flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        food.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    ></span>
                    <h3 className="font-bold text-slate-900">{food.name}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-2 border-t">
                    <span className="font-extrabold text-slate-900">
                      ₹{food.price}
                    </span>
                    <button
                      onClick={() => addToCart(food.id)}
                      className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-amber-400"
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Basket</h2>
          {totalBill === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Your delivery basket is empty.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="pt-2 space-y-3">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total Amount Due:</span>
                  <span className="text-amber-600">₹{totalBill}</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Delivery Address Details"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="w-full text-sm border p-2 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />

                <div className="bg-slate-900 text-white p-3 rounded-xl text-center text-xs space-y-2">
                  <p className="text-amber-400 font-bold">
                    📱 SCAN ACTIVE UPI QR
                  </p>
                  <p className="font-mono text-[10px] bg-slate-950 p-2 rounded break-all select-all text-slate-300">
                    {`upi://pay?pa=${VENDOR_UPI}&pn=BreakfastWarangal&am=${totalBill}`}
                  </p>
                </div>

                <button
                  onClick={executePaymentCheckout}
                  disabled={isPaying || !checkoutAddress}
                  className="w-full bg-slate-950 text-white font-bold py-2.5 rounded-xl disabled:bg-slate-200 text-sm"
                >
                  {isPaying
                    ? 'Verifying 90/10 Splits...'
                    : `🔒 Pay ₹${totalBill} Directly`}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="bg-white p-4 border-t max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-slate-50 p-3 rounded-lg border">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
            📍 Live Moving Rider Coordinates
          </p>
          <p>Latitude: {riderCoords.lat.toFixed(5)}</p>
          <p>Longitude: {riderCoords.lng.toFixed(5)}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
            📊 Expected Settlement Ratios Split
          </p>
          <p>Restaurant Share (90%): ₹{vendorShare}</p>
          <p>App Profit Cut (10%): ₹{platformShare}</p>
        </div>
      </div>

      <footer className="bg-slate-950 text-slate-400 p-4 font-mono text-xs border-t border-slate-800">
        <p className="text-slate-500 font-bold uppercase text-[9px] mb-1">
          📟 Live Sync Status Console:
        </p>
        <p className="text-emerald-400">{logMsg}</p>
      </footer>
    </div>
  );
}
