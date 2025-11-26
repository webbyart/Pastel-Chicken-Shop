
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  LayoutDashboard, ShoppingBag, FileText, Settings, Users, LogOut, Search, CheckCircle, XCircle, Plus, Trash2, Upload, Wifi, Database, Copy, Terminal
} from 'lucide-react';
import { Card, Button, Badge, Input } from './ui';
import { Order, Product, CATEGORIES, Promotion } from '../types';
import * as db from '../services/db';

interface AdminProps {
  onLogout: () => void;
}

// SQL Schema for user convenience
const SQL_SCHEMA = `
-- 1. Create Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  image text,
  category text,
  calories text,
  options jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Orders Table
create table if not exists public.orders (
  id text primary key,
  user_id text,
  customer_name text,
  items jsonb,
  total_price numeric,
  status text,
  payment_method text,
  delivery_method text,
  delivery_address text,
  pickup_time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Promotions Table
create table if not exists public.promotions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image text,
  code text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create App Settings Table
create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable RLS (Simplified for Demo)
alter table public.products enable row level security;
create policy "Public Access Products" on public.products for all using (true);

alter table public.orders enable row level security;
create policy "Public Access Orders" on public.orders for all using (true);

alter table public.promotions enable row level security;
create policy "Public Access Promotions" on public.promotions for all using (true);

alter table public.app_settings enable row level security;
create policy "Public Access Settings" on public.app_settings for all using (true);
`;

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: any) => {
  const menu = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'orders', label: 'คำสั่งซื้อ', icon: ShoppingBag },
    { id: 'products', label: 'สินค้า', icon: Settings }, 
    { id: 'promotions', label: 'โปรโมชั่น', icon: FileText },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <div className="w-64 bg-stone-900 border-r border-stone-800 hidden md:flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-300">Chicken Admin</h1>
        <p className="text-xs text-stone-500 mt-1">Back-office System</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-300 text-stone-900 font-bold' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'}`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-stone-800">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-stone-800 rounded-xl transition-colors">
          <LogOut size={20} />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

const AdminBottomNav = ({ activeTab, setActiveTab, onLogout }: any) => {
  const menu = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'orders', label: 'ออเดอร์', icon: ShoppingBag },
    { id: 'products', label: 'สินค้า', icon: Settings },
    { id: 'promotions', label: 'โปรฯ', icon: FileText },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-stone-900 border-t border-stone-800 flex justify-between items-center px-4 py-2 md:hidden z-50 pb-safe">
      {menu.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${activeTab === item.id ? 'text-orange-300' : 'text-stone-500'}`}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
      <button onClick={onLogout} className="flex flex-col items-center gap-1 p-2 text-red-400">
          <LogOut size={20} />
          <span className="text-[10px] font-medium">ออก</span>
      </button>
    </div>
  );
};

