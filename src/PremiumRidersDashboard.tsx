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
  const [registeredRiders] = useState([
    { name: 'Ramesh Kumar', phone: '919963088662' },
    { name: 'Suresh Kumar', phone: '919848022334' },
    { name: 'Anil Kumar', phone: '919000011223' }
  ]);

  const [activeDispatches, setActiveDispatches] = useState<Rider[]>([
    { id: '1', name: 'Ramesh Kumar', phone: '919963088662', status: 'En-Route', location: 'Balaji Food Court', orderItem: 'Ghee Karam Dosa', color: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)', etaSeconds: 900, tripsCompleted: 2 }
  ]);

  const [selectedRiderIndex, setSelectedRiderIndex] = useState('0');
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
          const warangalSpots = ['Naimnagar Junction', 'Subedari Area', 'NIT Warangal Gate', 'Adalat Circle', 'Kazipet Highway'];
          currentLoc = warangalSpots[Math.floor(Math.random() * warangalSpots.length)];
        }

        return { ...rider, etaSeconds: currentEta, location: currentLoc };
      }));
    }, 1000);

    return () => clearInterval(globalTicker);
  }, []);

  const handleDispatchOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    const riderMeta = registeredRiders[parseInt(selectedRiderIndex)];

    const gradients = [
      'linear-gradient(135deg, #8A2387, #E94057, #F27121)',
      'linear-gradient(135deg, #00b4db, #0083b0)',
      'linear-gradient(135deg, #f12711, #f5af19)'
    ];

    const newDispatch: Rider = {
      id: Date.now().toString(),
      name: riderMeta.name,
      phone: riderMeta.phone,
      status: 'Idle',
      location: 'Central Kitchen Hub',
      orderItem: inputFood,
      color: gradients[Math.floor(Math.random() * gradients.length)],
      etaSeconds: 900,
      tripsCompleted: 0
    };

    setActiveDispatches([...activeDispatches, newDispatch]);
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
    let msg = `✨ *Logistics Dispatch Alert* ✨\n\nHello *${rider.name}*,\n`;
    if (rider.status === 'Idle') msg += `Your status is IDLE. Please collect order *${rider.orderItem}* from the kitchen immediately.`;
    if (rider.status === 'En-Route') msg += `🚀 Delivery Update: You are currently mapped en-route near *${rider.location}* delivering *${rider.orderItem}*.`;
    if (rider.status === 'Delivered') msg += `✅ Success! Order task *${rider.orderItem}* marked as completed.`;

    window.open(`https://wa.me{rider.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const totalFleetTrips = activeDispatches.reduce((acc, curr) => acc + curr.tripsCompleted, 0);
  const totalPayoutPool = totalFleetTrips * 40;

  return (
    <div style={{ background: '#0F172A', padding: '24px', borderRadius: '24px', marginTop: '30px', fontFamily: 'system-ui, sans-serif', color: '#F8FAFC' }}>
      
      {/* Console Form Box */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid #334155', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#00F2FE' }}>🚀 Upgraded Micro-Dispatch Console</h3>
        <form onSubmit={handleDispatchOnboard} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Select Available Courier</label>
            <select value={selectedRiderIndex} onChange={e => setSelectedRiderIndex(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #475569', outline: 'none' }}>
              {registeredRiders.map((runner, idx) => (
                <option key={idx} value={idx}>{runner.name}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Assign Prepared Menu Item</label>
            <select value={inputFood} onChange={e => setInputFood(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #475569', outline: 'none' }}>
              <option value="Ghee Karam Dosa">Ghee Karam Dosa</option>
              <option value="Babai Idli">Babai Idli</option>
            </select>
          </div>

          <button type="submit" style={{ height: '45px', padding: '0 24px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #F5576C 0%, #F093FB 100%)', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}>Deploy Runner</button>
        </form>
      </div>

      {/* Tracker Grid Matrix */}
      <h3 style={{ margin: '20px 0 16px 0', fontSize: '18px', color: '#E2E8F0' }}>📍 Live Status Mapping Matrix</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeDispatches.map(rider => (
          <div key={rider.id} style={{ display: 'flex', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ width: '8px', background: rider.color }} />
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#FFF' }}>{rider.name}</h4>
                  <span style={{ fontSize: '12px', color: '#94A3B8', backgroundColor: '#0F172A', padding: '4px 8px', borderRadius: '6px' }}>📦 {rider.orderItem}</span>
                </div>
                
                <div style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: rider.status === 'En-Route' ? '#E8F5E9' : '#F1F5F9', color: rider.status === 'En-Route' ? '#2E7D32' : '#475569' }}>
                  ⏱️ {rider.status === 'En-Route' ? formatClock(rider.etaSeconds) : '00:00'}
                </div>

                <button onClick={() => updateStatus(rider.id, rider.status)} style={{ border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
                  {rider.status} 🔄
                </button>
              </div>

              <div style={{ background: '#0F172A', padding: '10px 14px', borderRadius: '10px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#CBD5E1' }}>📍 <b>Current Orbit:</b> {rider.location}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', padding: '0 4px' }}>
                <span>Shift Trips: <b>{rider.tripsCompleted} completed</b></span>
                <span style={{ color: '#00b4db' }}>Rider Payout: <b>₹{rider.tripsCompleted * 40}</b></span>
              </div>

              <button onClick={() => fireWhatsApp(rider)} style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: '#25D366', color: '#FFF', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                💬 Ping WhatsApp Dispatch
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Payout Summary Floor */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid #334155', padding: '14px 20px', borderRadius: '12px', marginTop: '20px', fontSize: '13px' }}>
        <div>👥 Runners: <b>{activeDispatches.length} active</b></div>
        <div>🏁 Fleet Trips: <b>{totalFleetTrips}</b></div>
        <div style={{ color: '#00F2FE' }}>💰 Total Payout: <b>₹{totalPayoutPool}</b></div>
      </div>

    </div>
  );
};
