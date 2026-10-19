import { PremiumRidersDashboard } from './PremiumRidersDashboard';


import React, { useState } from 'react';

// 📦 SELF-CONTAINED LOCAL DISPATCH LOGISTICS HUB MODULE
function InternalOrderTracker({ localOrders }: { localOrders: any[] }) {
  const [orders, setOrders] = useState(localOrders);

  const updateLegStatus = (orderId: string, legId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const updatedLegs = order.legs.map(leg => leg.id === legId ? { ...leg, status: newStatus } : leg);
      const allPickedUp = updatedLegs.every(l => l.status === 'Food Picked Up');
      return { ...order, legs: updatedLegs, overallStatus: allPickedUp ? 'Out for Delivery' : 'Processing' };
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-xl max-w-xl mx-auto my-6 font-sans text-gray-900">
      <div className="border-b pb-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-base font-black uppercase text-gray-900 tracking-tight">📦 Logistics Dispatch Hub</h2>
          <p className="text-[10px] font-bold text-orange-600 uppercase mt-0.5 tracking-wider">Multi-Vendor Parallel Pickup Control</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-orange-50 text-orange-700 tracking-wide">ACTIVE RUNNERS</span>
      </div>
      {orders.map(order => (
        <div key={order.id} className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 border border-gray-100 flex justify-between">
            <span className="text-gray-400 font-bold">Delivery Address:</span>
            <span className="font-bold text-gray-700">{order.deliveryAddress}</span>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">🚚 Active Dispatch Legs Matrix</h3>
            {order.legs.map((leg: any) => (
              <div key={leg.id} className="border border-gray-100 rounded-xl p-3 flex justify-between items-center bg-white text-xs mb-2">
                <div><p className="font-black text-gray-800">{leg.vendorName}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{leg.region}</p></div>
                <select value={leg.status} onChange={(e) => updateLegStatus(order.id, leg.id, e.target.value)} className="text-[10px] font-bold border rounded px-1.5 py-0.5 bg-white text-gray-700 focus:outline-none">
                  <option value="Assigning Driver">⏳ Assigning Driver</option>
                  <option value="Arrived at Vendor">📍 Arrived at Vendor</option>
                  <option value="Food Picked Up">✅ Food Picked Up</option>
                </select>
              </div>
            ))}
          </div>
          <button onClick={() => alert("90/10 automated split settlement triggered natively to aggregator 9963088662@ybl.")} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase py-3 rounded-xl shadow-md transition-all tracking-wider">Confirm Handover & Disburse Splits</button>
        </div>
      ))}
    </div>
  );
}

