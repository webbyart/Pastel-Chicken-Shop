
import { supabase } from '../supabaseClient';
import { Product, Order, Promotion } from '../types';

// Helper to handle Supabase errors gracefully
const handleError = (error: any, context: string) => {
  // Check for Postgres "undefined_table" error (Code 42P01) or PostgREST "schema cache miss" (Code PGRST205)
  if (error?.code === '42P01' || error?.code === 'PGRST205') {
      // Throw a specific error string we can check for
      throw new Error('TABLE_MISSING');
  }

  // Log other actual errors
  console.error(`Supabase Error [${context}]:`, JSON.stringify(error, null, 2));
  throw new Error(error.message || JSON.stringify(error) || `Database error in ${context}`);
};

// --- Products ---
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) handleError(error, 'getProducts');
    return data || [];
  } catch (e: any) {
    if (e.message === 'TABLE_MISSING') {
        // Table doesn't exist, return empty array so App uses mock data
        return [];
    }
    console.warn("Could not fetch products, returning empty list.", e.message);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const { data, error } = await supabase.from('products').insert([product]).select();
  if (error) handleError(error, 'addProduct');
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) handleError(error, 'deleteProduct');
};

// --- Orders ---
export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) handleError(error, 'getOrders');
    
    return data?.map(o => ({
        ...o,
        totalPrice: Number(o.total_price),
        customerName: o.customer_name,
        paymentMethod: o.payment_method,
        deliveryMethod: o.delivery_method,
        pickupTime: o.pickup_time,
        deliveryAddress: o.delivery_address,
        date: new Date(o.created_at).toLocaleString('th-TH')
    })) || [];
  } catch (e: any) {
    if (e.message === 'TABLE_MISSING') return [];
    console.warn("Could not fetch orders.", e.message);
    return [];
  }
};

export const createOrder = async (order: Order) => {
  const dbOrder = {
    id: order.id,
    user_id: order.userId,
    customer_name: order.customerName,
    items: order.items,
    total_price: order.totalPrice,
    status: order.status,
    payment_method: order.paymentMethod,
    delivery_method: order.deliveryMethod,
    delivery_address: order.deliveryAddress,
    pickup_time: order.pickupTime,
  };
  
  const { error } = await supabase.from('orders').insert([dbOrder]);
  if (error) handleError(error, 'createOrder');
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) handleError(error, 'updateOrderStatus');
};

// --- Settings (QR Code) ---
export const getQrCode = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.from('app_settings').select('value').eq('key', 'payment_qr_code').maybeSingle();
    
    if (error) handleError(error, 'getQrCode');
    return data?.value || '';
  } catch (e: any) {
    if (e.message === 'TABLE_MISSING') return '';
    return '';
  }
};

export const updateQrCode = async (base64Image: string) => {
  // Check if update is possible or insert
  // We use upsert logic if possible, or try select then update
  try {
    const { data, error: selectError } = await supabase.from('app_settings').select('*').eq('key', 'payment_qr_code');
    
    if (selectError) handleError(selectError, 'updateQrCode (check)');

    let error;
    if (data && data.length > 0) {
        const res = await supabase.from('app_settings').update({ value: base64Image }).eq('key', 'payment_qr_code');
        error = res.error;
    } else {
        const res = await supabase.from('app_settings').insert([{ key: 'payment_qr_code', value: base64Image }]);
        error = res.error;
    }
    if (error) handleError(error, 'updateQrCode');
  } catch (e: any) {
      if (e.message === 'TABLE_MISSING') {
          throw new Error('ยังไม่ได้สร้างตาราง app_settings กรุณาสร้างตารางในหน้าตั้งค่า');
      }
      throw e;
  }
};

// --- Promotions ---
export const getPromotions = async (): Promise<Promotion[]> => {
    try {
      const { data, error } = await supabase.from('promotions').select('*');
      if (error) handleError(error, 'getPromotions');
      return data || [];
    } catch (e: any) {
      if (e.message === 'TABLE_MISSING') return [];
      console.warn("Could not fetch promotions.", e.message);
      return [];
    }
};

export const addPromotion = async (promo: Omit<Promotion, 'id'>) => {
    const { error } = await supabase.from('promotions').insert([promo]);
    if (error) handleError(error, 'addPromotion');
};

export const checkConnection = async () => {
    try {
        const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
        if (error) handleError(error, 'checkConnection');
        return count;
    } catch (e: any) {
        if (e.message === 'TABLE_MISSING') throw new Error("ยังไม่ได้สร้างตารางในฐานข้อมูล (Table Missing)");
        throw e;
    }
};
