import React, { useState } from 'react';

interface FoodHubNode {
  id: string;
  name: string;
  category: 'Restaurant' | 'Cloud Kitchen' | 'Ice Cream' | 'Street Food';
  region: 'Hanamkonda' | 'Kazipet' | 'Warangal';
  locality: string;
  topDish: string;
  fullMenuOnboarded: boolean;
}

export const LocalityDirectory: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Hanamkonda' | 'Kazipet' | 'Warangal'>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Restaurant' | 'Cloud Kitchen' | 'Ice Cream' | 'Street Food'>('All');

  const [hubs, setHubs] = useState<FoodHubNode[]>([
    { id: '1', name: 'Balaji Food Court', category: 'Restaurant', region: 'Hanamkonda', locality: 'Subedari Area', topDish: 'Ghee Karam Dosa', fullMenuOnboarded: true },
    { id: '2', name: 'Cream Stone Hub', category: 'Ice Cream', region: 'Hanamkonda', locality: 'NIT Road', topDish: 'Nutty Overload Sundae', fullMenuOnboarded: false },
    { id: '3', name: 'Kazipet Junction Biryani Kitchen', category: 'Cloud Kitchen', region: 'Kazipet', locality: 'Railway Station Road', topDish: 'Chicken Biryani Family Pack', fullMenuOnboarded: false },
    { id: '4', name: 'Musi Street Tiffins', category: 'Street Food', region: 'Warangal', locality: 'Chowrasta Market', topDish: 'Mysore Bajji & Punugulu', fullMenuOnboarded: false }
  ]);

  const [newHubName, setNewHubName] = useState('');
  const [newHubCategory, setNewHubCategory] = useState<FoodHubNode['category']>('Restaurant');
  const [newHubRegion, setNewHubRegion] = useState<FoodHubNode['region']>('Hanamkonda');
  const [newHubLocality, setNewHubLocality] = useState('');
  const [newHubDish, setNewHubDish] = useState('');

  const handleRegisterHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubName || !newHubLocality || !newHubDish) return;

    const newBlock: FoodHubNode = {
      id: Date.now().toString(),
      name: newHubName,
      category: newHubCategory,
      region: newHubRegion,
      locality: newHubLocality,
      topDish: newHubDish,
      fullMenuOnboarded: false
    };

    setHubs([...hubs, newBlock]);
    setNewHubName('');
    setNewHubLocality('');
    setNewHubDish('');
  };

  const toggleOnboardStatus = (id: string) => {
    setHubs(prev => prev.map(h => h.id === id ? { ...h, fullMenuOnboarded: !h.fullMenuOnboarded } : h));
  };

  const filteredHubs = hubs.filter(h => {
    const matchReg = selectedRegion === 'All' || h.region === selectedRegion;
    const matchCat = selectedCategory === 'All' || h.category === selectedCategory;
    return matchReg && matchCat;
  });

  return (
    <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E5E9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontFamily: 'system-ui, sans-serif', marginTop: '20px', color: '#333' }}>
      
      <div style={{ borderBottom: '1px solid #EEE', paddingBottom: '12px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#1A1A1A', fontWeight: '800' }}>🏢 Regional Merchant Onboarding Core</h3>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>App: <b style={{ color: '#FF6B00' }}>Breakfast</b> • <i>"it provides every food item"</i></p>
      </div>

      <form onSubmit={handleRegisterHub} style={{ background: '#F8F8FA', padding: '14px', borderRadius: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Outlet Name</label>
          <input type="text" placeholder="e.g. Grand Ice Cream" value={newHubName} onChange={e => setNewHubName(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '12px', outline: 'none', backgroundColor: '#FFF', color: '#000' }} />
        </div>

        <div style={{ flex: '1 1 100px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Region</label>
          <select value={newHubRegion} onChange={e => setNewHubRegion(e.target.value as any)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '12px', backgroundColor: '#FFF', color: '#000' }}>
            <option value="Hanamkonda">Hanamkonda</option>
            <option value="Kazipet">Kazipet</option>
            <option value="Warangal">Warangal</option>
          </select>
        </div>

        <div style={{ flex: '1 1 110px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Locality / Area</label>
          <input type="text" placeholder="e.g. NIT Gate" value={newHubLocality} onChange={e => setNewHubLocality(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '12px', outline: 'none', backgroundColor: '#FFF', color: '#000' }} />
        </div>

        <div style={{ flex: '1 1 110px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Signature Item</label>
          <input type="text" placeholder="e.g. Mango Sundae" value={newHubDish} onChange={e => setNewHubDish(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '12px', outline: 'none', backgroundColor: '#FFF', color: '#000' }} />
        </div>

        <div style={{ flex: '1 1 110px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555' }}>Category</label>
          <select value={newHubCategory} onChange={e => setNewHubCategory(e.target.value as any)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '12px', backgroundColor: '#FFF', color: '#000' }}>
            <option value="Restaurant">Restaurant</option>
            <option value="Cloud Kitchen">Cloud Kitchen</option>
            <option value="Ice Cream">Ice Cream</option>
            <option value="Street Food">Street Food</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '9px 16px', background: '#FF6B00', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>+ Add Node</button>
      </form>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '4px' }}>📍 TARGET TRICITY REGION:</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['All', 'Hanamkonda', 'Kazipet', 'Warangal'] as const).map(reg => (
            <button key={reg} type="button" onClick={() => setSelectedRegion(reg)} style={{ padding: '5px 12px', borderRadius: '15px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedRegion === reg ? '#1A1A1A' : '#F0F0F4', color: selectedRegion === reg ? '#FFF' : '#333' }}>
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '4px' }}>🍔 VERTICAL GROUP:</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['All', 'Restaurant', 'Cloud Kitchen', 'Ice Cream', 'Street Food'] as const).map(cat => (
            <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #E5E5E9', fontSize: '11px', fontWeight: '600', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#FFF0E5' : '#FFF', color: selectedCategory === cat ? '#FF6B00' : '#555' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredHubs.map(hub => (
          <div key={hub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '10px', backgroundColor: '#F8F8FA', border: '1px solid #E5E5E9' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#1A1A1A' }}>{hub.name} <span style={{ fontSize: '11px', color: '#777', fontWeight: 'normal' }}>({hub.region})</span></h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#666' }}>📍 Locality: {hub.locality}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#888' }}>🍛 Lead Item: <b style={{ color: '#FF6B00' }}>{hub.topDish}</b></p>
            </div>
            
            <button 
              type="button"
              onClick={() => toggleOnboardStatus(hub.id)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: hub.fullMenuOnboarded ? '#D4EDDA' : '#FFEBEE',
                color: hub.fullMenuOnboarded ? '#155724' : '#C62828'
              }}
            >
              {hub.fullMenuOnboarded ? '✅ Active Menu' : '❌ Pending Permit'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
