import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://supabase.co',
  'sb_publishable_SYfoceRqs10rgDDFjnpYA_R0tNyEYo'
);

function InternalOrderTracker() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8932',
      customerName: 'Customer Node',
      totalAmount: 50,
      deliveryAddress: 'Subedari, Hanamkonda',
      overallStatus: 'Processing',
      legs: [{ id: 'leg-1', vendorName: 'Balaji Food Court', region: 'Hanamkonda', status: 'Arrived at Vendor' }]
    }
  ]);

  const updateLegStatus = (orderId: string, legId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const updatedLegs = order.legs.map(leg => leg.id === legId ? { ...leg, status: newStatus } : leg);
      const allPickedUp = updatedLegs.every(l => l.status === 'Food Picked Up');
      return { ...order, legs: updatedLegs, overallStatus: allPickedUp ? 'Out for Delivery' : 'Processing' as any };
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-xl mx-auto my-6 font-sans text-gray-900">
      <div className="border-b pb-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-black uppercase text-gray-900">📦 Logistics Dispatch Hub</h2>
          <p className="text-[10px] font-bold text-orange-600 uppercase mt-0.5">Multi-Vendor Parallel Pickup Node</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-orange-50 text-orange-700">ACTIVE LOGS</span>
      </div>
      {orders.map(order => (
        <div key={order.id} className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 border">
            <div className="flex justify-between"><span className="text-gray-400 font-bold">Order Token:</span><span className="font-extrabold text-gray-800">{order.id}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 font-bold">Destination:</span><span className="font-bold text-gray-700">{order.deliveryAddress}</span></div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">🚚 Pickup Legs Dispatch Matrix</h3>
            {order.legs.map(leg => (
              <div key={leg.id} className="border rounded-xl p-3 flex justify-between items-center bg-white text-xs">
                <div><p className="font-black text-gray-800">{leg.vendorName}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{leg.region}</p></div>
                <select value={leg.status} onChange={(e) => updateLegStatus(order.id, leg.id, e.target.value)} className="text-[10px] font-bold border rounded px-1.5 py-0.5 bg-white text-gray-700">
                  <option value="Assigning Driver">⏳ Assigning Driver</option>
                  <option value="Arrived at Vendor">📍 Arrived at Vendor</option>
                  <option value="Food Picked Up">✅ Food Picked Up</option>
                </select>
              </div>
            ))}
          </div>
          <button onClick={() => alert("Split payment processing! 90% routed to vendor wallet, 10% kept at admin account.")} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase py-2.5 rounded-xl shadow transition">Handover & Disburse Splits</button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const APP_UPI_ADMIN = "9963088662@ybl";
  const [currentView, setCurrentView] = useState<'store' | 'tracker'>('store');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  const [newResName, setNewResName] = useState('');
  const [newResUpi, setNewResUpi] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemResId, setNewItemResId] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tiffins');
  const [newItemPrice, setNewItemPrice] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const { data: resData } = await supabase.from('restaurants').select('*');
      const { data: itemData } = await supabase.from('food_items').select('*');
      
      const formattedRes = (resData || []).map(r => ({ id: r.id, name: r.name, region: 'Hanamkonda', upi_id: r.upi_id }));
      const formattedItems = (itemData || []).map(i => {
        const matched = formattedRes.find(r => r.id === i.restaurant_id);
        return { id: i.id, restaurantId: i.restaurant_id, restaurantName: matched ? matched.name : 'Vendor', name: i.name, category: i.category, price: Number(i.price) };
      });

      setRestaurants(formattedRes);
      setFoodItems(formattedItems);
      if (formattedRes.length > 0) setNewItemResId(formattedRes.id);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  useEffect(() => { loadData(); }, []);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.foodItem.id === item.id);
      if (existing) return prev.map(i => i.foodItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { foodItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, amt: number) => {
    setCart(prev => prev.map(i => i.foodItem.id === itemId ? { ...i, quantity: i.quantity + amt } : i).filter(i => i.quantity > 0));
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName || !newResUpi) return alert("Fill all fields");
    const { error } = await supabase.from('restaurants').insert([{ name: newResName, upi_id: newResUpi }]);
    if (error) return alert(error.message);
    alert("Restaurant Onboarded!");
    setNewResName(''); setNewResUpi(''); loadData();
  };

  const handleAddFoodItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemResId) return alert("Fill all fields");
    const { error } = await supabase.from('food_items').insert([{ restaurant_id: newItemResId, name: newItemName, category: newItemCategory, price: parseFloat(newItemPrice) }]);
    if (error) return alert(error.message);
    alert("Dish Added!");
    setNewItemName(''); setNewItemPrice(''); loadData();
  };

  const totalDue = cart.reduce((sum, i) => sum + (i.foodItem.price * i.quantity), 0);
  const appCut = Math.round(totalDue * 0.10 * 10) / 10;
  const vendorShare = Math.round(totalDue * 0.90 * 10) / 10;
  const isMultiVendor = new Set(cart.map(i => i.foodItem.restaurantId)).size > 1;
  const upiPayload = `upi://pay?pa=${APP_UPI_ADMIN}&pn=Breakfast&am=${totalDue}&cu=INR&tn=Split_90_10`;
  const filteredItems = foodItems.filter(i => (selectedCategory === 'All Items' || i.category === selectedCategory));
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased">
      <header className="bg-white border-b sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900">breakfast</h1>
          <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Warangal Control Center</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => { setCurrentView(currentView === 'store' ? 'tracker' : 'store'); setShowAdminPanel(false); }} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentView === 'tracker' ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-700'}`}>
            {currentView === 'tracker' ? "🏪 View Store" : "📦 Order Tracker logs"}
          </button>
          <button onClick={() => { setShowAdminPanel(!showAdminPanel); setCurrentView('store'); }} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${showAdminPanel ? 'bg-orange-600 text-white shadow' : 'bg-gray-900 text-white'}`}>
            {showAdminPanel ? "← Exit Console" : "🛠️ Open Admin Console"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-sm font-bold text-gray-400">Connecting to cloud servers...</div>
      ) : currentView === 'tracker' ? (
        <div className="flex-1 p-6"><InternalOrderTracker /></div>
      ) : showAdminPanel ? (
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-sm font-black border-b pb-2 mb-4 text-orange-600 uppercase">Register Kitchen</h2>
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <input type="text" value={newResName} onChange={e => setNewResName(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" placeholder="Business Name" />
              <input type="text" value={newResUpi} onChange={e => setNewResUpi(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" placeholder="Settlement UPI ID (90%)" />
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold text-sm shadow">Deploy Vendor</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-sm font-black border-b pb-2 mb-4 text-orange-600 uppercase">Add Menu Items</h2>
            <form onSubmit={handleAddFoodItem} className="space-y-4">
              <select value={newItemResId} onChange={e => setNewItemResId(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm">
                {restaurants.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
              </select>
              <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" placeholder="Dish Title" />
              <div className="grid grid-cols-2 gap-4">
                <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm">
                  <option value="Tiffins">Tiffins</option><option value="Meals">Meals</option><option value="Biryani">Biryani</option><option value="Street Foods">Street Foods</option>
                </select>
                <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" placeholder="Price (₹)" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold text-sm shadow">Push Dish Live</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 p-6 space-y-6">
            <div className="flex flex-wrap gap-3 border-b pb-2">
              {['All Items', 'Tiffins', 'Meals', 'Biryani', 'Street Foods'].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`pb-2 text-xs font-black border-b-2 transition-all ${selectedCategory === cat ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase">{item.category}</span>
                    <h3 className="text-base font-bold text-gray-900 mt-1">{item.name}</h3>
                    <p className="text-sm font-black text-gray-700">₹{item.price} <span className="text-xs text-gray-400 font-normal">by {item.restaurantName}</span></p>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-orange-500 text-white px-4 py-1.5 rounded-xl font-bold text-xs shadow hover:bg-orange-600 transition">+ Add</button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l p-6 flex flex-col shadow-xl">
            <h2 className="text-base font-black border-b pb-3 mb-4 uppercase tracking-wide text-gray-800">Basket Invoice</h2>
            <div className="flex-1 overflow-y-auto space-y-3">
              {cart.map(item => (
                <div key={item.foodItem.id} className="flex justify-between items-center text-xs border-b pb-2">
                  <div className="max-w-[60%]"><p className="font-bold text-gray-800">{item.foodItem.name}</p><p className="text-[10px] text-gray-400 truncate">{item.foodItem.restaurantName}</p></div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.foodItem.id, -1)} className="w-5 h-5 bg-gray-100 rounded text-xs font-black">-</button>
                    <span className="font-bold text-xs">{item.quantity}</span>
                    <button onClick={() => addToCart(item.foodItem)} className="w-5 h-5 bg-gray-100 rounded text-xs font-black">+</button>
                    <span className="font-extrabold text-gray-900 ml-2">₹{item.foodItem.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            {isMultiVendor && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 my-3 text-[10px] font-black text-amber-800 uppercase tracking-wider">⚡ Multi-Vendor Pickup Flag Active</div>
            )}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm font-black"><span>Total Due:</span><span className="text-lg text-orange-600">₹{totalDue}</span></div>
              {totalDue > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 text-[11px] space-y-1.5 font-medium border">
                  <div className="flex justify-between"><span>App Split Cut (10%):</span><span className="font-bold">₹{appCut}</span></div>
                  <div className="flex justify-between"><span>Vendor Payout Split (90%):</span><span className="font-bold text-emerald-600">₹{vendorShare}</span></div>
                </div>
              )}
              <a href={totalDue > 0 ? upiPayload : '#'} onClick={e => totalDue === 0 && e.preventDefault()} className={`w-full py-3 rounded-xl font-black text-xs uppercase text-center block shadow transition ${totalDue > 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Pay Directly via UPI</a>
              <p className="text-[9px] text-center text-gray-400 mt-1">Primary Aggregator Account: <strong>9963088662@ybl</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
