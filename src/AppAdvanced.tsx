import React, { useState, useEffect } from 'react';

interface Restaurant {
  id: string;
  name: string;
  region: 'Hanamkonda' | 'Warangal' | 'Kazipet';
  upi_id: string;
}

interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  category: 'Tiffins' | 'Meals' | 'Biryani' | 'Street Foods';
  price: number;
}

interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export default function App() {
  const APP_UPI_ADMIN = "9963088662@ybl";
  
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    { id: 'res-1', name: 'Ramya Tiffins', region: 'Hanamkonda', upi_id: 'ramya@upi' },
    { id: 'res-2', name: 'Sri Venkateshwara Mithai', region: 'Hanamkonda', upi_id: 'venkateshwara@upi' }
  ]);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { id: 'item-1', restaurantId: 'res-1', restaurantName: 'Ramya Tiffins', name: 'Ghee Karam Dosa', category: 'Tiffins', price: 65 },
    { id: 'item-2', restaurantId: 'res-2', restaurantName: 'Sri Venkateshwara Mithai', name: 'Babai Idli (4 Pcs)', category: 'Tiffins', price: 45 },
    { id: 'item-3', restaurantId: 'res-1', restaurantName: 'Ramya Tiffins', name: 'Telangana Veg Meals', category: 'Meals', price: 140 }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [newResName, setNewResName] = useState('');
  const [newResRegion, setNewResRegion] = useState<'Hanamkonda' | 'Warangal' | 'Kazipet'>('Hanamkonda');
  const [newResUpi, setNewResUpi] = useState('');

  const [newItemName, setNewItemName] = useState('');
  const [newItemResId, setNewItemResId] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Tiffins' | 'Meals' | 'Biryani' | 'Street Foods'>('Tiffins');
  const [newItemPrice, setNewItemPrice] = useState('');

  useEffect(() => {
    if (restaurants.length > 0 && !newItemResId) {
      setNewItemResId(restaurants[0].id);
    }
  }, [restaurants, newItemResId]);

  const addToCart = (item: FoodItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.foodItem.id === item.id);
      if (existing) {
        return prevCart.map(i => i.foodItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { foodItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, amount: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.foodItem.id === itemId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName || !newResUpi) return alert("Fill all fields");
    const newRes: Restaurant = {
      id: `res-${Date.now()}`,
      name: newResName,
      region: newResRegion,
      upi_id: newResUpi
    };
    setRestaurants([...restaurants, newRes]);
    setNewResName('');
    setNewResUpi('');
    alert("Restaurant added to selection system!");
  };

  const handleAddFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemResId) return alert("Fill all fields");
    const targetRes = restaurants.find(r => r.id === newItemResId);
    if (!targetRes) return;

    const newItem: FoodItem = {
      id: `item-${Date.now()}`,
      restaurantId: newItemResId,
      restaurantName: targetRes.name,
      name: newItemName,
      category: newItemCategory,
      price: parseFloat(newItemPrice)
    };
    setFoodItems([...foodItems, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    alert("Food item added live!");
  };

  const totalDue = cart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  const appCut = Math.round(totalDue * 0.10 * 100) / 100;
  const vendorShare = Math.round(totalDue * 0.90 * 100) / 100;

  const uniqueVendorsInCart = Array.from(new Set(cart.map(item => item.foodItem.restaurantId)));
  const isMultiVendorOrder = uniqueVendorsInCart.length > 1;

  const upiPayloadLink = `upi://pay?pa=${APP_UPI_ADMIN}&pn=BreakfastWarangal&am=${totalDue}&cu=INR&tn=Order_Split_90_10`;

  const filteredItems = foodItems.filter(item => {
    const parentRestaurant = restaurants.find(r => r.id === item.restaurantId);
    if (!parentRestaurant) return false;
    const matchesRegion = selectedRegion === 'All Regions' || parentRestaurant.region === selectedRegion;
    const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
    return matchesRegion && matchesCategory;
  });
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      <header className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">b</div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">breakfast</h1>
            <p className="text-xs text-orange-600 font-semibold tracking-wide uppercase">Warangal District Hub Engine</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdminPanel(!showAdminPanel)} 
          className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
        >
          <span>{showAdminPanel ? "View Front Store" : "Admin Panel Access"}</span>
        </button>
      </header>

      {showAdminPanel ? (
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <h2 className="text-lg font-bold border-b pb-3 mb-4 text-orange-600">Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Restaurant Name</label>
                <input type="text" value={newResName} onChange={e => setNewResName(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500" placeholder="e.g. Balaji Food Court" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Region</label>
                <select value={newResRegion} onChange={e => setNewResRegion(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500">
                  <option value="Hanamkonda">Hanamkonda</option>
                  <option value="Warangal">Warangal</option>
                  <option value="Kazipet">Kazipet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">UPI ID</label>
                <input type="text" value={newResUpi} onChange={e => setNewResUpi(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500" placeholder="vendor@upi" />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold hover:bg-orange-600 transition">Save Partner Vendor</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <h2 className="text-lg font-bold border-b pb-3 mb-4 text-orange-600">Add New Dish</h2>
            <form onSubmit={handleAddFoodItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Vendor</label>
                <select value={newItemResId} onChange={e => setNewItemResId(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500">
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.region})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dish Name</label>
                <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500" placeholder="e.g. Idli" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500">
                    <option value="Tiffins">Tiffins</option>
                    <option value="Meals">Meals</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Street Foods">Street Foods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                  <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:outline-orange-500" placeholder="100" />
                </div>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold hover:bg-black transition">Deploy Item Live</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {['All Regions', 'Hanamkonda', 'Warangal', 'Kazipet'].map(reg => (
                <button 
                  key={reg} 
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${
                    selectedRegion === reg ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 border-b pb-2">
              {['All Items', 'Tiffins', 'Meals', 'Biryani', 'Street Foods'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                    selectedCategory === cat ? 'border-orange-500 text-orange-500 font-extrabold' : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{item.category}</span>
                      <span className="text-xs text-gray-400 font-medium">• {item.restaurantName}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                    <p className="text-lg font-black text-gray-900">₹{item.price}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center space-x-1"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l p-6 flex flex-col h-[calc(100vh-73px)] sticky top-[73px]">
            <div className="flex items-center space-x-2 border-b pb-4 mb-4">
              <h2 className="text-lg font-extrabold tracking-tight">Basket Invoice</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">Basket empty. Select items to view splits.</div>
              ) : (
                cart.map(item => (
                  <div key={item.foodItem.id} className="flex justify-between items-center text-sm border-b border-dashed pb-2">
                    <div className="max-w-[65%]">
                      <p className="font-bold text-gray-800">{item.foodItem.name}</p>
                      <p className="text-xs text-gray-400 truncate">{item.foodItem.restaurantName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.foodItem.id, -1)} className="w-6 h-6 bg-gray-100 rounded-md font-bold flex items-center justify-center">-</button>
                      <span className="font-bold text-sm min-w-[16px] text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item.foodItem)} className="w-6 h-6 bg-gray-100 rounded-md font-bold flex items-center justify-center">+</button>
                      <span className="font-extrabold text-gray-900 ml-2">₹{item.foodItem.price * item.quantity}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {isMultiVendorOrder && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">⚡ Multi-Vendor Pickup Flag Active</p>
                <p className="text-xs text-amber-700 leading-relaxed">System will route separate delivery partners to respective venues concurrently.</p>
              </div>
            )}

            <div className="border-t pt-4 space-y-2.5">
              <div className="flex justify-between text-base font-black text-gray-900">
                <span>Total Due:</span>
                <span className="text-xl text-orange-600">₹{totalDue}</span>
              </div>

              {totalDue > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-1.5 font-medium">
                  <p className="font-bold text-gray-500 uppercase tracking-wide text-[10px] mb-1">90/10 Split Settlement Engine</p>
                  <div className="flex justify-between text-gray-600">
                    <span>Central App Cut (10% to Admin Wallet):</span>
                    <span className="font-bold text-gray-900">₹{appCut}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Vendor Disbursement (90% to Partner):</span>
                    <span className="font-bold text-gray-900 text-emerald-600">₹{vendorShare}</span>
                  </div>
                </div>
              )}

              <a 
                href={totalDue > 0 ? upiPayloadLink : '#'}
                onClick={(e) => totalDue === 0 && e.preventDefault()}
                className={`w-full py-3.5 rounded-xl font-extrabold text-center flex items-center justify-center transition-all ${
                  totalDue > 0 ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Pay Directly via UPI Link</span>
              </a>
              <p className="text-[10px] text-center text-gray-400 mt-1">Routes instant settlement to central aggregator: <strong>9963088662</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