// 🏪 PRIMARY HARDENED APP WORKSPACE ENGINE
export default function App() {
  const APP_UPI_ADMIN = "9963088662@ybl";
  const [currentView, setCurrentView] = useState<'store' | 'tracker'>('store');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [restaurants, setRestaurants] = useState<any[]>([
    { id: 'res-1', name: 'Balaji Food Court', region: 'Hanamkonda', upi_id: 'balaji@upi' },
    { id: 'res-2', name: 'Ramya Tiffins', region: 'Warangal', upi_id: 'ramya@upi' }
  ]);

  const [foodItems, setFoodItems] = useState<any[]>([
    { id: 'item-1', restaurantId: 'res-1', restaurantName: 'Balaji Food Court', name: 'Ghee Karam Dosa', category: 'Tiffins', price: 80 },
    { id: 'item-2', restaurantId: 'res-1', restaurantName: 'Balaji Food Court', name: 'Babai Idli', category: 'Tiffins', price: 50 },
    { id: 'item-3', restaurantId: 'res-2', restaurantName: 'Ramya Tiffins', name: 'Hyderabadi Chicken Biryani', category: 'Biryani', price: 220 },
    { id: 'item-4', restaurantId: 'res-2', restaurantName: 'Ramya Tiffins', name: 'Full South Indian Meals', category: 'Meals', price: 150 }
  ]);

  const [cart, setCart] = useState<any[]>([]);
  const [newResName, setNewResName] = useState('');
  const [newResUpi, setNewResUpi] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemResId, setNewItemResId] = useState('res-1');
  const [newItemCategory, setNewItemCategory] = useState('Tiffins');
  const [newItemPrice, setNewItemPrice] = useState('');

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

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName || !newResUpi) return alert("Fill all fields");
    const generatedId = `res-${Date.now()}`;
    setRestaurants(prev => [...prev, { id: generatedId, name: newResName, region: 'Hanamkonda', upi_id: newResUpi }]);
    alert("Restaurant Node Registered into Local Engine!");
    setNewResName(''); setNewResUpi('');
  };

  const handleAddFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemResId) return alert("Fill all fields");
    const matchedRes = restaurants.find(r => r.id === newItemResId);
    const generatedId = `item-${Date.now()}`;
    setFoodItems(prev => [...prev, {
      id: generatedId,
      restaurantId: newItemResId,
      restaurantName: matchedRes ? matchedRes.name : 'Partner Vendor',
      name: newItemName,
      category: newItemCategory,
      price: parseFloat(newItemPrice)
    }]);
    alert("Dish Catalog Addition Successful!");
    setNewItemName(''); setNewItemPrice('');
  };

  const totalDue = cart.reduce((sum, i) => sum + (i.foodItem.price * i.quantity), 0);
  const appCut = Math.round(totalDue * 0.10 * 10) / 10;
  const vendorShare = Math.round(totalDue * 0.90 * 10) / 10;
  const isMultiVendor = new Set(cart.map(i => i.foodItem.restaurantId)).size > 1;
  const upiPayload = `upi://pay?pa=${APP_UPI_ADMIN}&pn=Breakfast&am=${totalDue}&cu=INR&tn=Split_90_10`;
  const filteredItems = foodItems.filter(i => (selectedCategory === 'All Items' || i.category === selectedCategory));

  const mockDeliveryLogs = [
    {
      id: 'ORD-8932',
      customerName: 'Customer Node',
      totalAmount: totalDue > 0 ? totalDue : 130,
      deliveryAddress: 'Subedari, Hanamkonda',
      overallStatus: 'Processing',
      legs: cart.length > 0 
        ? Array.from(new Set(cart.map(c => typeof c.foodItem.restaurantId === 'string' ? c.foodItem.restaurantId : 'res-1'))).map((rId, index) => {
            const res = restaurants.find(r => r.id === rId);
            return { id: `leg-${index}`, vendorName: res ? res.name : 'Balaji Food Court', region: 'Hanamkonda', status: 'Arrived at Vendor' };
          })
        : [{ id: 'leg-1', vendorName: 'Balaji Food Court', region: 'Hanamkonda', status: 'Arrived at Vendor' }]
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased">
      {/* Dynamic Colorful Command Header Framework */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 sticky top-0 z-50 px-6 py-5 flex items-center justify-between shadow-md text-white">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">breakfast</h1>
          <p className="text-xs font-bold text-orange-100 tracking-wide mt-0.5">✨ It provides every food item</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => { setCurrentView(currentView === 'store' ? 'tracker' : 'store'); setShowAdminPanel(false); }} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${currentView === 'tracker' ? 'bg-white text-orange-600 border-white shadow-sm' : 'bg-transparent text-white border-white hover:bg-white/10'}`}>
            {currentView === 'tracker' ? "🏪 View Store Front" : "📦 Order Tracker logs"}
          </button>
          <button onClick={() => { setShowAdminPanel(!showAdminPanel); setCurrentView('store'); }} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${showAdminPanel ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-gray-900 text-white border-gray-900 hover:bg-black'}`}>
            {showAdminPanel ? "← Exit Console" : "🛠️ Open Admin Console"}
          </button>
        </div>
      </header>

      {currentView === 'tracker' ? (
        <div className="flex-1 p-6 bg-orange-50/30"><InternalOrderTracker localOrders={mockDeliveryLogs} /></div>
      ) : showAdminPanel ? (
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-md border-orange-100/50 h-fit">
            <h2 className="text-sm font-black border-b pb-2 mb-4 text-orange-600 uppercase tracking-wide">Register Kitchen Node</h2>
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <input type="text" value={newResName} onChange={e => setNewResName(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-500" placeholder="Business Name" />
              <input type="text" value={newResUpi} onChange={e => setNewResUpi(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-500" placeholder="Settlement UPI ID (90%)" />
              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow">Deploy Vendor Node</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-md border-orange-100/50 h-fit">
            <h2 className="text-sm font-black border-b pb-2 mb-4 text-orange-600 uppercase tracking-wide">Add Menu Items</h2>
            <form onSubmit={handleAddFoodItem} className="space-y-4">
              <select value={newItemResId} onChange={e => setNewItemResId(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none">
                {restaurants.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
              </select>
              <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-500" placeholder="Dish Title" />
              <div className="grid grid-cols-2 gap-4">
                <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none">
                  <option value="Tiffins">Tiffins</option><option value="Meals">Meals</option><option value="Biryani">Biryani</option><option value="Street Foods">Street Foods</option>
                </select>
                <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-orange-500" placeholder="Price (₹)" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow">Push Dish Live</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 p-6 space-y-6">
            <div className="flex flex-wrap gap-3 border-b pb-3 border-orange-100">
              {['All Items', 'Tiffins', 'Meals', 'Biryani', 'Street Foods'].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`pb-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${selectedCategory === cat ? 'border-orange-500 text-orange-600 border-b-orange-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-orange-50/50 shadow-md flex justify-between items-center hover:shadow-lg transition-all duration-200">
                  <div>
                    <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{item.name}</h3>
                    <p className="text-sm font-black text-gray-700">₹{item.price} <span className="text-xs text-gray-400 font-normal ml-1">by {item.restaurantName}</span></p>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition">+ Add to Order</button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l p-6 flex flex-col shadow-2xl border-orange-50">
            <h2 className="text-lg font-black border-b pb-3 mb-4 uppercase text-gray-800">🧺 Basket Invoice</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cart.map(item => (
                <div key={item.foodItem.id} className="flex justify-between items-center text-xs border-b border-dashed pb-2 border-orange-100">
                  <div className="max-w-[60%]"><p className="font-bold text-gray-800">{item.foodItem.name}</p><p className="text-[10px] text-gray-400 truncate">{item.foodItem.restaurantName}</p></div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.foodItem.id, -1)} className="w-5 h-5 bg-orange-50 text-orange-600 rounded font-black text-xs flex items-center justify-center">-</button>
                    <span className="font-black text-gray-800 min-w-[12px] text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item.foodItem)} className="w-5 h-5 bg-orange-50 text-orange-600 rounded font-black text-xs flex items-center justify-center">+</button>
                    <span className="font-extrabold text-gray-900 ml-2">₹{item.foodItem.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            {isMultiVendor && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl p-3 my-3 text-[10px] font-black text-orange-800 uppercase tracking-wider animate-pulse">⚡ Multi-Vendor Pickup Flag Active</div>
            )}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm font-black"><span>Total Due:</span><span className="text-xl text-orange-600">₹{totalDue}</span></div>
              {totalDue > 0 && (
                <div className="bg-orange-50/30 rounded-xl p-3 text-[11px] space-y-1.5 font-medium border border-orange-100/50">
                  <div className="flex justify-between text-gray-600"><span>App Split Cut (10%):</span><span className="font-bold text-gray-900">₹{appCut}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Vendor Payout Split (90%):</span><span className="font-bold text-emerald-600">₹{vendorShare}</span></div>
                </div>
              )}
              <a href={totalDue > 0 ? upiPayload : '#'} onClick={e => totalDue === 0 && e.preventDefault()} className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-center block shadow-lg transition-all duration-200 ${totalDue > 0 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Pay Directly via UPI</a>
              <p className="text-[10px] text-center text-gray-400 mt-2">Primary Aggregator Account: <strong className="text-gray-600">9963088662@ybl</strong></p>
            </div>
          </div>
        </div>
      )}
          <ColorfulRiderEngine />

    </div>
  );
}

// ==========================================
// CLEAN UNIQUE RENDERING ENGINE
// ==========================================
export function ColorfulRiderEngine() {
  return (
    <div style={{ padding: '0 10px', marginTop: '20px' }}>
      <PremiumRidersDashboard />
    </div>
  );
}

