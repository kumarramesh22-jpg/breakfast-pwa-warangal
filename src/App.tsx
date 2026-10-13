import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// SUB-COMPONENT: CUSTOMER FOOD MARKETPLACE COMPONENT MODULE
function CustomerDashboard({ restaurants, dishes, searchQuery, setSearchQuery, selectedArea, setSelectedArea, selectedVendorId, setSelectedRestaurantId, addToCart, cart, deliveryAddress, setDeliveryAddress, placeOrder }: any) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input type="text" placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
            <option value="All">All Regions</option>
            <option value="Hanamkonda Center">Hanamkonda Center</option>
            <option value="Kazipet Node">Kazipet Node</option>
            <option value="Warangal Chowrasta">Warangal Chowrasta</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {(restaurants || []).filter((r: any) => (selectedArea === 'All' || r.area === selectedArea) && r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((r: any) => (
            <div key={r.id} onClick={() => setSelectedRestaurantId(selectedVendorId === r.id ? 'All' : r.id)} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '12px', cursor: 'pointer', background: selectedVendorId === r.id ? '#ffedd5' : '#ffffff', borderColor: selectedVendorId === r.id ? '#fc8019' : '#e5e7eb' }}>
              <h4 style={{ margin: '0 0 4px 0' }}>{r.name}</h4>
              <small>⭐ {r.rating} • {r.area}</small>
            </div>
          ))}
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0 }}>Menu Items</h3>
          {(dishes || []).filter((d: any) => selectedVendorId === 'All' || d.restaurant_id === selectedVendorId).map((d: any) => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: d.isVeg ? 'green' : 'red' }}>{d.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}</span>
                <h4 style={{ margin: '4px 0' }}>{d.name} — ₹{d.price}</h4>
              </div>
              <button onClick={() => addToCart(d)} style={{ background: '#fc8019', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ADD +</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', height: 'fit-content', background: '#ffffff' }}>
        <h3 style={{ marginTop: 0 }}>🛒 Basket</h3>
        {(cart || []).map((i: any) => (
          <div key={i.dish.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
            <span>{i.dish.name} (x{i.quantity})</span>
            <strong>₹{i.dish.price * i.quantity}</strong>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>📍 Delivery Address:</label>
          <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '16px', marginTop: '16px', color: '#fc8019' }}>
            <span>Total To Pay:</span><span>₹{(cart || []).reduce((s: number, i: any) => s + (i.dish.price * i.quantity), 0)}</span>
          </div>
          <button onClick={placeOrder} style={{ width: '100%', backgroundColor: '#fc8019', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '12px' }}>Place Order</button>
        </div>
      </div>
    </div>
  );
}

// MAIN LAYOUT APP MANAGEMENT ROOT TERMINAL
export default function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'rider'>('customer');
  const [restaurants, setRestaurants] = useState<any>([]);
  const [dishes, setDishes] = useState<any>([]);
  const [cart, setCart] = useState<any>([]);
  const [liveOrders, setLiveOrders] = useState<any>([]);
  
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
        console.log("Offline pipeline baseline synchronization active.");
      }
    }
    loadData();
  }, [currentView]);

  const loadFallbackData = () => {
    setRestaurants([
      { id: 'r1', name: 'Hanamkonda Central Tiffins', area: 'Hanamkonda Center', rating: 4.6 },
      { id: 'r2', name: 'Warangal Royal Biryani', area: 'Warangal Chowrasta', rating: 4.4 }
    ]);
    setDishes([
      { id: 'd1', restaurant_id: 'r1', name: 'Ghee Karam Idli', price: 50, description: 'Soft gunpowder idlis.', isVeg: true },
      { id: 'd2', restaurant_id: 'r1', name: 'Butter Onion Dosa', price: 80, description: 'Crispy onion dosa crepes.', isVeg: true }
    ]);
  };

  const addToCart = (dish: any) => {
    const existing = cart.find((i: any) => i.dish.id === dish.id);
    if (existing) {
      setCart(cart.map((i: any) => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { dish, quantity: 1 }]);
    }
  };

  const placeOrder = async () => {
    if (!cart.length) return alert('Basket empty!');
    const newOrder = {
      total_amount: cart.reduce((s: number, i: any) => s + i.dish.price * i.quantity, 0),
      status: 'Pending',
      delivery_address: deliveryAddress,
      items_summary: cart.map((i: any) => `${i.dish.name} x${i.quantity}`).join(', ')
    };
    try {
      await supabase.from('orders').insert([newOrder]);
      alert('🎉 Order Placed Natively!');
      setCart([]);
    } catch {
      setLiveOrders([newOrder, ...(liveOrders || [])]);
      alert('🎉 Simulation Mode Active! Order sent across channels.');
      setCart([]);
    }
  };

  const handleOnboardOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutletName.trim()) return alert('Please input brand name.');
    const newRes = { id: 'r-' + Date.now(), name: newOutletName, area: newOutletArea, type: newOutletType, rating: parseFloat(newOutletRating) || 4.5 };
    setRestaurants([newRes, ...restaurants]);
    setNewOutletName('');
    alert(`🎉 Approved Merchant: "${newRes.name}"`);
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', color: '#282c3f', backgroundColor: '#f3f4f6', margin: 0 }}>
      
      {/* NAVBAR */}
      <header style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 100 }}>
        <h2 style={{ margin: 0, color: '#fc8019', fontWeight: 900 }}>🥞 Swiggy Warangal Hub</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentView('customer')} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #fc8019', borderRadius: '6px', background: currentView === 'customer' ? '#fc8019' : '#fff', color: currentView === 'customer' ? '#fff' : '#fc8019', fontWeight: 'bold' }}>🍟 Order Online</button>
          <button onClick={() => setCurrentView('admin')} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #fc8019', borderRadius: '6px', background: currentView === 'admin' ? '#fc8019' : '#fff', color: currentView === 'admin' ? '#fff' : '#fc8019', fontWeight: 'bold' }}>🍳 Admin Panel</button>
          <button onClick={() => setCurrentView('rider')} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #fc8019', borderRadius: '6px', background: currentView === 'rider' ? '#fc8019' : '#fff', color: currentView === 'rider' ? '#fff' : '#fc8019', fontWeight: 'bold' }}>🚴 Rider View</button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER SWITCH */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '20px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        {currentView === 'customer' && (
          <CustomerDashboard restaurants={restaurants} dishes={dishes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedArea={selectedArea} setSelectedArea={setSelectedArea} selectedVendorId={selectedVendorId} setSelectedRestaurantId={setSelectedRestaurantId} addToCart={addToCart} cart={cart} deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} placeOrder={placeOrder} />
        )}

        {currentView === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '16px', height: 'fit-content' }}>
              <h3 style={{ marginTop: 0, color: '#fc8019', fontSize: '18px', fontWeight: 'bold' }}>🏢 Onboard Partner</h3>
              <form onSubmit={handleOnboardOutlet} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Outlet Brand Name:</label>
                <input type="text" placeholder="e.g. Subedari Spice Cloud" value={newOutletName} onChange={(e) => setNewOutletName(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Geographic Region Sector:</label>
                <select value={newOutletArea} onChange={(e) => setNewOutletArea(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="Hanamkonda Center">Hanamkonda Center</option>
                  <option value="Kazipet Node">Kazipet Node</option>
                  <option value="Warangal Chowrasta">Warangal Chowrasta</option>
                </select>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Kitchen Classification:</label>
                <select value={newOutletType} onChange={(e) => setNewOutletType(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="Premium Restaurant">Premium Restaurant</option>
                  <option value="Cloud Kitchen">Cloud Kitchen</option>
                  <option value="Street Food Corner">Street Food Corner</option>
                </select>
                <button type="submit" style={{ backgroundColor: '#fc8019', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✅ Register Partner</button>
              </form>
            </div>

            <div style={{ border: '1px solid #e5e7eb', padding: '24px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
              <h3 style={{ marginTop: 0 }}>🍳 Multi-Vendor Admin Live Feed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {(liveOrders || []).map((o: any, idx: number) => (
                  <div key={idx} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <p style={{ margin: 0 }}><strong>Items Summary:</strong> {o.items_summary}</p>
                    <small style={{ color: '#6b7280' }}>Bill: ₹{o.total_amount} | Destination: {o.delivery_address}</small>
                  </div>
                ))}
                {!(liveOrders || []).length && <p style={{ color: '#7e808c', textAlign: 'center', padding: '20px 0' }}>No active layout rows found inside database fields.</p>}
              </div>
            </div>
          </div>
        )}

        {currentView === 'rider' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', backgroundColor: '#ffffff' }}>
              <h3 style={{ marginTop: 0 }}>🚴 Active Shipment Runs</h3>
              {(liveOrders || []).map((o: any, idx: number) => (
                <div key={idx} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Summary: {o.items_summary}</p>
                  <small style={{ color: '#6b7280' }}>Destination Target Address: {o.delivery_address}</small>
                </div>
              ))}
              {!(liveOrders || []).length && <p style={{ color: '#7e808c', textAlign: 'center', padding: '20px 0' }}>No courier active delivery paths mapped.</p>}
            </div>
            <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', background: '#ffffff', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, textAlign: 'left' }}>🗺️ Telemetry Tracking Hub</h3>
              <div style={{ padding: '24px', background: '#f9f9fa', borderRadius: '12px', border: '1px dashed #dbdbe1', margin: '16px 0' }}>
                <strong>Lat: {riderCoords.lat} | Lng: {riderCoords.lng}</strong>
              </div>
              <button onClick={() => setRiderCoords({ lat: +(17.978 + Math.random()*0.01).toFixed(5), lng: +(79.531 + Math.random()*0.01).toFixed(5) })} style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #dbdbe1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563' }}>🎲 Randomize GPS Telemetry</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
