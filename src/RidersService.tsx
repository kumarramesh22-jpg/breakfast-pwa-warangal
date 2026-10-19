import { sharedUIStyles, themeColors } from './themeStyles';

import React, { useState, useEffect } from 'react';

// 1. Data Type Configuration
interface Rider {
  id: string;
  name: string;
  phone: string;
  status: 'Ready' | 'Out for Delivery' | 'Delivered';
  currentLocation: string;
  lastUpdated: string;
}

export const RidersService: React.FC = () => {
  // 2. State Management for Riders Database
  const [riders, setRiders] = useState<Rider[]>([
    { id: '1', name: 'Ramesh Kumar', phone: '919963088662', status: 'Ready', currentLocation: 'Balaji Food Court', lastUpdated: 'Just now' },
    { id: '2', name: 'Suresh Kumar', phone: '919848022334', status: 'Out for Delivery', currentLocation: 'Hanamkonda Circle', lastUpdated: '2 mins ago' }
  ]);

  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  // 3. Simulated Real-Time Live Status Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRiders(prevRiders => 
        prevRiders.map(rider => {
          if (rider.status === 'Out for Delivery') {
            const locations = ['Subedari Area', 'Excise Colony', 'Naimnagar', 'Kakatiya University Road'];
            const randomLoc = locations[Math.floor(Math.random() * locations.length)];
            return { ...rider, currentLocation: randomLoc, lastUpdated: 'Updated live' };
          }
          return rider;
        })
      );
    }, 7000); // Updates simulated coordinates/locations every 7 seconds

    return () => clearInterval(interval);
  }, []);

  // 4. Form Action to Add New Riders Safely
  const handleAddNewRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !phoneInput) return;

    // Clean up input phone digits
    const formattedPhone = phoneInput.replace(/\D/g, '');
    const cleanPhone = formattedPhone.startsWith('91') ? formattedPhone : `91${formattedPhone}`;

    const newRider: Rider = {
      id: Date.now().toString(),
      name: nameInput,
      phone: cleanPhone,
      status: 'Ready',
      currentLocation: 'Main Kitchen',
      lastUpdated: 'Registered'
    };

    setRiders([...riders, newRider]);
    setNameInput('');
    setPhoneInput('');
  };

  // 5. Change Status Function
  const toggleStatus = (id: string, currentStatus: Rider['status']) => {
    const nextStatusMap: Record<Rider['status'], Rider['status']> = {
      'Ready': 'Out for Delivery',
      'Out for Delivery': 'Delivered',
      'Delivered': 'Ready'
    };
    
    setRiders(prev => prev.map(r => r.id === id ? { ...r, status: nextStatusMap[currentStatus] } : r));
  };

  // 6. WhatsApp Business Notification Routing Engine
  const sendWhatsAppAlert = (rider: Rider) => {
    let messageText = '';
    
    if (rider.status === 'Ready') {
      messageText = `Hello ${rider.name}, a new breakfast food parcel order is prepared at the food court. Please report for pickup.`;
    } else if (rider.status === 'Out for Delivery') {
      messageText = `Live Status Update: Delivery Rider ${rider.name} is now moving towards the customer location near ${rider.currentLocation}.`;
    } else {
      messageText = `Success! Rider ${rider.name} has marked the food shipment delivery task as completed.`;
    }

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me{rider.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={styles.dashboardContainer}>
      <h2 style={styles.titleGradient}>🚴 Rider Hub & Live Operations</h2>
      
      {/* Dynamic Action Entry Form */}
      <form onSubmit={handleAddNewRider} style={styles.entryForm}>
        <input 
          type="text" 
          placeholder="Enter Rider Name" 
          value={nameInput} 
          onChange={e => setNameInput(e.target.value)} 
          style={styles.inputField} 
        />
        <input 
          type="tel" 
          placeholder="WhatsApp Number (e.g. 99630xxxxx)" 
          value={phoneInput} 
          onChange={e => setPhoneInput(e.target.value)} 
          style={styles.inputField} 
        />
        <button type="submit" style={styles.submitBtn}>Onboard</button>
      </form>

      {/* Visual Live Status Grid */}
      <div style={styles.cardVerticalStack}>
        {riders.map(rider => (
          <div key={rider.id} style={styles.dashboardCard}>
            <div style={styles.cardLeftSection}>
              <div style={styles.avatarCircle}>
                {rider.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style={styles.nameHeader}>{rider.name}</h3>
                <p style={styles.subTextPhone}>📞 +{rider.phone}</p>
                <div style={styles.locationPulseRow}>
                  <span style={styles.pulseDot}></span>
                  <span style={styles.locationText}>📍 {rider.currentLocation} ({rider.lastUpdated})</span>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Controls */}
            <div style={styles.cardRightControls}>
              <button 
                onClick={() => toggleStatus(rider.id, rider.status)}
                style={{
                  ...styles.statusBadgeBtn,
                  backgroundColor: rider.status === 'Ready' ? '#E3F2FD' : rider.status === 'Out for Delivery' ? '#FFF3E0' : '#E8F5E9',
                  color: rider.status === 'Ready' ? '#0D47A1' : rider.status === 'Out for Delivery' ? '#E65100' : '#1B5E20',
                }}
              >
                {rider.status} 🔄
              </button>

              <button onClick={() => sendWhatsAppAlert(rider)} style={styles.whatsappIconBtn}>
                💬 Notify WA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Colorful Visual UI Stylesheet 
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { padding: '20px', backgroundColor: '#FAFAFA', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', margin: '15px 0' },
  titleGradient: { margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(135deg, #11998e, #38ef7d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  entryForm: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  inputField: { flex: '1 1 180px', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', backgroundColor: '#FFF' },
  submitBtn: { padding: '12px 20px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #00b4db, #0083b0)', color: '#FFF', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
  cardVerticalStack: { display: 'flex', flexDirection: 'column', gap: '14px' },
  dashboardCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #EDF2F7', flexWrap: 'wrap', gap: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' },
  cardLeftSection: { display: 'flex', alignItems: 'center', gap: '14px' },
  avatarCircle: { width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFc3a0, #FFAFBD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 'bold', fontSize: '15px' },
  nameHeader: { margin: 0, fontSize: '16px', color: '#2D3748', fontWeight: '600' },
  subTextPhone: { margin: '2px 0 6px 0', fontSize: '13px', color: '#718096' },
  locationPulseRow: { display: 'flex', alignItems: 'center', gap: '6px' },
  pulseDot: { width: '8px', height: '8px', backgroundColor: '#22C55E', borderRadius: '50%', inlineSize: 'auto' },
  locationText: { fontSize: '12px', color: '#4A5568', fontWeight: '500' },
  cardRightControls: { display: 'flex', gap: '10px', alignItems: 'center' },
  statusBadgeBtn: { padding: '8px 12px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  whatsappIconBtn: { padding: '8px 12px', border: 'none', borderRadius: '8px', backgroundColor: '#25D366', color: '#FFF', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }
};
