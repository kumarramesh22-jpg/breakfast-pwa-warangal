import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function CustomerDashboard({ restaurants, dishes, searchQuery, setSearchQuery, selectedArea, setSelectedArea, selectedVendorId, setSelectedRestaurantId, addToCart, cart, deliveryAddress, setDeliveryAddress, placeOrder }: any) {
  const cartTotal = (cart || []).reduce((sum: number, item: any) => sum + (item.dish.price * item.quantity), 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input type="text" placeholder="Search delicious cuisines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} />
          <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', fontWeight: 'bold' }}>
            <option value="All">All Regions Sector</option>
            <option value="Hanamkonda Center">Hanamkonda Center</option>
            <option value="Kazipet Node">Kazipet Node</option>
            <option value="Warangal Chowrasta">Warangal Chowrasta</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {(restaurants || []).filter((r: any) => (selectedArea === 'All' || r.area === selectedArea) && r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r: any) => (
            <div key={r.id} onClick={() => setSelectedRestaurantId(selectedVendorId === r.id ? 'All' : r.id)} style={{ border: '1px solid #e9e9eb', padding: '16px', borderRadius: '16px', cursor: 'pointer', background: selectedVendorId === r.id ? '#ffedd5' : '#ffffff', borderColor: selectedVendorId === r.id ? '#fc8019' : '#e9e9eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#282c3f', fontWeight: 800 }}>{r.name}</h4>
              <small style={{ color: '#686b78', fontWeight: 'bold' }}>⭐ {r.rating} • {r.area}</small>
            </div>
          ))}
        </div>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e9e9eb' }}>
          <h3 style={{ marginTop: 0, fontWeight: 800 }}>Explore Fresh Menu Items</h3>
          {(dishes || []).filter((d: any) => selectedVendorId === 'All' || d.restaurant_id === selectedVendorId).map((d: any) => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f4f5f7' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: d.isVeg ? '#0f8a65' : '#b52f2f' }}>{d.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}</span>
                <h4 style={{ margin: '4px 0 2px 0', fontSize: '16px', fontWeight: 700 }}>{d.name} — ₹{d.price}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#7e808c' }}>{d.description || 'Freshly made authentic local selection item.'}</p>
              </div>
              <button onClick={() => addToCart(d)} style={{ backgroundColor: '#fc8019', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, boxShadow: '0 2px 4px rgba(252,128,25,0.2)' }}>ADD +</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '16px', height: 'fit-content', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ marginTop: 0, fontWeight: 800, borderBottom: '2px solid #f4f5f7', paddingBottom: '8px' }}>🛒 Basket Invoice</h3>
        {(cart || []).map((item: any) => (
          <div key={item.dish.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
            <span>{item.dish.name} (x{item.quantity})</span>
            <strong>₹{item.dish.price * item.quantity}</strong>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #f4f5f7', paddingTop: '12px', marginTop: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>📍 Delivery Address Target:</label>
          <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '18px', marginTop: '16px', color: '#fc8019' }}>
            <span>To Pay Total:</span><span>₹{cartTotal}</span>
          </div>
          <button onClick={placeOrder} style={{ width: '100%', backgroundColor: '#fc8019', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, marginTop: '12px', boxShadow: '0 4px 12px rgba(252,128,25,0.25)' }}>Place Delivery Order</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'rider'>('customer');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  
  const [selectedArea, setSelectedArea] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorId, setSelectedRestaurantId] = useState('All');
  const [deliveryAddress, setDeliveryAddress] = useState('Subedari, Hanamkonda, Warangal');
  const [riderCoords, setRiderCoords] = useState({ lat: 17.97834, lng: 79.53189 });

  const [newOutletName, setNewOutletName] = useState('');
  const [newOutletArea, setNewOutletArea] = useState('Hanamkonda Center');
  const [newOutletType, setNewOutletType] = useState('Premium Restaurant');
  const [newOutletRating, setNewOutletRating] = useState('4.5');

  useEffect(() => {
    loadFallbackData();
    async function loadData() {
      try {
        const { data: r } = await supabase.from('restaurants').select('*');
        const { data: d } = await supabase.from('dishes').select('*');
        if (r?.length) setRestaurants(r);
        if (d?.length) setDishes(d);
        const { data: o } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (o) setLiveOrders(o);
      } catch (err) {
        console.log("Sandbox active");
      }
    }
    loadData();
  }, [currentView]);

  const loadFallbackData = () => {
    if (!restaurants?.length) {
      setRestaurants([
        { id: 'r1', name: 'Hanamkonda Central Tiffins', type: 'Premium South Indian', area: 'Hanamkonda Center', rating: 4.6 },
        { id: 'r2', name: 'Warangal Royal Biryani', type: 'Authentic Hyderabadi', area: 'Warangal Chowrasta', rating: 4.4 },
        { id: 'r3', name: 'Kazipet Spice Cloud Kitchen', type: 'North Indian Fusion', area: 'Kazipet Node', rating: 4.5 }
      ]);
    }
    if (!dishes?.length) {
      setDishes([
        { id: 'd1', restaurant_id: 'r1', name: 'Ghee Karam Podi Idli (2 Pcs)', price: 50, description: 'Soft fluffy idlis dusted with gunpowder condiment.', isVeg: true },
        { id: 'd2', restaurant_id: 'r1', name: 'Butter Onion Masala Dosa', price: 80, description: 'Crispy golden crepe filled with potato mash.', isVeg: true },
        { id: 'd3', restaurant_id: 'r2', name: 'Special Chicken Dum Biryani', price: 240, description: 'Fragrant basmati cooked with tender spiced meat.', isVeg: false }
      ]);
    }
  };

  const addToCart = (dish: any) => {
    const existing = cart.find((i: any) => i.dish.id === dish.id);
    if (existing) setCart(cart.map((i: any) => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i));
    else setCart([...cart, { dish, quantity: 1 }]);
  };

  const placeOrder = async () => {
    if (!cart.length) return alert('Your basket is empty!');
    const totalBill = cart.reduce((s: number, i: any) => s + (i.dish.price * i.quantity), 0);
    
    const resPayout = (totalBill * 0.90).toFixed(2);
    const appProfit = (totalBill * 0.10).toFixed(2);

    const newOrder = {
      total_amount: totalBill,
      restaurant_payout: parseFloat(resPayout),
      app_commission: parseFloat(appProfit),
      status: 'Pending',
      delivery_address: deliveryAddress,
      items_summary: cart.map((i: any) => `${i.dish.name} x${i.quantity}`).join(', '),
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('orders').insert([newOrder]);
      alert(`🎉 Order Placed Natively! Commission (10%): ₹${appProfit}`);
      setCart([]);
      fetchLiveOrders();
    } catch {
      setLiveOrders([{ ...newOrder, id: 'TOK-' + Math.floor(Math.random() * 90000 + 10000) }, ...(liveOrders || [])]);
      alert(`🎉 Simulation Mode: Order logged. App profit (10%): ₹${appProfit}`);
      setCart([]);
    }
  };

  const handleOnboardOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutletName.trim()) return alert('Please input brand name.');
    const newRes = { id: 'r-' + Date.now(), name: newOutletName, area: newOutletArea, type: newOutletType, rating: parseFloat(newOutletRating) || 4.5 };
    setRestaurants([newRes, ...restaurants]);
    setNewOutletName('');
    alert(`🎉 Registered Partner: "${newRes.name}"`);
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', color: '#282c3f', backgroundColor: '#f4f5f7', margin: 0 }}>
      
      {/* HEADER NAVBAR WITH RESTORED CAPTION */}
      <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', borderBottom: '1px solid #e9e9eb', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ margin: 0, color: '#fc8019', fontWeight: 900, fontSize: '26px', letterSpacing: '-1px' }}>🥞 breakfast</h1>
          <small style={{ fontSize: '11px', color: '#686b78', fontWeight: 700, marginTop: '-2px', textTransform: 'lowercase' }}>it provides every food item</small>
        </div>
        <div style={{ display: 'flex', background: '#e9e9eb', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          <button onClick={() => setCurrentView('customer')} style={{ border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', background: currentView === 'customer' ? '#ffffff' : 'transparent', color: '#fc8019' }}>🍟 Order Online</button>
          <button onClick={() => setCurrentView('admin')} style={{ border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', background: currentView === 'admin' ? '#ffffff' : 'transparent', color: '#fc8019' }}>🍳 Admin Panel</button>
          <button onClick={() => setCurrentView('rider')} style={{ border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', background: currentView === 'rider' ? '#ffffff' : 'transparent', color: '#fc8019' }}>🚴 Rider View</button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER SWITCH */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '20px auto', padding: '0 24px', boxSizing: 'border-box' }}>
        {currentView === 'customer' && (
          <CustomerDashboard restaurants={restaurants} dishes={dishes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedArea={selectedArea} setSelectedArea={setSelectedArea} selectedVendorId={selectedVendorId} setSelectedRestaurantId={setSelectedRestaurantId} addToCart={addToCart} cart={cart} deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} placeOrder={placeOrder} />
        )}

        {currentView === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e9e9eb', padding: '20px', borderRadius: '16px', height: 'fit-content' }}>
              <h3 style={{ marginTop: 0, color: '#fc8019', fontSize: '18px', fontWeight: 'bold' }}>🏢 Onboard Partner</h3>
              <form onSubmit={handleOnboardOutlet} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Outlet Brand Name:</label>
                <input type="text" placeholder="e.g. Spice Cloud Kitchen" value={newOutletName} onChange={(e) => setNewOutletName(newOutletName => e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Geographic Sector:</label>
                <select value={newOutletArea} onChange={(e) => setNewOutletArea(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="Hanamkonda Center">Hanamkonda Center</option>
                  <option value="Kazipet Node">Kazipet Node</option>
                  <option value="Warangal Chowrasta">Warangal Chowrasta</option>
                </select>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Classification:</label>
                <select value={newOutletType} onChange={(e) => setNewOutletType(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="Premium Restaurant">Premium Restaurant</option>
                  <option value="Cloud Kitchen">Cloud Kitchen</option>
                </select>
                <button type="submit" style={{ backgroundColor: '#fc8019', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Authorize Partner</button>
              </form>
            </div>

            <div style={{ border: '1px solid #e9e9eb', padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h3 style={{ marginTop: 0, fontWeight: 800 }}>🍳 Admin Live Feed (90/10 Split Grid)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {(liveOrders || []).map((o: any, idx: number) => {
                  const bill = o.total_amount || 0;
                  const resPayout = o.restaurant_payout || (bill * 0.9).toFixed(2);
                  const appCom = o.app_commission || (bill * 0.1).toFixed(2);
                  return (
                    <div key={idx} style={{ padding: '16px', border: '1px solid #e9e9eb', borderRadius: '12px', backgroundColor: '#f9f9fa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#282c3f' }}>Items: {o.items_summary}</span>
                        <span style={{ background: '#fff', border: '1px solid #fc8019', color: '#fc8019', fontSize: '12px', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', marginLeft: 'auto' }}>Total: ₹{bill}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px dashed #dbdbe1', fontSize: '13px' }}>
                        <div>🏪 Restaurant Payout (90%): <strong style={{ color: '#0f8a65' }}>₹{resPayout}</strong></div>
                        <div>📱 Your App Share Profit (10%): <strong style={{ color: '#fc8019' }}>₹{appCom}</strong></div>
                      </div>
                      <small style={{ color: '#6b7280', display: 'block', marginTop: '8px' }}>📍 Target Drop: {o.delivery_address}</small>
                    </div>
                  );
                })}
                {!(liveOrders || []).length && <p style={{ color: '#7e808c', textAlign: 'center', padding: '20px 0' }}>No active layout rows found inside database fields.</p>}
              </div>
            </div>
          </div>
        )}

        {currentView === 'rider' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h3 style={{ marginTop: 0, fontWeight: 800 }}>🚴 Active Shipment Runs</h3>
              {(liveOrders || []).map((o: any, idx: number) => (
                <div key={idx} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Summary: {o.items_summary}</p>
                  <small style={{ color: '#6b7280' }}>Destination Target Address: {o.delivery_address}</small>
                </div>
              ))}
              {!(liveOrders || []).length && <p style={{ color: '#7e808c', textAlign: 'center', padding: '20px 0' }}>No courier active delivery paths mapped.</p>}
            </div>
            <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '12px', background: '#ffffff', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, textAlign: 'left', fontWeight: 800 }}>🗺️ Telemetry Tracking Hub</h3>
              <div style={{ padding: '24px', background: '#f9f9fa', borderRadius: '12px', border: '1px dashed #dbdbe1', margin: '16px 0' }}>
                <strong>Lat: {riderCoords.lat} | Lng: {riderCoords.lng}</strong>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
