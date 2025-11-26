
import React, { useState, useEffect } from 'react';
import { 
  Home, ShoppingBag, User, History, Tag, ChevronLeft, Minus, Plus, MapPin, CreditCard, Upload, Share2, Check, Copy
} from 'lucide-react';
import { Button, Card, Input, Badge } from './ui';
import { Product, CartItem, CATEGORIES, Order } from '../types';
import * as db from '../services/db';

/* --- Screens --- */

export const HomeScreen = ({ navigate, onSelectProduct, products, promotions }: any) => (
  <div className="p-4 space-y-6 pb-24 relative">
    <header className="pt-2">
       <div>
         <h1 className="text-2xl font-black text-orange-300 tracking-tight">ร้าน นายขายไก่</h1>
         <p className="text-xs text-stone-400">อร่อยจนต้องร้องขอชีวิต</p>
       </div>
       <div 
         className="bg-stone-800 p-2 rounded-full absolute top-4 right-4 cursor-pointer shadow-lg shadow-black/30" 
         onClick={() => navigate('profile')}
       >
         <User size={20} className="text-stone-300" />
       </div>
    </header>

    {/* Banner - Display first promotion or default */}
    <div className="w-full h-40 bg-gradient-to-r from-orange-300 to-pink-300 rounded-3xl p-5 flex items-center justify-between shadow-lg shadow-orange-900/20 relative overflow-hidden">
        {promotions && promotions.length > 0 ? (
            <div className="relative z-10 text-stone-900 w-full h-full flex flex-col justify-center">
                <h2 className="text-xl font-extrabold line-clamp-1">{promotions[0].title}</h2>
                <p className="font-medium text-sm mb-3 line-clamp-1">{promotions[0].description}</p>
                <button onClick={() => navigate('promo')} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold w-fit">ดูรายละเอียด</button>
                {promotions[0].image && <img src={promotions[0].image} className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full border-4 border-white/30 rotate-12 shadow-xl object-cover" alt="Promo" />}
            </div>
        ) : (
             <div className="relative z-10 text-stone-900">
                <h2 className="text-2xl font-extrabold">โปรเด็ด!</h2>
                <p className="font-medium text-sm mb-3">ลด 50% ชุดครอบครัว</p>
                <button onClick={() => navigate('shop')} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold">สั่งเลย</button>
                <img src="https://picsum.photos/200/200?random=10" className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full border-4 border-white/30 rotate-12 shadow-xl" alt="Chicken" />
            </div>
        )}
    </div>

    {/* Popular Categories */}
    <div>
        <h3 className="text-lg font-bold mb-3 text-stone-200">หมวดหมู่</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {['ไก่ทอด', 'เซ็ตจุใจ', 'ของทานเล่น', 'เครื่องดื่ม'].map((cat, i) => (
                <div key={i} onClick={() => navigate('shop')} className="flex-shrink-0 w-28 h-28 bg-stone-800/50 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 border border-stone-700/50 active:scale-95 transition-transform">
                     <img src={`https://picsum.photos/100/100?random=${i+20}`} className="w-14 h-14 rounded-full object-cover" />
                     <span className="text-xs font-medium text-stone-300">{cat}</span>
                </div>
            ))}
        </div>
    </div>

    {/* Product Grid on Home */}
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-stone-100">เมนูแนะนำ 🍗</h2>
        <button onClick={() => navigate('shop')} className="text-xs text-orange-300">ดูทั้งหมด</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {products.slice(0, 4).map((product: Product) => (
          <Card key={product.id} className="!p-0 overflow-hidden flex flex-col h-full" onClick={() => onSelectProduct(product)}>
            <div className="h-32 bg-stone-700 relative">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                <button className="absolute bottom-2 right-2 bg-orange-300 text-stone-900 p-2 rounded-full shadow-lg">
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-stone-200 line-clamp-1">{product.name}</h3>
                <p className="text-[10px] text-stone-500 line-clamp-2 mt-1 mb-2 flex-1">{product.description}</p>
                <div className="text-orange-300 font-bold">฿{product.price}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const ProductListScreen = ({ navigate, onSelectProduct, products }: any) => {
  const [activeCat, setActiveCat] = useState('all');

  const filtered = activeCat === 'all' 
    ? products 
    : products.filter((p: Product) => p.category === activeCat);

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold mb-4">เมนูทั้งหมด 🍗</h2>
      
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCat === cat.id ? 'bg-orange-300 text-stone-900' : 'bg-stone-800 text-stone-400'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((product: Product) => (
          <Card key={product.id} className="!p-0 overflow-hidden flex flex-col h-full" onClick={() => onSelectProduct(product)}>
            <div className="h-32 bg-stone-700 relative">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                <button className="absolute bottom-2 right-2 bg-orange-300 text-stone-900 p-2 rounded-full shadow-lg">
                    <Plus size={16} strokeWidth={3} />
                </button>
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-stone-200 line-clamp-1">{product.name}</h3>
                <p className="text-[10px] text-stone-500 line-clamp-2 mt-1 mb-2 flex-1">{product.description}</p>
                <div className="text-orange-300 font-bold">฿{product.price}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ProductDetailScreen = ({ product, onBack, onAddToCart }: any) => {
    const [quantity, setQuantity] = useState(1);
    const [options, setOptions] = useState<Record<string, string>>({});
    const [note, setNote] = useState('');

    if (!product) return null;

    const handleOptionSelect = (optName: string, choice: string) => {
        setOptions(prev => ({ ...prev, [optName]: choice }));
    };

    return (
        <div className="min-h-screen bg-stone-950 pb-24 relative">
            {/* Header Image */}
            <div className="h-72 w-full relative">
                <img src={product.image} className="w-full h-full object-cover" />
                <button onClick={onBack} className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white">
                    <ChevronLeft size={24} />
                </button>
                <div className="absolute -bottom-6 left-0 w-full h-12 bg-stone-950 rounded-t-[2rem]"></div>
            </div>

            <div className="px-6 -mt-2">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-orange-100 flex-1">{product.name}</h1>
                    <span className="text-2xl font-black text-orange-300">฿{product.price}</span>
                </div>
                <p className="text-stone-400 text-sm mb-6">{product.description}</p>

                {/* Options */}
                <div className="space-y-6">
                    {product.options?.map((opt: any) => (
                        <div key={opt.name}>
                            <h3 className="font-bold text-stone-300 mb-3">{opt.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {opt.choices.map((c: any) => (
                                    <button
                                        key={c.label}
                                        onClick={() => handleOptionSelect(opt.name, c.label)}
                                        className={`px-4 py-2 rounded-xl text-sm border ${options[opt.name] === c.label ? 'bg-orange-300 border-orange-300 text-stone-900 font-bold' : 'border-stone-700 text-stone-400'}`}
                                    >
                                        {c.label} {c.priceMod > 0 && `+${c.priceMod}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div>
                         <h3 className="font-bold text-stone-300 mb-3">หมายเหตุ</h3>
                         <Input placeholder="เช่น ไม่ใส่ผัก, แยกน้ำจิ้ม" value={note} onChange={(e: any) => setNote(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-stone-900 border-t border-stone-800 p-4 pb-8 flex gap-4 items-center z-50">
                <div className="flex items-center gap-4 bg-stone-800 px-4 py-2 rounded-2xl">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-stone-400"><Minus size={20} /></button>
                    <span className="font-bold w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-orange-300"><Plus size={20} /></button>
                </div>
                <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={() => onAddToCart({ ...product, quantity, selectedOptions: options, note })}
                >
                    เพิ่มลงตะกร้า - ฿{product.price * quantity}
                </Button>
            </div>
        </div>
    );
};

export const CartScreen = ({ cartItems, onCheckout, onBack }: any) => {
    const total = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-stone-950 p-4 pb-32">
            <header className="flex items-center gap-4 mb-6">
                 <button onClick={onBack} className="p-2 bg-stone-800 rounded-full"><ChevronLeft /></button>
                 <h1 className="text-xl font-bold">ตะกร้าสินค้า</h1>
            </header>

            {cartItems.length === 0 ? (
                <div className="text-center mt-20 text-stone-500">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p>ยังไม่มีสินค้าในตะกร้า</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item: any, idx: number) => (
                        <Card key={idx} className="flex gap-4">
                            <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-stone-700" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold">{item.name}</h3>
                                    <span className="text-orange-300 font-bold">฿{item.price * item.quantity}</span>
                                </div>
                                <p className="text-xs text-stone-500 mt-1">
                                    {item.selectedOptions && Object.values(item.selectedOptions).join(', ')}
                                    {item.note && ` (${item.note})`}
                                </p>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-stone-400 text-sm">x{item.quantity}</span>
                                    <button className="text-xs text-red-400 underline">แก้ไข</button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-stone-900 border-t border-stone-800 p-6 z-50">
                    <div className="flex justify-between mb-4 text-lg font-bold">
                        <span>ยอดรวมสุทธิ</span>
                        <span className="text-orange-300">฿{total}</span>
                    </div>
                    <Button variant="primary" fullWidth onClick={onCheckout}>ไปหน้าชำระเงิน</Button>
                </div>
            )}
        </div>
    );
};

export const CheckoutScreen = ({ cartItems, onPlaceOrder, onBack }: any) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', method: 'pickup', time: '12:00', payment: 'qr' });
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        db.getQrCode().then(setQrCode);
    }, []);

    const total = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="font-bold text-orange-200 mb-2">1. ข้อมูลผู้รับ</h3>
            <Input label="ชื่อ-นามสกุล" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} icon={User} />
            <Input label="เบอร์โทร" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} type="tel" icon={User} />
            
            <h3 className="font-bold text-orange-200 mt-6 mb-2">2. การจัดส่ง</h3>
            <div className="flex gap-4 mb-4">
                <button 
                    onClick={() => setFormData({...formData, method: 'pickup'})}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 ${formData.method === 'pickup' ? 'bg-orange-300/20 border-orange-300 text-orange-300' : 'border-stone-700 text-stone-500'}`}
                >
                    <ShoppingBag /> รับเอง
                </button>
                <button 
                    onClick={() => setFormData({...formData, method: 'delivery'})}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 ${formData.method === 'delivery' ? 'bg-orange-300/20 border-orange-300 text-orange-300' : 'border-stone-700 text-stone-500'}`}
                >
                    <MapPin /> เดลิเวอรี่
                </button>
            </div>
            
            {formData.method === 'delivery' ? (
                <Input label="ที่อยู่จัดส่ง" value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} icon={MapPin} />
            ) : (
                <Input label="เวลารับสินค้า" type="time" value={formData.time} onChange={(e: any) => setFormData({...formData, time: e.target.value})} />
            )}
            
            <Button className="mt-8" fullWidth onClick={() => setStep(2)}>ถัดไป: ชำระเงิน</Button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 text-center">
            <h3 className="font-bold text-orange-200 mb-4">3. ชำระเงิน ฿{total}</h3>
            
            <div className="flex gap-2 justify-center mb-6">
                <button onClick={() => setFormData({...formData, payment: 'qr'})} className={`px-4 py-2 rounded-lg border ${formData.payment === 'qr' ? 'bg-orange-300 text-stone-900 border-orange-300' : 'border-stone-700'}`}>พร้อมเพย์ (QR)</button>
                <button onClick={() => setFormData({...formData, payment: 'bank'})} className={`px-4 py-2 rounded-lg border ${formData.payment === 'bank' ? 'bg-orange-300 text-stone-900 border-orange-300' : 'border-stone-700'}`}>โอนธนาคาร</button>
            </div>

            <Card className="p-6 bg-white text-stone-900 mx-auto max-w-[280px]">
                <div className="w-full aspect-square bg-stone-200 mb-4 flex items-center justify-center rounded-lg overflow-hidden">
                    {/* Real QR from Settings */}
                    {qrCode ? (
                        <img src={qrCode} className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-center">
                            <div className="text-4xl">📱</div>
                            <div className="text-xs mt-2">QR Code Not Set</div>
                        </div>
                    )}
                </div>
                <p className="font-bold text-lg">ร้าน นายขายไก่</p>
                <p className="text-sm text-stone-500">พร้อมเพย์ / ธนาคาร</p>
                <p className="text-xl font-black text-orange-600 mt-2">฿{total}.00</p>
            </Card>

            <div className="flex items-center justify-center gap-2 text-stone-400 text-sm mt-4">
               <span>กรุณาตรวจสอบยอดก่อนโอน</span>
               <button className="text-orange-300"><Copy size={16}/></button>
            </div>

            <div className="border border-dashed border-stone-600 rounded-xl p-4 mt-6">
                <p className="text-stone-400 text-sm mb-2">อัปโหลดสลิปโอนเงิน</p>
                <div className="flex items-center justify-center w-full h-12 bg-stone-800 rounded-lg cursor-pointer hover:bg-stone-700">
                    <Upload size={20} className="mr-2" /> เลือกไฟล์รูปภาพ
                </div>
            </div>

            <Button variant="primary" fullWidth onClick={onPlaceOrder} className="mt-4">ยืนยันการแจ้งโอน</Button>
            <Button variant="ghost" fullWidth onClick={() => setStep(1)}>ย้อนกลับ</Button>
        </div>
    );

    return (
         <div className="min-h-screen bg-stone-950 p-6 pb-24">
            <header className="flex items-center gap-4 mb-6">
                 <button onClick={onBack} className="p-2 bg-stone-800 rounded-full"><ChevronLeft /></button>
                 <h1 className="text-xl font-bold">Check out</h1>
            </header>
            {step === 1 ? renderStep1() : renderStep2()}
        </div>
    );
};

export const HistoryScreen = ({ orders }: any) => {
    return (
        <div className="p-4 space-y-4">
             <h2 className="text-xl font-bold mb-4">ประวัติการสั่งซื้อ</h2>
             {orders.length === 0 ? <div className="text-center text-stone-500 mt-10">ไม่มีประวัติการสั่งซื้อ</div> :
             orders.map((order: Order) => (
                 <Card key={order.id} className="space-y-3">
                     <div className="flex justify-between items-start">
                         <div>
                            <span className="text-orange-300 font-bold">#{order.id}</span>
                            <div className="text-xs text-stone-500">{order.date}</div>
                         </div>
                         <Badge status={order.status} />
                     </div>
                     <div className="border-t border-b border-stone-700/50 py-2 my-2 text-sm text-stone-300">
                         {order.items.map((item, i) => (
                             <div key={i} className="flex justify-between">
                                 <span>{item.quantity}x {item.name}</span>
                                 <span>฿{item.price * item.quantity}</span>
                             </div>
                         ))}
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-sm text-stone-400">ยอดรวม</span>
                         <span className="text-xl font-bold">฿{order.totalPrice}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="secondary" className="!py-2 text-xs">รายละเอียด</Button>
                        <Button variant="primary" className="!py-2 text-xs">สั่งซ้ำ</Button>
                     </div>
                 </Card>
             ))}
        </div>
    )
}
