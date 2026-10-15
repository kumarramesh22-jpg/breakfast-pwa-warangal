import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function CustomerDashboard({ restaurants, dishes, searchQuery, setSearchQuery, selectedArea, setSelectedArea, selectedVendorId, setSelectedRestaurantId, addToCart, removeFromCart, cart, deliveryAddress, setDeliveryAddress, placeOrder }: any) {
  const cartTotal = (cart || []).reduce((sum: number, item: any) => sum + (item.dish.price * item.quantity), 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
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
            <div key={r.id} onClick={() => setSelectedRestaurantId(selectedVendorId === r.id ? 'All' : r.id)} style={{ border: '1px solid #e9e9eb', padding: '16px', borderRadius: '12px', cursor: 'pointer', background: selectedVendorId === r.id ? '#ffedd5' : '#ffffff', borderColor: selectedVendorId === r.id ? '#fc8019' : '#e9e9eb' }}>
              <h4 style={{ margin: '0 0 4px 0' }}>{r.name}</h4>
              <small>⭐ {r.rating} • {r.area}</small>
            </div>
          ))}
        </div>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e9e9eb' }}>
          <h3 style={{ marginTop: 0 }}>Explore Fresh Menu Items</h3>
          {(dishes || []).filter((d: any) => selectedVendorId === 'All' || d.restaurant_id === selectedVendorId).map((d: any) => {
            const itemInCart = (cart || []).find((i: any) => i.dish.id === d.id);
            const quantityInCart = itemInCart ? itemInCart.quantity : 0;
            return (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f4f5f7' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: d.isVeg ? 'green' : 'red' }}>{d.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}</span>
                  <h4 style={{ margin: '4px 0' }}>{d.name} — ₹{d.price}</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {quantityInCart === 0 ? (
                    <button onClick={() => addToCart(d)} style={{ backgroundColor: '#ffffff', color: '#fc8019', border: '1px solid #fc8019', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ADD</button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', background: '#fc8019', borderRadius: '6px', padding: '4px 8px', gap: '12px', color: '#ffffff' }}>
                      <button onClick={() => removeFromCart(d.id)} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{quantityInCart}</span>
                      <button onClick={() => addToCart(d)} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '16px', height: 'fit-content', background: '#ffffff' }}>
        <h3 style={{ marginTop: 0 }}>🛒 Basket Invoice</h3>
        {(cart || []).map((item: any) => (
          <div key={item.dish.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
            <span>{item.dish.name} (x{item.quantity})</span>
            <strong>₹{item.dish.price * item.quantity}</strong>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #f4f5f7', paddingTop: '12px', marginTop: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>📍 Delivery Address Target:</label>
          <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '16px', marginTop: '16px', color: '#fc8019' }}>
            <span>To Pay Total:</span><span>₹{cartTotal}</span>
          </div>
          <button onClick={placeOrder} style={{ width: '100%', backgroundColor: '#fc8019', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '12px' }}>Place Delivery Order</button>
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

  useEffect(() => {
    setRestaurants([
      { id: 'r1', name: 'Hanamkonda Central Tiffins', type: 'South Indian', area: 'Hanamkonda Center', rating: 4.6 },
      { id: 'r2', name: 'Warangal Royal Biryani', type: 'Hyderabadi Mughlai', area: 'Warangal Chowrasta', rating: 4.4 },
      { id: 'r3', name: 'Kazipet Spice Cloud Kitchen', type: 'Fusion Veg', area: 'Kazipet Node', rating: 4.5 }
    ]);
    setDishes([
      { id: 'd1', restaurant_id: 'r1', name: 'Ghee Karam Podi Idli (2 Pcs)', price: 50, isVeg: true },
      { id: 'd2', restaurant_id: 'r1', name: 'Butter Onion Masala Dosa', price: 80, isVeg: true },
      { id: 'd3', restaurant_id: 'r2', name: 'Special Chicken Dum Biryani', price: 240, isVeg: false }
    ]);
  }, [currentView]);

  const addToCart = (dish: any) => {
    const existing = cart.find((i: any) => i.dish.id === dish.id);
    if (existing) setCart(cart.map((i: any) => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i));
    else setCart([...cart, { dish, quantity: 1 }]);
  };

  const removeFromCart = (dishId: string) => {
    const existing = cart.find((i: any) => i.dish.id === dishId);
    if (existing?.quantity === 1) setCart(cart.filter((i: any) => i.dish.id !== dishId));
    else if (existing) setCart(cart.map((i: any) => i.dish.id === dishId ? { ...i, quantity: i.quantity - 1 } : i));
  };

  const placeOrder = () => {
    if (!cart.length) return alert('Your basket is empty!');
    const bill = cart.reduce((s: number, i: any) => s + (i.dish.price * i.quantity), 0);
    const newOrder = { items_summary: cart.map((i: any) => `${i.dish.name} x${i.quantity}`).join(', '), total_amount: bill, delivery_address: deliveryAddress };
    setLiveOrders([newOrder, ...liveOrders]);
    alert(`🎉 Order Placed Natively! Commission (10%): ₹${(bill * 0.1).toFixed(2)} captured.`);
    setCart([]);
  };

  const handleOnboardOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutletName.trim()) return alert('Please input brand name.');
    const newRes = { id: 'r-' + Date.now(), name: newOutletName, area: newOutletArea, type: newOutletType, rating: 4.5 };
    setRestaurants([newRes, ...restaurants]);
    setNewOutletName('');
    alert(`🎉 Registered Partner: "${newRes.name}"`);
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', color: '#282c3f', backgroundColor: '#f4f5f7', margin: 0 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', borderBottom: '1px solid #e9e9eb', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ margin: 0, color: '#fc8019', fontWeight: 900, fontSize: '24px', letterSpacing: '-1px' }}>🥞 breakfast</h1>
          <small style={{ fontSize: '11px', color: '#686b78', fontWeight: 700, marginTop: '-2px' }}>it provides every food item</small>
        </div>
        <div style={{ display: 'flex', background: '#e9e9eb', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          <button onClick={() => setCurrentView('customer')} style={{ border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', background: currentView === 'customer' ? '#ffffff' : 'transparent', color: '#fc8019' }}>🍟 Order Online</button>
          <button onClick={() => setCurrentView('admin')} style={{ border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', background: currentView === 'admin' ? '#ffffff' : 'transparent', color: '#fc8019' }}>🍳 Admin Panel</button>
          <button onClick={() => setCurrentView('rider')} style={{ border: 'none', padding: '10px 18px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', background: currentView === 'rider' ? '#ffffff' : 'transparent', color: '#fc8019' }}>🚴 Rider View</button>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '20px auto', padding: '0 24px', boxSizing: 'border-box' }}>
        {currentView === 'customer' && (
          <CustomerDashboard restaurants={restaurants} dishes={dishes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedArea={selectedArea} setSelectedArea={setSelectedArea} selectedVendorId={selectedVendorId} setSelectedRestaurantId={setSelectedRestaurantId} addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} placeOrder={placeOrder} />
        )}

        {currentView === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e9e9eb', padding: '20px', borderRadius: '16px', height: 'fit-content' }}>
              <h3 style={{ marginTop: 0, color: '#fc8019', fontSize: '18px', fontWeight: 'bold' }}>🏢 Onboard Partner</h3>
              <form onSubmit={handleOnboardOutlet} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Outlet Brand Name..." value={newOutletName} onChange={(e) => setNewOutletName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                <select value={newOutletArea} onChange={(e) => setNewOutletArea(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="Hanamkonda Center">Hanamkonda Center</option>
                  <option value="Kazipet Node">Kazipet Node</option>
                  <option value="Warangal Chowrasta">Warangal Chowrasta</option>
                </select>
                <button type="submit" style={{ backgroundColor: '#fc8019', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Authorize Partner</button>
              </form>
            </div>
            <div style={{ border: '1px solid #e9e9eb', padding: '24px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h3 style={{ marginTop: 0, fontWeight: 800 }}>🍳 Admin Live Feed (90/10 Split Grid)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {liveOrders.map((o: any, idx: number) => (
                  <div key={idx} style={{ padding: '16px', border: '1px solid #e9e9eb', borderRadius: '12px', backgroundColor: '#f9f9fa' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Items: {o.items_summary}</p>
                    <small style={{ color: '#6b7280' }}>Payout (90%): ₹{(o.total_amount * 0.9).toFixed(2)} | App Share (10%): ₹{(o.total_amount * 0.1).toFixed(2)}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'rider' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '16px', backgroundColor: '#ffffff' }}>
              <h3 style={{ marginTop: 0, fontWeight: 800 }}>🚴 Active Shipment Runs</h3>
              {liveOrders.map((o: any, idx: number) => (
                <div key={idx} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: 0 }}>Summary: {o.items_summary}</p>
                  <small style={{ color: '#6b7280' }}>Target: {o.delivery_address || 'Subedari, Warangal'}</small>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid #e9e9eb', padding: '20px', borderRadius: '12px', background: '#ffffff', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, textAlign: 'left', fontWeight: 800 }}>🗺️ Telemetry Hub</h3>
              <p>Lat: {riderCoords.lat} | Lng: {riderCoords.lng}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
