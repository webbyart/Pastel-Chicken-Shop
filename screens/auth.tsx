import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';

export const LoginScreen = ({ onLogin, onSwitchToRegister, onBack }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        // Admin Login Check
        if(email === 'admin@admin.com' && password === 'admin123') {
            onLogin('admin');
        } else if (email && password) {
            onLogin('customer');
        } else {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
            
            {/* Back Button for Guest Mode */}
            {onBack && (
                <button onClick={onBack} className="absolute top-6 left-6 text-stone-400 hover:text-stone-100 z-20 flex items-center gap-2">
                    <ArrowLeft size={20} /> กลับหน้าร้าน
                </button>
            )}

            <div className="w-full max-w-sm z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300 mb-2">ร้าน นายขายไก่</h1>
                    <p className="text-stone-400">ยินดีต้อนรับกลับมา!</p>
                </div>

                <div className="space-y-2">
                    <Input 
                        placeholder="อีเมล" 
                        value={email} 
                        onChange={(e: any) => setEmail(e.target.value)} 
                        icon={Mail}
                    />
                    <Input 
                        placeholder="รหัสผ่าน" 
                        type="password" 
                        value={password} 
                        onChange={(e: any) => setPassword(e.target.value)} 
                        icon={Lock}
                    />
                </div>
                
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

                <div className="flex justify-end mb-6">
                    <button className="text-xs text-stone-500 hover:text-orange-300">ลืมรหัสผ่าน?</button>
                </div>

                <Button fullWidth onClick={handleSubmit} className="mb-4">เข้าสู่ระบบ</Button>
                
                <div className="text-center text-sm text-stone-500">
                    ยังไม่มีบัญชี? <button onClick={onSwitchToRegister} className="text-orange-300 font-bold">สมัครสมาชิก</button>
                </div>
            </div>
        </div>
    );
};

export const RegisterScreen = ({ onRegister, onSwitchToLogin, onBack }: any) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', username: '', pass: '', confirmPass: '' });

    const handleRegister = () => {
        alert("กรุณายืนยันอีเมลที่ส่งไปยังกล่องข้อความของคุณ");
        onRegister();
    };

    return (
        <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-6 relative">
             {/* Back Button for Guest Mode */}
             {onBack && (
                <button onClick={onBack} className="absolute top-6 left-6 text-stone-400 hover:text-stone-100 z-20 flex items-center gap-2">
                    <ArrowLeft size={20} /> กลับหน้าร้าน
                </button>
            )}

            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold text-orange-200 mb-6 text-center">สร้างบัญชีใหม่</h1>
                
                <div className="space-y-2">
                    <Input placeholder="ชื่อ-นามสกุล" value={form.name} onChange={(e: any) => setForm({...form, name: e.target.value})} icon={User} />
                    <Input placeholder="เบอร์โทร" value={form.phone} onChange={(e: any) => setForm({...form, phone: e.target.value})} icon={Phone} />
                    <Input placeholder="อีเมล" value={form.email} onChange={(e: any) => setForm({...form, email: e.target.value})} icon={Mail} />
                    <Input placeholder="ชื่อผู้ใช้" value={form.username} onChange={(e: any) => setForm({...form, username: e.target.value})} icon={User} />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="รหัสผ่าน" type="password" value={form.pass} onChange={(e: any) => setForm({...form, pass: e.target.value})} icon={Lock} />
                        <Input placeholder="ยืนยันรหัส" type="password" value={form.confirmPass} onChange={(e: any) => setForm({...form, confirmPass: e.target.value})} icon={Lock} />
                    </div>
                </div>

                <div className="flex items-start gap-2 mt-4 mb-6">
                    <input type="checkbox" className="mt-1 accent-orange-300" />
                    <p className="text-xs text-stone-400">ฉันยอมรับ <span className="text-orange-300">เงื่อนไขการใช้งาน</span> และ <span className="text-orange-300">นโยบายความเป็นส่วนตัว</span></p>
                </div>

                <Button fullWidth onClick={handleRegister} className="mb-4">สมัครสมาชิก</Button>
                
                <div className="text-center text-sm text-stone-500">
                    มีบัญชีอยู่แล้ว? <button onClick={onSwitchToLogin} className="text-orange-300 font-bold">เข้าสู่ระบบ</button>
                </div>
            </div>
        </div>
    );
};