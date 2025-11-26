import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, disabled = false }: any) => {
  const baseStyle = "font-bold rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 py-3 px-6 shadow-lg";
  
  const variants = {
    primary: "bg-orange-300 text-stone-900 hover:bg-orange-200 shadow-orange-900/20",
    secondary: "bg-stone-800 text-orange-200 border border-stone-700 hover:bg-stone-700 shadow-black/20",
    danger: "bg-red-400 text-white hover:bg-red-300 shadow-red-900/20",
    success: "bg-teal-200 text-teal-900 hover:bg-teal-100 shadow-teal-900/20",
    ghost: "bg-transparent text-stone-400 hover:text-orange-300 shadow-none hover:bg-stone-800/50"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon }: any) => (
  <div className="mb-4">
    {label && <label className="block text-sm text-stone-400 mb-2 ml-1">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-stone-800 border border-stone-700 text-stone-100 rounded-2xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 placeholder-stone-600 transition-colors`}
      />
    </div>
  </div>
);

export const Card = ({ children, className = "", onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-stone-800/60 backdrop-blur-md border border-stone-700/50 rounded-3xl p-4 shadow-xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

export const Badge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending_payment: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    verifying: "bg-blue-500/20 text-blue-300 border-blue-500/50",
    paid: "bg-teal-500/20 text-teal-300 border-teal-500/50",
    preparing: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    delivered: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    completed: "bg-green-500/20 text-green-300 border-green-500/50",
  };

  const labels: Record<string, string> = {
    pending_payment: "รอชำระเงิน",
    verifying: "รอตรวจสอบ",
    paid: "ชำระแล้ว",
    preparing: "กำลังปรุง",
    delivered: "จัดส่งแล้ว",
    completed: "สำเร็จ",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-lg border ${styles[status] || "bg-stone-700 text-stone-400"}`}>
      {labels[status] || status}
    </span>
  );
};