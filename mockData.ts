
import { Product, Order, Promotion } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // --- Chicken ---
  {
    id: 'p1',
    name: 'ไก่ฮอทแอนด์สไปซี่',
    description: 'ไก่ทอดสูตรเด็ด เผ็ดร้อนถึงเครื่อง กรอบนอกนุ่มใน',
    price: 45,
    category: 'chicken',
    calories: '170 - 430 kcal',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
    options: [
      { name: 'ชิ้นส่วน', choices: [{ label: 'น่อง', priceMod: 0 }, { label: 'สะโพก', priceMod: 0 }, { label: 'อก', priceMod: 0 }] },
      { name: 'จำนวน', choices: [{ label: '1 ชิ้น', priceMod: 0 }, { label: '2 ชิ้น', priceMod: 40 }] }
    ]
  },
  {
    id: 'p2',
    name: 'ไก่วิงซ์แซ่บ (3 ชิ้น)',
    description: 'ปีกไก่บนคลุกเคล้าผงลาบ รสจัดจ้าน',
    price: 59,
    category: 'chicken',
    calories: '100 kcal',
    image: 'https://images.unsplash.com/photo-1569691899455-59756e8b7cb5?q=80&w=800&auto=format&fit=crop',
    options: [
      { name: 'เพิ่มจำนวน', choices: [{ label: '3 ชิ้น', priceMod: 0 }, { label: '6 ชิ้น', priceMod: 55 }] }
    ]
  },
  {
    id: 'p3',
    name: 'ไก่กรอบสูตรดั้งเดิม',
    description: 'ไก่ทอดสูตรลับ หมักเครื่องเทศ 11 ชนิด',
    price: 45,
    category: 'chicken',
    calories: '170 - 430 kcal',
    image: 'https://images.unsplash.com/photo-1562967963-edec8561c305?q=80&w=800&auto=format&fit=crop',
    options: [
      { name: 'ชิ้นส่วน', choices: [{ label: 'น่อง', priceMod: 0 }, { label: 'สะโพก', priceMod: 0 }] }
    ]
  },

  // --- Burgers & Rice ---
  {
    id: 'b1',
    name: 'ซิงเกอร์เบอร์เกอร์',
    description: 'เบอร์เกอร์ไก่กรอบชิ้นโต ผักสด ซอสมายองเนส',
    price: 79,
    category: 'burger',
    calories: '530 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    options: [
      { name: 'เพิ่มชีส', choices: [{ label: 'ไม่เพิ่ม', priceMod: 0 }, { label: 'เพิ่มชีส', priceMod: 15 }] }
    ]
  },
  {
    id: 'b2',
    name: 'ข้าวไก่แซ่บโบว์ล',
    description: 'ข้าวสวยร้อนๆ ท็อปด้วยไก่แซ่บและหอมแดงซอย',
    price: 69,
    category: 'burger',
    calories: '640 kcal',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop',
    options: [
      { name: 'ระดับความเผ็ด', choices: [{ label: 'ปกติ', priceMod: 0 }, { label: 'เผ็ดน้อย', priceMod: 0 }] }
    ]
  },

  // --- Snacks ---
  {
    id: 's1',
    name: 'ชิคเก้น ป๊อป',
    description: 'ไก่ป๊อปชิ้นพอดีคำ กรอบเคี้ยวเพลิน',
    price: 39,
    category: 'snack',
    calories: '300 kcal',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's2',
    name: 'เฟรนช์ฟรายส์ (M)',
    description: 'มันฝรั่งทอดกรอบสีเหลืองทอง',
    price: 45,
    category: 'snack',
    calories: '230 kcal',
    image: 'https://images.unsplash.com/photo-1630384060421-a4323ce66488?q=80&w=800&auto=format&fit=crop',
    options: [
        { name: 'ขนาด', choices: [{ label: 'กลาง (M)', priceMod: 0 }, { label: 'ใหญ่ (L)', priceMod: 20 }] }
    ]
  },
  {
    id: 's3',
    name: 'นักเก็ตส์ (6 ชิ้น)',
    description: 'นักเก็ตไก่เนื้อเน้นๆ จิ้มซอสบาร์บีคิว',
    price: 59,
    category: 'snack',
    calories: '45 kcal/ชิ้น',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a293?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's4',
    name: 'มันบด (S)',
    description: 'มันบดเนื้อเนียนราดน้ำเกรวี่ชุ่มฉ่ำ',
    price: 35,
    category: 'snack',
    calories: '50 kcal',
    image: 'https://images.unsplash.com/photo-1619860098939-58b21c430263?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's5',
    name: 'โคลสลอว์',
    description: 'ผักกะหล่ำและแครอทคลุกเคล้ามายองเนส',
    price: 35,
    category: 'snack',
    calories: '180 kcal',
    image: 'https://images.unsplash.com/photo-1623297966551-5120619a9f24?q=80&w=800&auto=format&fit=crop',
  },

  // --- Desserts ---
  {
    id: 'd1',
    name: 'ทาร์ตไข่',
    description: 'แป้งพายกรอบ ไส้ไข่หอมหวานนุ่มลิ้น',
    price: 29,
    category: 'dessert',
    calories: '170 kcal',
    image: 'https://images.unsplash.com/photo-1563588147690-3444465d666d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'd2',
    name: 'โคนวานิลลา',
    description: 'ไอศกรีมเนื้อเนียน รสวานิลลา',
    price: 15,
    category: 'dessert',
    calories: '130 kcal',
    image: 'https://images.unsplash.com/photo-1551024601-562963525c53?q=80&w=800&auto=format&fit=crop',
  },

  // --- Drinks ---
  {
    id: 'dr1',
    name: 'มัทฉะลาเต้เย็น',
    description: 'ชาเขียวมัทฉะเข้มข้น ผสมนมสด',
    price: 45,
    category: 'drink',
    calories: '150 kcal',
    image: 'https://images.unsplash.com/photo-1582782501391-7d5697996d91?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dr2',
    name: 'ช็อกโกแลตร้อน',
    description: 'ช็อกโกแลตอุ่นๆ ท็อปด้วยฟองนม',
    price: 40,
    category: 'drink',
    calories: '120 kcal',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=800&auto=format&fit=crop',
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    userId: 'u1',
    customerName: 'คุณลูกค้า น่ารัก',
    items: [
      { ...MOCK_PRODUCTS[0], cartId: 'c1', quantity: 2, selectedOptions: { 'ชิ้นส่วน': 'น่อง', 'จำนวน': '1 ชิ้น' }, note: '' },
      { ...MOCK_PRODUCTS[5], cartId: 'c2', quantity: 1, selectedOptions: { 'ขนาด': 'กลาง (M)' }, note: '' }
    ],
    totalPrice: 135,
    status: 'paid',
    paymentMethod: 'promptpay',
    deliveryMethod: 'pickup',
    date: '2023-10-25 10:30',
    pickupTime: '2023-10-25 11:00'
  },
];

export const MOCK_PROMOTIONS: Promotion[] = [
    {
        id: 'promo1',
        title: 'ชุดครอบครัวสุขสันต์ ลด 50%',
        description: 'เมื่อซื้อชุดไก่จุใจ 12 ชิ้น แถมฟรี เป๊ปซี่ 1.5 ลิตร',
        image: 'https://images.unsplash.com/photo-1513639776629-7b611d124754?q=80&w=800&auto=format&fit=crop',
        active: true
    },
    {
        id: 'promo2',
        title: 'ส่งฟรี 3 กิโลเมตรแรก',
        description: 'เมื่อสั่งครบ 300 บาทขึ้นไป',
        image: 'https://images.unsplash.com/photo-1615887023516-9dc7aca13271?q=80&w=800&auto=format&fit=crop',
        active: true
    }
];
