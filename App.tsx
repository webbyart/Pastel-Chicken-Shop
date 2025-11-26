
import React, { useState, useEffect } from 'react';
import { User, Product, Order, Role } from './types';
import { AdminDashboard } from './components/AdminScreens';
import { LoginScreen, RegisterScreen } from './screens/auth';
import { 
  HomeScreen, ProductListScreen, ProductDetailScreen, CartScreen, 
  CheckoutScreen, HistoryScreen, 
} from './components/CustomerScreens';
import { Home, ShoppingBag, Tag, History, User as UserIcon } from 'lucide-react';
import * as db from './services/db';
import { MOCK_PRODUCTS, MOCK_PROMOTIONS } from './mockData';

/* --- Shared Layout for Mobile --- */
const MobileLayout = ({ children, activeTab, onTabChange, showNav = true }: any) => {
  return (
    <div className="min-h-screen bg-stone-950 pb-24 md:max-w-md md:mx-auto md:border-x md:border-stone-800 relative shadow-2xl overflow-hidden">
      {children}
      {showNav && (
        <div className="fixed bottom-0 left-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800 px-6 py-3 flex justify-between items-center z-[100]">
          <NavIcon icon={Home} label="หน้าหลัก" active={activeTab === 'home'} onClick={() => onTabChange('home')} />
          <NavIcon icon={ShoppingBag} label="สินค้า" active={activeTab === 'shop' || activeTab === 'cart'} onClick={() => onTabChange('shop')} />
          <NavIcon icon={Tag} label="โปรโมชั่น" active={activeTab === 'promo'} onClick={() => onTabChange('promo')} />
          <NavIcon icon={History} label="ประวัติ" active={activeTab === 'history'} onClick={() => onTabChange('history')} />
          <NavIcon icon={UserIcon} label="โปรไฟล์" active={activeTab === 'profile'} onClick={() => onTabChange('profile')} />
        </div>
      )}
    </div>
  );
};

