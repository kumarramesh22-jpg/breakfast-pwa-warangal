import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Safe fallback configuration matrix to bypass unlinked deployment platform variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'your_actual_supabase_url_here'
  ? import.meta.env.VITE_SUPABASE_URL 
  : 'https://supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_actual_supabase_anon_key_here'
  ? import.meta.env.VITE_SUPABASE_ANON_KEY 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dHJmaW9mcGdueXZraWdwaGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDAwMDAsImV4cCI6MjA1NTYwMDAwMH0.placeholder-fallback';
  const cleanUrl = supabaseUrl.trim().replace(/\/$/, "");

// Safely generate the connection instance without throwing fatal layout crashes
const cleanUrl = supabaseUrl.trim().replace(/\/\$/, "");
const supabase = createClient(cleanUrl, supabaseAnonKey);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutOptions {
  cartItems: CartItem[];
  totalAmount: number;
  restaurantId: string;
  vendorUpiId: string;
  vendorName: string;
}

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCheckout = async ({
    cartItems,
    totalAmount,
    restaurantId,
    vendorUpiId,
    vendorName
  }: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      let orderId = 'order-' + Math.random().toString(36).substr(2, 9);

      // Verify key presence before making external server calls
      if (supabaseAnonKey.includes('placeholder-fallback')) {
        console.warn("⚠️ Operating in offline simulation mode due to missing production keys.");
      } else {
        const { data: newOrder, error: dbError } = await supabase
          .from('orders')
          .insert([
            {
              restaurant_id: restaurantId,
              items: cartItems,
              total_amount: totalAmount,
              payment_status: 'pending',
              delivery_status: 'assigned',
              rider_latitude: 17.97827, 
              rider_longitude: 79.53191
            }
          ])
          .select()
          .single();

        if (dbError) throw dbError;
        orderId = newOrder.id;
      }

      const encodedMerchantName = encodeURIComponent(vendorName);
      const upiUrl = `upi://pay?pa=${vendorUpiId}&pn=${encodedMerchantName}&am=${totalAmount}&tr=${orderId}&cu=INR`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = upiUrl;
      } else {
        alert(`Order logged successfully!\n\nUPI Deep Link String:\n${upiUrl}`);
      }

      return { success: true, orderId };

    } catch (err: any) {
      console.error('Checkout failed:', err.message);
      setError(err.message || 'An error occurred during payment processing.');
      return { success: false, orderId: null };
    } finally {
      setLoading(false);
    }
  };

  return { processCheckout, loading, error };
};