const DashboardWidget = ({ title, value, sub, icon: Icon, color }: any) => (
  <Card className="flex items-center gap-4">
    <div className={`p-4 rounded-full ${color} text-stone-900`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-stone-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-stone-100">{value}</h3>
      <p className="text-xs text-stone-500">{sub}</p>
    </div>
  </Card>
);

export const AdminDashboard = ({ onLogout }: AdminProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);

  // Forms State
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'chicken', image: '', description: '' });
  const [newPromo, setNewPromo] = useState({ title: '', description: '', image: '', code: '' });
  const [qrCode, setQrCode] = useState('');
  const [dbStatus, setDbStatus] = useState<string>('ไม่ได้ทดสอบ');
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // We fetch each one individually with catch to prevent one failure from blocking others
    const fetchOrders = db.getOrders().catch(e => {
        console.warn('Failed orders', e);
        return [];
    });
    const fetchProducts = db.getProducts().catch(e => {
        console.warn('Failed products', e);
        return [];
    });
    const fetchPromos = db.getPromotions().catch(e => {
        console.warn('Failed promos', e);
        return [];
    });
    const fetchQr = db.getQrCode().catch(e => {
        console.warn('Failed qr', e);
        return '';
    });

    const [o, p, pr, qr] = await Promise.all([fetchOrders, fetchProducts, fetchPromos, fetchQr]);

    setOrders(o);
    setProducts(p);
    setPromotions(pr);
    setQrCode(qr);
    
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
        await db.updateOrderStatus(orderId, newStatus);
        fetchData(); 
    } catch (e) {
        alert("ไม่สามารถอัปเดตสถานะได้");
    }
  };

  const handleProductImageUpload = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = async () => {
              const base64 = reader.result as string;
              setNewProduct({ ...newProduct, image: base64 });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("กรุณากรอกชื่อและราคา");
    try {
        await db.addProduct({
            name: newProduct.name,
            description: newProduct.description,
            price: Number(newProduct.price),
            image: newProduct.image || 'https://placehold.co/400',
            category: newProduct.category,
            calories: 'N/A'
        });
        setNewProduct({ name: '', price: '', category: 'chicken', image: '', description: '' });
        fetchData();
    } catch (e) {
        alert("บันทึกสินค้าไม่สำเร็จ");
    }
  };

  const handleDeleteProduct = async (id: string) => {
      if(!window.confirm("ยืนยันการลบสินค้า?")) return;
      try {
        await db.deleteProduct(id);
        fetchData();
      } catch (e) {
        alert("ลบสินค้าไม่สำเร็จ");
      }
  };

  const handleAddPromo = async () => {
      try {
        await db.addPromotion({
            title: newPromo.title,
            description: newPromo.description,
            image: newPromo.image || 'https://placehold.co/600x200',
            code: newPromo.code,
            active: true
        });
        setNewPromo({ title: '', description: '', image: '', code: '' });
        fetchData();
      } catch (e) {
          alert("สร้างโปรโมชั่นไม่สำเร็จ");
      }
  };

  const handleQrUpload = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = async () => {
              const base64 = reader.result as string;
              setQrCode(base64);
              try {
                await db.updateQrCode(base64);
                alert("อัปโหลด QR Code เรียบร้อยแล้ว");
              } catch (e) {
                alert("อัปโหลดไม่สำเร็จ");
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const testDb = async () => {
      setDbStatus('กำลังทดสอบ...');
      try {
          const count = await db.checkConnection();
          setDbStatus(`เชื่อมต่อสำเร็จ (พบสินค้า ${count} รายการ)`);
      } catch (e: any) {
          setDbStatus(`เชื่อมต่อล้มเหลว: ${e.message}`);
      }
  };

  const copySqlToClipboard = () => {
      navigator.clipboard.writeText(SQL_SCHEMA);
      alert("คัดลอก SQL Code แล้ว");
  };

  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((acc, order) => acc + order.totalPrice, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">ภาพรวมวันนี้</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <DashboardWidget title="ยอดขายรวม" value={`฿${totalSales.toLocaleString()}`} sub="จากคำสั่งซื้อทั้งหมด" icon={ShoppingBag} color="bg-orange-300" />
              <DashboardWidget title="ออเดอร์ทั้งหมด" value={orders.length} sub="รายการสั่งซื้อ" icon={FileText} color="bg-pink-300" />
              <DashboardWidget title="สินค้าในระบบ" value={products.length} sub="รายการสินค้า" icon={Settings} color="bg-teal-200" />
            </div>
            
            <Card className="p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">รายการล่าสุด</h3>
                <div className="space-y-3">
                  {orders.length === 0 ? <p className="text-stone-500">ยังไม่มีรายการสั่งซื้อ</p> : 
                    orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-stone-900/50 rounded-xl">
                      <div>
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-xs text-stone-500">#{order.id}</p>
                      </div>
                      <Badge status={order.status} />
                    </div>
                  ))}
                </div>
              </Card>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">จัดการคำสั่งซื้อ ({orders.length})</h2>
                <Button variant="ghost" onClick={fetchData}>รีเฟรช</Button>
             </div>
             
             <div className="grid gap-4">
                {orders.length === 0 ? <p className="text-stone-500 text-center py-10">ยังไม่มีออเดอร์เข้ามา</p> :
                 orders.map(order => (
                  <Card key={order.id} className="flex flex-col md:flex-row justify-between gap-4 border-l-4 border-l-orange-300">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-orange-300 font-bold text-lg">#{order.id}</span>
                            <span className="ml-3 text-stone-400 text-sm">{order.date}</span>
                        </div>
                        <Badge status={order.status} />
                      </div>
                      <p className="font-medium text-lg">{order.customerName}</p>
                      <p className="text-sm text-stone-400 mb-2">{order.deliveryMethod === 'delivery' ? `จัดส่ง: ${order.deliveryAddress}` : `รับเอง: ${order.pickupTime}`}</p>
                      <div className="bg-stone-900/50 p-3 rounded-lg text-sm text-stone-300">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name} {item.selectedOptions && Object.values(item.selectedOptions).join(', ')}</span>
                            <span>฿{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t border-stone-700 mt-2 pt-2 flex justify-between font-bold text-orange-200">
                          <span>ยอดรวม</span>
                          <span>฿{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 justify-center min-w-[150px]">
                       {order.status === 'pending_payment' && (
                         <>
                            <Button variant="primary" onClick={() => handleStatusChange(order.id, 'paid')} className="text-sm">ยืนยันชำระเงิน</Button>
                            <Button variant="danger" onClick={() => handleStatusChange(order.id, 'cancelled')} className="text-sm">ยกเลิก</Button>
                         </>
                       )}
                       {order.status === 'paid' && (
                         <Button variant="primary" onClick={() => handleStatusChange(order.id, 'preparing')} className="text-sm">รับออเดอร์/ปรุง</Button>
                       )}
                       {order.status === 'preparing' && (
                         <Button variant="success" onClick={() => handleStatusChange(order.id, 'delivered')} className="text-sm">พร้อมส่ง/รับ</Button>
                       )}
                    </div>
                  </Card>
                ))}
             </div>
          </div>
        );
      case 'products':
          return (
              <div className="space-y-6">
                  <h2 className="text-3xl font-bold">จัดการสินค้า</h2>
                  <Card className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={20}/> เพิ่มสินค้าใหม่</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input label="ชื่อสินค้า" value={newProduct.name} onChange={(e: any) => setNewProduct({...newProduct, name: e.target.value})} />
                          <Input label="ราคา (บาท)" type="number" value={newProduct.price} onChange={(e: any) => setNewProduct({...newProduct, price: e.target.value})} />
                          <div className="mb-4">
                              <label className="block text-sm text-stone-400 mb-2">หมวดหมู่</label>
                              <select 
                                value={newProduct.category} 
                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                className="w-full bg-stone-800 border border-stone-700 rounded-2xl p-3 text-white"
                              >
                                  {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                              </select>
                          </div>
                          
                          <div className="mb-4">
                              <label className="block text-sm text-stone-400 mb-2">รูปภาพสินค้า</label>
                              <div className="flex items-center gap-4">
                                  <div className="w-20 h-20 bg-stone-700 rounded-lg overflow-hidden flex items-center justify-center border border-stone-600">
                                      {newProduct.image ? (
                                          <img src={newProduct.image} className="w-full h-full object-cover" />
                                      ) : (
                                          <ShoppingBag className="text-stone-500" />
                                      )}
                                  </div>
                                  <div className="relative">
                                      <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" id="product-img-upload" />
                                      <label htmlFor="product-img-upload" className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-sm">
                                          <Upload size={16} /> อัปโหลดรูป
                                      </label>
                                  </div>
                              </div>
                          </div>

                          <div className="md:col-span-2">
                             <Input label="รายละเอียด" value={newProduct.description} onChange={(e: any) => setNewProduct({...newProduct, description: e.target.value})} />
                          </div>
                      </div>
                      <Button onClick={handleAddProduct} className="mt-4">บันทึกสินค้า</Button>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map(p => (
                          <Card key={p.id} className="relative group">
                              <img src={p.image} className="w-full h-32 object-cover rounded-xl mb-3" />
                              <h3 className="font-bold">{p.name}</h3>
                              <p className="text-orange-300">฿{p.price}</p>
                              <button onClick={() => handleDeleteProduct(p.id)} className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={16} />
                              </button>
                          </Card>
                      ))}
                  </div>
              </div>
          );
      case 'promotions':
          return (
              <div className="space-y-6">
                  <h2 className="text-3xl font-bold">จัดการโปรโมชั่น</h2>
                  <Card className="p-6">
                      <h3 className="font-bold mb-4">เพิ่มโปรโมชั่น</h3>
                      <div className="space-y-4">
                          <Input label="หัวข้อโปรโมชั่น" value={newPromo.title} onChange={(e: any) => setNewPromo({...newPromo, title: e.target.value})} />
                          <Input label="รายละเอียด" value={newPromo.description} onChange={(e: any) => setNewPromo({...newPromo, description: e.target.value})} />
                          <Input label="URL รูปภาพ Banner" value={newPromo.image} onChange={(e: any) => setNewPromo({...newPromo, image: e.target.value})} />
                      </div>
                      <Button onClick={handleAddPromo} className="mt-4">สร้างโปรโมชั่น</Button>
                  </Card>
                  
                  <div className="space-y-4">
                      {promotions.map(p => (
                          <div key={p.id} className="bg-stone-800 rounded-xl p-4 flex gap-4">
                              <img src={p.image} className="w-24 h-24 rounded-lg object-cover" />
                              <div>
                                  <h3 className="font-bold text-lg">{p.title}</h3>
                                  <p className="text-stone-400">{p.description}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      case 'settings':
          return (
              <div className="space-y-6">
                  <h2 className="text-3xl font-bold">ตั้งค่าระบบ</h2>
                  
                  <Card className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Wifi size={20}/> การเชื่อมต่อฐานข้อมูล</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" onClick={testDb}>ทดสอบการเชื่อมต่อ</Button>
                            <span className={`${dbStatus.includes('สำเร็จ') ? 'text-green-400' : 'text-stone-400'}`}>{dbStatus}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-2">Project URL: https://fuiutzmkcwtuzjtbgfsg.supabase.co</p>
                      </div>
                  </Card>

                  <Card className="p-6">
                      <h3 className="font-bold mb-4 flex items-center gap-2"><Database size={20} /> โครงสร้างฐานข้อมูล (SQL)</h3>
                      <p className="text-stone-400 text-sm mb-4">หากยังไม่ได้สร้างตาราง ให้คัดลอกโค้ดด้านล่างไปวางใน Supabase SQL Editor</p>
                      
                      {!showSql ? (
                          <Button variant="secondary" onClick={() => setShowSql(true)} className="flex gap-2">
                              <Terminal size={18} /> แสดงโค้ด SQL สร้างตาราง
                          </Button>
                      ) : (
                          <div className="relative">
                              <textarea 
                                  readOnly 
                                  className="w-full h-64 bg-stone-900 border border-stone-700 rounded-xl p-4 text-xs font-mono text-stone-300 focus:outline-none"
                                  value={SQL_SCHEMA}
                              />
                              <div className="flex gap-2 mt-2">
                                  <Button onClick={copySqlToClipboard} variant="primary" className="text-xs">
                                      <Copy size={16} /> คัดลอกโค้ด
                                  </Button>
                                  <Button onClick={() => setShowSql(false)} variant="ghost" className="text-xs">
                                      ซ่อน
                                  </Button>
                              </div>
                          </div>
                      )}
                  </Card>

                  <Card className="p-6">
                      <h3 className="font-bold mb-4">QR Code สำหรับรับชำระเงิน</h3>
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center">
                              {qrCode ? (
                                  <img src={qrCode} className="w-full h-full object-contain" />
                              ) : (
                                  <span className="text-stone-900 text-xs">ยังไม่มี QR Code</span>
                              )}
                          </div>
                          <div className="flex-1">
                              <p className="mb-4 text-stone-400">อัปโหลดรูปภาพ QR Code พร้อมเพย์หรือธนาคาร เพื่อแสดงให้ลูกค้าสแกนจ่ายในหน้า Checkout</p>
                              <div className="relative">
                                  <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" id="qr-upload" />
                                  <label htmlFor="qr-upload" className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 w-fit">
                                      <Upload size={16} /> เลือกรูปภาพ
                                  </label>
                              </div>
                          </div>
                      </div>
                  </Card>
              </div>
          );
      default:
        return <div>Unknown Tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 pb-20 md:pb-0">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
         {renderContent()}
      </div>
      <AdminBottomNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
    </div>
  );
};
