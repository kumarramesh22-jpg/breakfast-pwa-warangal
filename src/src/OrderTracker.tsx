import React, { useState } from 'react';

interface DeliveryLeg {
  id: string;
  vendorName: string;
  region: 'Hanamkonda' | 'Warangal' | 'Kazipet';
  status: 'Assigning Driver' | 'Arrived at Vendor' | 'Food Picked Up';
}

interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  deliveryAddress: string;
  legs: DeliveryLeg[];
  overallStatus: 'Processing' | 'Out for Delivery' | 'Delivered';
}

export default function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8932',
      customerName: 'Customer Node',
      totalAmount: 50,
      deliveryAddress: 'Subedari, Hanamkonda',
      overallStatus: 'Processing',
      legs: [
        { id: 'leg-1', vendorName: 'Balaji Food Court', region: 'Hanamkonda', status: 'Arrived at Vendor' }
      ]
    }
  ]);

  const updateLegStatus = (orderId: string, legId: string, newStatus: any) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id !== orderId) return order;
      const updatedLegs = order.legs.map(leg => leg.id === legId ? { ...leg, status: newStatus } : leg);
      const allPickedUp = updatedLegs.every(l => l.status === 'Food Picked Up');
      const standardStatus = allPickedUp ? 'Out for Delivery' : 'Processing';
      return { ...order, legs: updatedLegs, overallStatus: standardStatus as any };
    }));
  };

  const markAsDelivered = (orderId: string) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, overallStatus: 'Delivered' } : order
    ));
    alert("Split settlement processing! 90% routed to vendor wallet, 10% kept at admin account.");
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-xl mx-auto my-6 font-sans text-gray-900">
      <div className="border-b pb-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-gray-900">📦 Logistics Dispatch Hub</h2>
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mt-0.5">Multi-Vendor Parallel Pickup Control</p>
        </div>
        {orders.map(o => (
          <span key={o.id} className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-orange-50 text-orange-700">
            {o.overallStatus}
          </span>
        ))}
      </div>

      {orders.map(order => (
        <div key={order.id} className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold">Order ID:</span>
              <span className="font-extrabold text-gray-800">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold">Delivery Address:</span>
              <span className="text-gray-600 font-bold">{order.deliveryAddress}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">🚚 Active Pickup Legs Matrix</h3>
            <div className="space-y-2">
              {order.legs.map(leg => (
                <div key={leg.id} className="border rounded-xl p-3 flex justify-between items-center bg-white">
                  <div>
                    <p className="text-xs font-black text-gray-800">{leg.vendorName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{leg.region} Kitchen</p>
                  </div>
                  <select 
                    value={leg.status} 
                    onChange={(e) => updateLegStatus(order.id, leg.id, e.target.value as any)}
                    className="text-[10px] font-bold border rounded-lg px-2 py-1 bg-white text-gray-700"
                  >
                    <option value="Assigning Driver">⏳ Assigning Driver</option>
                    <option value="Arrived at Vendor">📍 Arrived at Vendor</option>
                    <option value="Food Picked Up">✅ Food Picked Up</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {order.overallStatus !== 'Delivered' ? (
            <button 
              onClick={() => markAsDelivered(order.id)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow transition"
            >
              Confirm Driver Handover & Disburse Splits
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center text-xs font-bold text-emerald-800">
              🎉 90/10 Split Settlement Split Executed Natively to 9963088662
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
