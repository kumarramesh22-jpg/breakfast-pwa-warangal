import React, { useState, useEffect } from 'react';

interface Dish { id: string; name: string; price: number; category: string; restaurant: string; location: string; rating: string; }
interface CartItem { dish: Dish; quantity: number; }

const MENU_ITEMS: Dish[] = [
  { id: '1', name: 'Ghee Karam Dosa', price: 65, category: 'Tiffins', restaurant: 'Ramya Tiffins', location: 'Hanamkonda', rating: '4.6' },
  { id: '2', name: 'Babai Idli (4 Pcs)', price: 45, category: 'Tiffins', restaurant: 'Sri Venkateshwara Mithai', location: 'Hanamkonda', rating: '4.4' },
  { id: '3', name: 'Telangana Veg Meals', price: 140, category: 'Meals', restaurant: 'Kakatiya Mess', location: 'Hanamkonda', rating: '4.5' },
  { id: '4', name: 'Special Chicken Biryani', price: 260, category: 'Biryani', restaurant: 'Hotel Ashoka', location: 'Hanamkonda', rating: '4.3' },
  { id: '5', name: 'Mirchi Bajji (4 Pcs)', price: 35, category: 'Street Foods', restaurant: 'Naimnagar Chowrasta Stall', location: 'Hanamkonda', rating: '4.7' },
  { id: '6', name: 'Mutton Biryani Pot', price: 320, category: 'Biryani', restaurant: 'Pot Non-Veg Restaurant', location: 'Warangal', rating: '4.5' },
  { id: '7', name: 'Puri Sabji Special', price: 50, category: 'Tiffins', restaurant: 'Kazipet Station Center', location: 'Kazipet', rating: '4.1' }
];

const CATEGORIES = ['All Items', 'Tiffins', 'Meals', 'Biryani', 'Street Foods'];
const LOCATIONS = ['All Regions', 'Hanamkonda', 'Warangal', 'Kazipet'];

export default function AppAdvanced() {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedLocation, setSelectedLocation] = useState('All Regions');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vendorStatuses, setVendorStatuses] = useState(
    MENU_ITEMS.map(item => ({ name: item.restaurant, isOnline: true })).filter((v, i, a) => i === a.findIndex(t => t.name === v.name))
  );
  const [riderLocation, setRiderLocation] = useState({ lat: 17.97395, lng: 79.53711 });

  useEffect(() => {
    const interval = setInterval(() => {
      setRiderLocation(prev => ({ lat: prev.lat + (Math.random() - 0.5) * 0.0004, lng: prev.lng + (Math.random() - 0.5) * 0.0004 }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const match = prev.find(item => item.dish.id === dish.id);
      if (match) return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => {
      const match = prev.find(item => item.dish.id === dishId);
      if (match?.quantity === 1) return prev.filter(item => item.dish.id !== dishId);
      return prev.map(item => item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const itemsTotal = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const grandTotal = itemsTotal > 0 ? itemsTotal + 35 : 0;
  const restaurantShare = (itemsTotal * 0.9).toFixed(2);
  const appProfitShare = (itemsTotal * 0.1).toFixed(2);
  const upiString = `upi://pay?pa=9963088662@ybl&pn=BreakfastWarangal&am=${grandTotal}&cu=INR`;

  const filteredDishes = MENU_ITEMS.filter(dish => {
    const matchesCat = selectedCategory === 'All Items' || dish.category === selectedCategory;
    const matchesLoc = selectedLocation === 'All Regions' || dish.location === selectedLocation;
    const isVendorOnline = vendorStatuses.find(v => v.name === dish.restaurant)?.isOnline ?? true;
    return matchesCat && matchesLoc && isVendorOnline;
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#fcfcfd', minHeight: '100vh', color: '#111424' }}>
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f1f3', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#ff7a00', color: '#fff', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>b</div>
          <div>
            <h1 style={{ color: '#ff7a00', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>breakfast</h1>
            <p style={{ color: '#718096', margin: 0, fontSize: '11px' }}>it provides every food item • Warangal Hub</p>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', maxWidth: '1280px', margin: '24px auto', padding: '0 24px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => setSelectedLocation(loc)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: selectedLocation === loc ? '#ff7a00' : '#fff', color: selectedLocation === loc ? '#fff' : '#111', fontWeight: 'bold', cursor: 'pointer' }}>{loc}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', backgroundColor: selectedCategory === cat ? '#ff7a00' : '#fff', color: selectedCategory === cat ? '#fff' : '#4a5568', fontWeight: 'bold', cursor: 'pointer' }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredDishes.map(dish => {
              const cartItem = cart.find(item => item.dish.id === dish.id);
              return (
                <div key={dish.id} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #edf2f7' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#ff7a00', fontWeight: 'bold' }}>{dish.location} • {dish.category}</span>
                    <h3 style={{ margin: '4px 0', fontSize: '16px' }}>{dish.name}</h3>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#718096' }}>{dish.restaurant}</p>
                    <strong>₹{dish.price}</strong>
                  </div>
                  <div>
                    {cartItem ? (
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ff7a00', color: '#fff', borderRadius: '8px' }}>
                        <button onClick={() => removeFromCart(dish.id)} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                        <span>{cartItem.quantity}</span>
                        <button onClick={() => addToCart(dish)} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px 12px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(dish)} style={{ backgroundColor: '#fff', border: '1px solid #ff7a00', color: '#ff7a00', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>ADD</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #edf2f7' }}>
            <h3 style={{ marginTop: 0, paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>🛒 Basket Invoice</h3>
            {cart.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '14px', textAlign: 'center' }}>Your basket is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.dish.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span>{item.dish.name} x{item.quantity}</span>
                    <strong>₹{item.dish.price * item.quantity}</strong>
                  </div>
                ))}
                <div style={{ borderTop: '2px dashed #ff7a00', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Due:</span><strong style={{ color: '#ff7a00', fontSize: '18px' }}>₹{grandTotal}</strong>
                </div>
                <div style={{ backgroundColor: '#fafafa', borderRadius: '12px', padding: '12px', marginTop: '12px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Splits Engine (90/10)</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vendor (90%):</span><span>₹{restaurantShare}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>App Cut (10%):</span><span style={{ color: '#10b981' }}>₹{appProfitShare}</span></div>
                </div>
                <div style={{ marginTop: '12px', backgroundColor: '#fffaf5', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <code style={{ display: 'block', padding: '6px', fontSize: '10px', overflowX: 'auto', marginBottom: '6px' }}>{upiString}</code>
                  <a href={upiString} style={{ display: 'block', backgroundColor: '#ff7a00', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>Pay Directly</a>
                </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