const NavIcon = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-orange-300' : 'text-stone-500 hover:text-stone-300'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'none' | 'login' | 'register'>('none');
  
  // Customer State
  const [activeTab, setActiveTab] = useState('home');
  const [viewStack, setViewStack] = useState<string[]>(['home']); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      // 1. Load Products (Fallback to Mock)
      try {
        const p = await db.getProducts();
        if (p && p.length > 0) {
          setProducts(p);
        } else {
          console.log("No products in DB or empty list, using mock data.");
          setProducts(MOCK_PRODUCTS);
        }
      } catch (e) {
        console.warn("Failed to load products from DB, using mock data.", e);
        setProducts(MOCK_PRODUCTS);
      }

      // 2. Load Promotions (Fallback to Mock)
      try {
        const promo = await db.getPromotions();
        if (promo && promo.length > 0) {
            setPromotions(promo);
        } else {
            setPromotions(MOCK_PROMOTIONS);
        }
      } catch (e) {
        console.warn("Failed to load promotions, using mock data.", e);
        setPromotions(MOCK_PROMOTIONS);
      }
    };
    loadData();
  }, []);

  // Computed current view
  const currentView = viewStack[viewStack.length - 1];

  const navigate = (view: string) => {
    if ((view === 'profile' || view === 'history') && !user) {
      setAuthView('login');
      return;
    }

    setViewStack(prev => [...prev, view]);
    if (['home', 'shop', 'promo', 'history', 'profile'].includes(view)) {
      setActiveTab(view);
    }
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      const newStack = [...viewStack];
      newStack.pop();
      setViewStack(newStack);
      const prevView = newStack[newStack.length - 1];
      if (['home', 'shop', 'promo', 'history', 'profile'].includes(prevView)) {
        setActiveTab(prevView);
      }
    }
  };

  const handleLogin = (role: Role) => {
    setUser({
      id: 'u1', // In real app, get from Supabase Auth
      name: role === 'admin' ? 'Admin' : 'คุณลูกค้า',
      email: 'user@test.com',
      role,
      isVerified: true
    });
    setAuthView('none');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('none'); 
    setCart([]);
    setViewStack(['home']);
    setActiveTab('home');
  };

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    goBack();
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setAuthView('login');
      return;
    }
    navigate('checkout');
  };

  const placeOrder = async () => {
    if (!user) return;
    const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        userId: user.id,
        customerName: user.name,
        items: cart,
        totalPrice: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0),
        status: 'pending_payment',
        paymentMethod: 'promptpay',
        deliveryMethod: 'pickup',
        date: new Date().toLocaleString('th-TH'),
    };
    
    // Save to DB
    try {
        await db.createOrder(newOrder);
    } catch (e) {
        console.error("Failed to save order to DB, saving locally only.", e);
    }
    
    // Optimistic UI update
    setOrders([newOrder, ...orders]);
    setCart([]);
    setViewStack(['history']);
    setActiveTab('history');
  };

  // 1. Check if Admin
  if (user?.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // 2. Check if Auth Screen is active
  if (authView === 'login') {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setAuthView('register')} 
        onBack={() => setAuthView('none')} 
      />
    );
  }

  if (authView === 'register') {
    return (
      <RegisterScreen 
        onRegister={() => setAuthView('login')} 
        onSwitchToLogin={() => setAuthView('login')} 
        onBack={() => setAuthView('none')}
      />
    );
  }

  // 3. Render Guest/Customer Mobile App
  return (
    <MobileLayout activeTab={activeTab} onTabChange={(tab: string) => {
        if ((tab === 'profile' || tab === 'history') && !user) {
          setAuthView('login');
          return;
        }
        setViewStack([tab]);
        setActiveTab(tab);
    }} showNav={!['product-detail', 'checkout', 'cart'].includes(currentView)}>
      
      {currentView === 'home' && <HomeScreen 
          navigate={navigate} 
          products={products}
          promotions={promotions}
          onSelectProduct={(p: Product) => {
            setSelectedProduct(p);
            navigate('product-detail');
          }} 
      />}
      
      {currentView === 'shop' && <ProductListScreen 
          navigate={navigate} 
          products={products}
          onSelectProduct={(p: Product) => {
            setSelectedProduct(p);
            navigate('product-detail');
          }} 
      />}

      {currentView === 'product-detail' && <ProductDetailScreen 
          product={selectedProduct} 
          onBack={goBack} 
          onAddToCart={addToCart} 
      />}

      {currentView === 'cart' && <CartScreen 
          cartItems={cart} 
          onBack={goBack} 
          onCheckout={handleCheckoutClick} 
      />}

      {currentView === 'checkout' && <CheckoutScreen 
          cartItems={cart} 
          onPlaceOrder={placeOrder} 
          onBack={goBack} 
      />}

      {currentView === 'history' && <HistoryScreen orders={orders} />}
      
      {currentView === 'promo' && (
          <div className="p-4 space-y-4 pb-24">
              <h2 className="text-xl font-bold">โปรโมชั่น</h2>
              {promotions.length === 0 ? (
                  <p className="text-stone-500 text-center mt-10">เร็วๆ นี้</p>
              ) : (
                  promotions.map((p, i) => (
                      <div key={i} className="bg-stone-800 rounded-2xl overflow-hidden">
                          <img src={p.image} className="w-full h-32 object-cover" />
                          <div className="p-4">
                              <h3 className="font-bold text-orange-300">{p.title}</h3>
                              <p className="text-stone-400 text-sm">{p.description}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}
      
      {currentView === 'profile' && user && (
          <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">โปรไฟล์ของฉัน</h2>
              <div className="bg-stone-800 p-4 rounded-2xl mb-6 flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center text-stone-900 font-bold text-2xl">
                      {user.name.charAt(0)}
                  </div>
                  <div>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <p className="text-stone-400 text-sm">{user.email}</p>
                  </div>
              </div>
              <button onClick={handleLogout} className="w-full py-3 bg-stone-800 text-red-400 rounded-xl font-bold">ออกจากระบบ</button>
          </div>
      )}

      {cart.length > 0 && !['cart', 'checkout', 'product-detail'].includes(currentView) && (
          <button 
            onClick={() => navigate('cart')}
            className="fixed bottom-24 right-4 bg-orange-300 text-stone-900 p-4 rounded-full shadow-xl shadow-orange-900/30 z-40 animate-bounce"
          >
              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-stone-900">
                  {cart.length}
              </div>
              <ShoppingBag fill="currentColor" />
          </button>
      )}

    </MobileLayout>
  );
};

export default App;
