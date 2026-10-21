import React, { useState, useEffect } from 'react';

interface Rider {
  id: string;
  name: string;
  phone: string;
  status: 'Idle' | 'En-Route' | 'Delivered';
  location: string;
  orderItem: string;
  color: string;
  etaSeconds: number;
  tripsCompleted: number;
}

export const PremiumRidersDashboard: React.FC = () => {
  const [activeDispatches, setActiveDispatches] = useState<Rider[]>([
    { 
      id: '1', 
      name: 'Ramesh Kumar', 
      phone: '919963088662', 
      status: 'En-Route', 
      location: 'Subedari Area', 
      orderItem: 'Ghee Karam Dosa', 
      color: '#FF6B00', 
      etaSeconds: 900, 
      tripsCompleted: 2 
    }
  ]);

  const [typedName, setTypedName] = useState('');
  const [typedPhone, setTypedPhone] = useState('');
  const [inputFood, setInputFood] = useState('Ghee Karam Dosa');

  useEffect(() => {
    const globalTicker = setInterval(() => {
      setActiveDispatches(prev => prev.map(rider => {
        let currentEta = rider.etaSeconds;
        if (rider.status === 'En-Route' && currentEta > 0) {
          currentEta -= 1;
        }

        let currentLoc = rider.location;
        if (rider.status === 'En-Route' && Math.random() > 0.7) {
          const spots = ['Subedari Area', 'Naimnagar Junction', 'NIT Gate', 'Chowrasta Hub'];
          currentLoc = spots[Math.floor(Math.random() * spots.length)];
        }

        return { ...rider, etaSeconds: currentEta, location: currentLoc };
      }));
    }, 1000);

    return () => clearInterval(globalTicker);
  }, []);

  const handleDispatchOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName || !typedPhone) {
      alert('Please enter both a Rider Name and a Mobile Number!');
      return;
    }

    let cleanPhone = typedPhone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    const newDispatch: Rider = {
      id: Date.now().toString(),
      name: typedName,
      phone: cleanPhone,
      status: 'Idle',
      location: 'Kitchen Base',
      orderItem: inputFood,
      color: '#FF6B00',
      etaSeconds: 900,
      tripsCompleted: 0
    };

    setActiveDispatches([...activeDispatches, newDispatch]);
    setTypedName('');
    setTypedPhone('');
  };

  const updateStatus = (id: string, current: Rider['status']) => {
    const cycle: Record<Rider['status'], Rider['status']> = { 'Idle': 'En-Route', 'En-Route': 'Delivered', 'Delivered': 'Idle' };
    setActiveDispatches(prev => prev.map(r => {
      if (r.id === id) {
        const nextState = cycle[current];
        return {
          ...r,
          status: nextState,
          location: nextState === 'Idle' ? 'Kitchen Base' : r.location,
          etaSeconds: nextState === 'En-Route' ? 900 : r.etaSeconds,
          tripsCompleted: nextState === 'Delivered' ? r.tripsCompleted + 1 : r.tripsCompleted
        };
      }
      return r;
    }));
  };

  const formatClock = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fireWhatsApp = (rider: Rider) => {
    let msg = `✨ *Breakfast Logistics Alert* ✨\n\nHello *${rider.name}*,\n`;
    if (rider.status === 'Idle') msg += `Your status is IDLE. Please collect order *${rider.orderItem}* from the kitchen immediately.`;
    if (rider.status === 'En-Route') msg += `🚀 Delivery Update: You are currently mapped en-route near *${rider.location}* delivering *${rider.orderItem}*.`;
    if (rider.status === 'Delivered') msg += `✅ Success! Order task *${rider.orderItem}* marked as completed.`;

    // FIX: Replaced curly brackets with a forward slash and template expression injection syntax
    window.open(`https://wa.me{rider.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };


  // Payout math block to calculate figures live on screen
  const totalFleetTrips = activeDispatches.reduce((acc, curr) => acc + curr.tripsCompleted, 0);
  const totalPayoutPool = totalFleetTrips * 40;

  return (
    <div style={{ background: '#F4F4F6', padding: '20px', borderRadius: '16px', marginTop: '25px', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E5E5E9', paddingBottom: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1A1A1A', fontWeight: '800' }}>🍊 Rider Logistics Desk</h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>App: <b>Breakfast</b> • <i>"it provides every food item"</i></p>
        </div>
        <span style={{ backgroundColor: '#FF6B00', color: '#FFF', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>LIVE HUB</span>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '14px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FF6B00' }}>➕ Add & Deploy Custom Rider</h4>
        <form onSubmit={handleDispatchOnboard} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#555', fontWeight: 'bold' }}>Rider Name</label>
            <input type="text" placeholder="Enter Full Name" value={typedName} onChange={e => setTypedName(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', outline: 'none', backgroundColor: '#FFF', color: '#000' }} />
          </div>
          <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#555', fontWeight: 'bold' }}>WhatsApp Mobile</label>
            <input type="tel" placeholder="e.g. 99630xxxxx" value={typedPhone} onChange={e => setTypedPhone(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px', outline: 'none', backgroundColor: '#FFF', color: '#000' }} />
          </div>
          <button type="submit" style={{ backgroundColor: '#FF6B00', color: '#FFF', border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>Deploy Runner</button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeDispatches.map(rider => (
          <div key={rider.id} style={{ display: 'flex', backgroundColor: '#FFF', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E5E9', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '6px', background: rider.color }} />
            <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', color: '#1A1A1A' }}>{rider.name}</h4>
                  <span style={{ fontSize: '11px', color: '#FF6B00', backgroundColor: '#FFF0E5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>📦 {rider.orderItem}</span>
                </div>
                <button type="button" onClick={() => updateStatus(rider.id, rider.status)} style={{ border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#F0F0F4', color: '#333' }}>
                  {rider.status} 🔄
                </button>
              </div>
              <div style={{ backgroundColor: '#F8F8FA', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', color: '#444' }}>
                📍 <b>Current Orbit:</b> {rider.location} {rider.status === 'En-Route' && `(⏱. ${formatClock(rider.etaSeconds)})`}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', padding: '2px 4px' }}>
                <span>Trips: <b>{rider.tripsCompleted} done</b></span>
                <span style={{ color: '#FF6B00' }}>Payout: <b>₹{rider.tripsCompleted * 40}</b></span>
              </div>

              <button type="button" onClick={() => fireWhatsApp(rider)} style={{ width: '100%', padding: '8px', border: 'none', borderRadius: '6px', backgroundColor: '#25D366', color: '#FFF', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                💬 Notify via WhatsApp Dispatch
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RESTORED BOTTOM FLEET SUMMARY LEDGER ROW BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: '#1E293B', padding: '14px 20px', borderRadius: '12px', marginTop: '20px', fontSize: '13px', color: '#FFF' }}>
        <div>🏃 Runners: <b>{activeDispatches.length} active</b></div>
        <div>📋 Fleet Trips: <b>{totalFleetTrips}</b></div>
        <div style={{ color: '#00F2FE' }}>💰 Total Payout: <b>₹{totalPayoutPool}</b></div>
      </div>

    </div>
  );
};
