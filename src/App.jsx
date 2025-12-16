import React, { useState, useEffect, useMemo, useRef } from 'react';

// --- ICONS ---
const Icons = {
  Plus: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Close: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Back: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Trash: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Note: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Settings: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Moon: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Sun: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  System: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  NoteIndicator: () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Upload: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
};

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    totalBurn: 'Monthly Total',
    dailyAvg: 'Daily avg',
    groupUrgent: 'Attention Needed',
    groupWeek: 'This Week',
    groupLater: 'Upcoming',
    noSubs: 'No subscriptions active',
    tapToAdd: 'Tap + to add subscription',
    today: 'today',
    tomorrow: 'tomorrow',
    inDays: 'in {days} days',
    ends: 'ends',
    due: 'due',
    addService: 'New Subscription',
    customApp: 'Custom App...',
    back: 'Back',
    remove: 'Remove',
    monthlyCost: 'Monthly Cost',
    renewDay: 'Renew Day',
    dayOfMonth: 'Day of month',
    type: 'Type',
    trial: 'Trial / Free',
    paid: 'Paid Plan',
    notes: 'Notes',
    notesPlaceholder: 'Add details...',
    settings: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    close: 'Close',
    free: 'Financial Freedom. No bills.',
    trialLabel: 'Trial',
    dueSoon: 'Due soon',
    nextBill: 'Next bill',
    endsSoon: 'Ends soon',
    save: 'Save Changes',
    pickColor: 'Icon Color / Image'
  },
  vi: {
    totalBurn: 'TỔNG CHI TIÊU THÁNG',
    dailyAvg: 'Trung bình ngày',
    groupUrgent: 'CẦN CHÚ Ý',
    groupWeek: 'TUẦN NÀY',
    groupLater: 'SẮP TỚI',
    noSubs: 'Chưa có đăng ký nào',
    tapToAdd: 'Bấm + để thêm mới',
    today: 'hôm nay',
    tomorrow: 'ngày mai',
    inDays: 'còn {days} ngày',
    ends: 'hết hạn',
    due: 'đến hạn',
    addService: 'Thêm Dịch Vụ',
    customApp: 'Ứng dụng khác...',
    back: 'Quay lại',
    remove: 'Xóa',
    monthlyCost: 'PHÍ HÀNG THÁNG',
    renewDay: 'NGÀY GIA HẠN',
    dayOfMonth: 'Ngày trong tháng (1-31)',
    type: 'LOẠI GÓI',
    trial: 'Dùng thử / Free',
    paid: 'Trả phí',
    notes: 'GHI CHÚ',
    notesPlaceholder: 'VD: Hủy trước tháng 1...',
    settings: 'Cài đặt',
    appearance: 'Giao diện',
    language: 'Ngôn ngữ',
    close: 'Đóng',
    free: 'Tự do tài chính. Không có nợ.',
    trialLabel: 'Dùng thử',
    dueSoon: 'Sắp hết hạn',
    nextBill: 'Kỳ tới',
    endsSoon: 'Sắp hết',
    save: 'Lưu thay đổi',
    pickColor: 'Màu Icon / Ảnh'
  }
};

const PRESETS = [
  { name: 'Netflix', price: 260000, color: 'bg-[#E50914]', text: 'text-white', icon: 'N' },
  { name: 'Spotify', price: 59000, color: 'bg-[#1DB954]', text: 'text-black', icon: 'S' },
  { name: 'Youtube', price: 79000, color: 'bg-[#FF0000]', text: 'text-white', icon: '▶' },
  { name: 'Apple One', price: 239000, color: 'bg-white', text: 'text-black', icon: '' },
  { name: 'iCloud', price: 19000, color: 'bg-[#007AFF]', text: 'text-white', icon: '☁️' },
  { name: 'ChatGPT', price: 490000, color: 'bg-[#10A37F]', text: 'text-white', icon: 'AI' },
  { name: 'Adobe', price: 1350000, color: 'bg-[#31004a]', text: 'text-[#00c8ff]', icon: 'Ae' },
  { name: 'X', price: 250000, color: 'bg-zinc-800', text: 'text-white', icon: 'X' },
];

const COLORS = [
  'bg-zinc-800', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 
  'bg-green-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 
  'bg-purple-500', 'bg-pink-500'
];

// --- SEAMLESS TICKER ---
const VerticalSeamlessTicker = ({ items, t, isDark }) => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const shouldScroll = items.length > 1;
  const displayItems = shouldScroll ? [...items, items[0]] : items;

  useEffect(() => {
    if (!shouldScroll) { setIndex(0); return; }
    const interval = setInterval(() => { setIndex(prev => prev + 1); setIsTransitioning(true); }, 3000);
    return () => clearInterval(interval);
  }, [items.length, shouldScroll]);

  useEffect(() => {
    if (shouldScroll && index === displayItems.length - 1) {
      const timeout = setTimeout(() => { setIsTransitioning(false); setIndex(0); }, 500);
      return () => clearTimeout(timeout);
    }
  }, [index, displayItems.length, shouldScroll]);

  return (
    <div className={`relative h-12 overflow-hidden rounded-xl border flex items-center px-4 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#FFF4EC] border-orange-100'}`}>
      {items.length === 0 ? (
        <div className="flex items-center gap-3 w-full">
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
           <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{t('free')}</p>
        </div>
      ) : (
        <div className="flex-1 relative h-full">
          <div className="absolute w-full" style={{ transform: `translateY(-${index * 3}rem)`, transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none' }}>
            {displayItems.map((item, i) => {
               let dotColor = isDark ? 'bg-zinc-500' : 'bg-orange-300';
               if (item.isTrial) dotColor = 'bg-yellow-500';
               if (item.daysLeft <= 3) dotColor = 'bg-orange-500';
               return (
                <div key={`${item.uid}-${i}`} className="h-12 flex items-center gap-3 w-full">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
                  <p className={`text-sm w-full truncate ${isDark ? 'text-zinc-300' : 'text-gray-800 font-medium'}`}>
                    <span className="font-bold mr-1">{item.name}</span>
                    {item.isTrial ? t('ends') : t('due')}
                    <span className={`ml-1 font-bold ${item.daysLeft <= 3 ? 'text-orange-600' : ''}`}>
                      {item.daysLeft === 0 ? t('today') : item.daysLeft === 1 ? t('tomorrow') : t('inDays', {days: item.daysLeft})}
                    </span>
                  </p>
                </div>
               );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP ICON COMPONENT (FIXED: rounded-2xl) ---
const AppIcon = ({ sub, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-xl';
  // Đã sửa 'rounded-[1.2rem]' thành 'rounded-2xl' để form dáng chuẩn đẹp hơn
  const shapeClass = 'rounded-2xl shadow-sm shrink-0 overflow-hidden flex items-center justify-center';
  
  if (sub.image) {
    return (
      <div className={`${sizeClass} ${shapeClass} bg-white`}>
        <img 
          src={sub.image} 
          alt={sub.name} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} ${shapeClass} ${sub.color} ${sub.text || 'text-white'} font-bold`}>
      {sub.icon}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function SubTrackPlatinum() {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('subtrack_settings');
      return s ? JSON.parse(s) : { theme: 'light', lang: 'vi' };
    }
    return { theme: 'light', lang: 'vi' };
  });

  const [subs, setSubs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('subtrack_vfinal');
        return saved ? JSON.parse(saved) : [{ uid: 1, ...PRESETS[0], isTrial: false, dueDay: 5, note: '' }];
      } catch (e) { return []; }
    }
    return [];
  });
  
  const [view, setView] = useState('home'); 
  const [selectedSub, setSelectedSub] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [systemTheme, setSystemTheme] = useState('dark');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = settings.theme === 'system' ? systemTheme === 'dark' : settings.theme === 'dark';

  useEffect(() => {
    localStorage.setItem('subtrack_vfinal', JSON.stringify(subs));
    localStorage.setItem('subtrack_settings', JSON.stringify(settings));
  }, [subs, settings]);

  const t = (key, params = {}) => {
    let text = TRANSLATIONS[settings.lang][key] || key;
    Object.keys(params).forEach(k => { text = text.replace(`{${k}}`, params[k]); });
    return text;
  };

  // --- LOGIC ---
  const getNextPaymentDate = (dueDay) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    let year = today.getFullYear();
    let month = today.getMonth(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let targetDay = Math.min(dueDay, daysInMonth);
    let paymentDate = new Date(year, month, targetDay);
    if (paymentDate < today) {
      month++;
      const daysInNextMonth = new Date(year, month + 1, 0).getDate();
      targetDay = Math.min(dueDay, daysInNextMonth);
      paymentDate = new Date(year, month, targetDay);
    }
    return paymentDate;
  };

  const calculateDaysLeft = (dueDay) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextDate = getNextPaymentDate(dueDay);
    return Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
  };

  const sortedSubs = useMemo(() => {
    return [...subs].sort((a, b) => {
      const daysLeftA = calculateDaysLeft(a.dueDay);
      const daysLeftB = calculateDaysLeft(b.dueDay);
      const urgentTrialA = a.isTrial && daysLeftA <= 3;
      const urgentTrialB = b.isTrial && daysLeftB <= 3;
      if (urgentTrialA && !urgentTrialB) return -1;
      if (!urgentTrialA && urgentTrialB) return 1;
      return daysLeftA - daysLeftB;
    });
  }, [subs]);

  const groupedSubs = useMemo(() => {
    const groups = { urgent: [], week: [], later: [] };
    sortedSubs.forEach(sub => {
      const days = calculateDaysLeft(sub.dueDay);
      if (days <= 3) groups.urgent.push(sub);
      else if (days <= 7) groups.week.push(sub);
      else groups.later.push(sub);
    });
    return groups;
  }, [sortedSubs]);

  const stats = useMemo(() => {
    let total = 0;
    subs.forEach(s => { if (!s.isTrial) total += Number(s.price || 0); });
    const tickerItems = sortedSubs.map(s => ({
      ...s,
      daysLeft: calculateDaysLeft(s.dueDay)
    }));
    return { total, tickerItems };
  }, [subs, sortedSubs]);

  const fMoney = (n) => new Intl.NumberFormat(settings.lang === 'vi' ? 'vi-VN' : 'en-US').format(n || 0);

  const addSub = (preset) => {
    const newItem = { ...preset, uid: Date.now(), isTrial: false, dueDay: new Date().getDate(), price: preset.price || 0, note: '' };
    setSubs(prev => [...prev, newItem]);
    setSelectedSub(newItem);
    setView('detail'); 
  };

  const updateSub = (uid, field, value) => {
    setSubs(prev => prev.map(s => s.uid === uid ? { ...s, [field]: value } : s));
    setSelectedSub(prev => ({ ...prev, [field]: value })); 
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedSub) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSub(selectedSub.uid, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteSub = (uid) => {
    setSubs(prev => prev.filter(s => s.uid !== uid));
    setView('home');
  };

  const theme = {
    bg: isDark ? 'bg-black' : 'bg-[#F8F9FA]',
    cardBg: isDark ? 'bg-zinc-900/30' : 'bg-white',
    cardBorder: isDark ? 'border-transparent hover:border-zinc-800' : 'border-gray-100 shadow-sm hover:border-gray-200',
    textMain: isDark ? 'text-white' : 'text-gray-900',
    textSec: isDark ? 'text-zinc-500' : 'text-gray-500',
    divider: isDark ? 'border-zinc-800' : 'border-gray-100',
    headerBg: isDark ? 'bg-black/90' : 'bg-[#F8F9FA]/90',
    settingsBg: isDark ? 'bg-[#111]' : 'bg-white',
    segmentBg: isDark ? 'bg-zinc-800' : 'bg-gray-100',
    segmentActive: isDark ? 'bg-zinc-600 text-white' : 'bg-white text-black shadow-sm',
    fab: isDark ? 'bg-white text-black' : 'bg-black text-white',
    btnPrimary: isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800',
    groupTitle: isDark ? 'text-zinc-600' : 'text-gray-400',
  };

  const renderCard = (sub) => {
    const daysLeft = calculateDaysLeft(sub.dueDay);
    const isUrgent = daysLeft <= 7;
    const isVeryUrgent = daysLeft <= 3;

    const urgentStyle = isVeryUrgent
      ? (isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#FFF9F5] border-orange-200 shadow-md')
      : `${theme.cardBg} ${theme.cardBorder}`;

    let statusText = '';
    let statusColor = theme.textSec;

    if (isUrgent) {
        const dayText = daysLeft === 0 ? t('today') : daysLeft === 1 ? t('tomorrow') : t('inDays', { days: daysLeft });
        statusText = sub.isTrial ? `${t('ends')} ${dayText}` : `${t('due')} ${dayText}`; 
        statusColor = 'text-orange-500 font-bold';
    } else {
        const date = getNextPaymentDate(sub.dueDay);
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        statusText = `${t('nextBill')}: ${d}/${m}`;
        statusColor = theme.textSec;
    }

    return (
      <button
        key={sub.uid}
        onClick={() => { setSelectedSub(sub); setView('detail'); }}
        className={`w-full group flex items-center justify-between p-4 rounded-[1.2rem] border transition-all duration-200 active:scale-[0.98] mb-2 ${urgentStyle}`}
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <AppIcon sub={sub} size="md" />
          
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-base font-semibold truncate">
                {sub.name}
              </h3>
              {sub.isTrial && (
                <span className="text-[9px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shrink-0">
                  {t('trialLabel')}
                </span>
              )}
              {sub.note && sub.note.trim() !== '' && (
                 <span className={`${theme.textSec}`} title="Has note"><Icons.NoteIndicator /></span>
              )}
            </div>
            
            <div className={`text-xs mt-1 flex items-center gap-1.5 ${statusColor}`}>
               {isVeryUrgent && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"/>}
               {statusText}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 pl-2">
           <p className={`text-base font-medium tracking-tight ${sub.isTrial ? `line-through ${theme.textSec}` : ''}`}>{fMoney(sub.price)}</p>
        </div>
      </button>
    );
  };

  return (
    <div className={`h-[100dvh] overflow-hidden ${theme.bg} ${theme.textMain} font-sans flex justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-md ${theme.bg} h-full flex flex-col relative border-x ${theme.divider} shadow-2xl transition-colors duration-300`}>
        
        {/* === HOME === */}
        {view === 'home' && (
          <div className="flex flex-col h-full animate-fade-in relative">
            <div className={`pt-14 px-6 pb-4 ${theme.headerBg} backdrop-blur-xl z-20 sticky top-0 border-b ${theme.divider}`}>
              <div className="flex justify-between items-start mb-2">
                <p className={`${theme.textSec} text-[10px] font-bold tracking-[0.2em] uppercase`}>{t('totalBurn')}</p>
                <button onClick={() => setShowSettings(true)} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}>
                  <Icons.Settings />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-medium tracking-tighter leading-none">{fMoney(stats.total)}</h1>
                  <span className={`text-xl font-light ${theme.textSec}`}>{settings.lang === 'vi' ? 'đ' : ''}</span>
                </div>
                <div className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${isDark ? 'bg-zinc-800 text-green-400' : 'bg-green-100 text-green-700'}`}>
                   <span>{t('dailyAvg')}: {fMoney((stats.total / 30).toFixed(0))}</span>
                </div>
              </div>
              
              <VerticalSeamlessTicker items={stats.tickerItems} t={t} isDark={isDark} />
            </div>

            <div className="flex-1 px-4 overflow-y-auto pb-40 pt-4">
              {sortedSubs.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 opacity-40">
                  <p className="text-sm font-medium">{t('noSubs')}</p>
                  <p className="text-xs mt-1">{t('tapToAdd')}</p>
                </div>
              ) : (
                <>
                  {groupedSubs.urgent.length > 0 && (
                    <div className="mb-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 pl-1 ${theme.groupTitle} flex items-center gap-2`}>
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                        {t('groupUrgent')}
                      </p>
                      {groupedSubs.urgent.map(renderCard)}
                    </div>
                  )}

                  {groupedSubs.week.length > 0 && (
                    <div className="mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 pl-1 ${theme.groupTitle}`}>{t('groupWeek')}</p>
                      {groupedSubs.week.map(renderCard)}
                    </div>
                  )}

                  {groupedSubs.later.length > 0 && (
                    <div className="mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 pl-1 ${theme.groupTitle}`}>{t('groupLater')}</p>
                      {groupedSubs.later.map(renderCard)}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
               <button onClick={() => setView('add')} className={`pointer-events-auto ${theme.fab} h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all`}>
                 <Icons.Plus />
               </button>
            </div>
          </div>
        )}

        {/* === SETTINGS === */}
        {showSettings && (
           <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex flex-col justify-end animate-fade-in" onClick={() => setShowSettings(false)}>
              <div className={`w-full ${theme.settingsBg} rounded-t-[2rem] p-6 pb-10 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                 <div className="w-12 h-1 bg-gray-300/30 rounded-full mx-auto mb-8"></div>
                 <h2 className="text-2xl font-bold mb-8 px-2">{t('settings')}</h2>
                 <div className="mb-8">
                    <p className={`text-xs font-bold ${theme.textSec} uppercase tracking-widest mb-3 px-2`}>{t('appearance')}</p>
                    <div className={`flex p-1 rounded-xl ${theme.segmentBg}`}>
                       {['light', 'system', 'dark'].map((mode) => (
                          <button key={mode} onClick={() => setSettings({...settings, theme: mode})} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all capitalize ${settings.theme === mode ? theme.segmentActive : theme.textSec}`}>
                             {mode}
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <p className={`text-xs font-bold ${theme.textSec} uppercase tracking-widest mb-3 px-2`}>{t('language')}</p>
                    <div className={`flex p-1 rounded-xl ${theme.segmentBg}`}>
                       {['vi', 'en'].map((l) => (
                          <button key={l} onClick={() => setSettings({...settings, lang: l})} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${settings.lang === l ? theme.segmentActive : theme.textSec}`}>
                             {l === 'vi' ? 'Tiếng Việt' : 'English'}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* === ADD VIEW === */}
        {view === 'add' && (
          <div className={`absolute inset-0 z-30 ${theme.bg} flex flex-col animate-slide-up`}>
             <div className={`pt-16 px-6 flex justify-between items-center mb-6 z-10`}>
               <h2 className="text-2xl font-semibold">{t('addService')}</h2>
               <button onClick={() => setView('home')} className={`w-9 h-9 rounded-full ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-black'} flex items-center justify-center transition-colors`}>
                 <Icons.Close />
               </button>
             </div>
             <div className="px-4 space-y-2 overflow-y-auto pb-10">
               {PRESETS.map(p => (
                 <button key={p.name} onClick={() => addSub(p)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors border active:scale-[0.98] ${isDark ? 'hover:bg-zinc-900 border-zinc-900/50 hover:border-zinc-800' : 'hover:bg-white border-transparent hover:border-gray-200'}`}>
                   <div className={`w-10 h-10 rounded-xl ${p.color} ${p.text} flex items-center justify-center font-bold`}>{p.icon}</div>
                   <div className="flex-1 text-left">
                      <div className="font-medium text-base">{p.name}</div>
                      <div className={`text-xs ${theme.textSec}`}>{fMoney(p.price)}</div>
                   </div>
                   <div className={`w-8 h-8 rounded-full border ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-gray-200 text-gray-400'} flex items-center justify-center`}>+</div>
                 </button>
               ))}
               <button onClick={() => addSub({ name: 'Custom', price: 0, color: 'bg-zinc-800', text: 'text-white', icon: '?', note: '' })} className={`w-full flex items-center gap-4 p-4 rounded-2xl border border-dashed ${isDark ? 'border-zinc-800 text-zinc-500 hover:text-white' : 'border-gray-300 text-gray-500 hover:text-black'} transition-all mt-4`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isDark ? 'bg-zinc-900' : 'bg-gray-200 text-gray-600'}`}>?</div>
                  <div className="font-medium text-base">{t('customApp')}</div>
               </button>
             </div>
          </div>
        )}

        {/* === DETAIL / EDIT VIEW === */}
        {view === 'detail' && selectedSub && (
          <div className={`absolute inset-0 z-40 ${theme.bg} flex flex-col animate-slide-up`}>
            <div className="pt-12 px-6 flex justify-between items-center mb-6 z-10">
               <button onClick={() => setView('home')} className={`flex items-center gap-2 ${theme.textSec} hover:text-current transition-colors px-2 py-2`}>
                 <Icons.Back /> <span className="text-sm font-bold uppercase tracking-wider">{t('back')}</span>
               </button>
               <button onClick={() => deleteSub(selectedSub.uid)} className="px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all">
                 {t('remove')}
               </button>
            </div>

            <div className="px-8 flex-1 overflow-y-auto pb-4">
              <div className="flex items-center gap-5 mb-6">
                {/* ICON DISPLAY (STATIC PREVIEW) */}
                <AppIcon sub={selectedSub} size="lg" />
                
                <div className="flex-1 min-w-0">
                   <input type="text" value={selectedSub.name} onChange={(e) => updateSub(selectedSub.uid, 'name', e.target.value)} className={`bg-transparent text-2xl font-semibold ${theme.textMain} focus:outline-none w-full border-b border-transparent ${isDark ? 'focus:border-zinc-800' : 'focus:border-gray-200'} pb-1 transition-colors`} />
                </div>
              </div>

              {/* COLOR & IMAGE PICKER ROW */}
              <div className="mb-8">
                <p className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest mb-3`}>{t('pickColor')}</p>
                <div className="overflow-x-auto pb-2 flex gap-3 items-center">
                  
                  {/* Color Dots */}
                  {COLORS.map(c => (
                     <button 
                       key={c}
                       onClick={() => updateSub(selectedSub.uid, 'color', c)}
                       className={`w-8 h-8 rounded-full ${c} ${selectedSub.color === c ? 'ring-2 ring-offset-2 ring-current' : ''} shrink-0 transition-all`}
                     />
                  ))}
                  
                  <div className={`w-px h-6 ${isDark ? 'bg-zinc-800' : 'bg-gray-300'} mx-1`}></div>

                  {/* Upload Button (Small Camera Icon) */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center shrink-0 transition-all ${isDark ? 'border-zinc-600 text-zinc-400 hover:text-white hover:border-white' : 'border-gray-400 text-gray-500 hover:text-black hover:border-black'}`}
                    title="Upload Image"
                  >
                    <Icons.Upload />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="space-y-10">
                <div className="relative group">
                  <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest absolute -top-5 left-0`}>{t('monthlyCost')}</label>
                  <input type="number" inputMode="numeric" value={selectedSub.price === 0 ? '' : selectedSub.price} placeholder="0" onChange={(e) => updateSub(selectedSub.uid, 'price', e.target.value)} className={`w-full bg-transparent border-b ${theme.divider} py-2 text-5xl font-light ${theme.textMain} focus:outline-none focus:border-current transition-colors placeholder-gray-500`} />
                  <span className={`absolute right-0 bottom-4 ${theme.textSec} text-xl font-light pointer-events-none`}>{settings.lang === 'vi' ? 'VND' : ''}</span>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest absolute -top-5 left-0 flex items-center gap-1`}><Icons.Calendar /> {t('renewDay')}</label>
                    <input type="number" max="31" min="1" inputMode="numeric" value={selectedSub.dueDay} onChange={(e) => updateSub(selectedSub.uid, 'dueDay', parseInt(e.target.value) || '')} className={`w-full bg-transparent border-b ${theme.divider} py-2 text-3xl font-light ${theme.textMain} focus:outline-none focus:border-current transition-colors text-center`} />
                    <span className={`absolute left-0 -bottom-6 ${theme.textSec} text-[10px]`}>{t('dayOfMonth')}</span>
                  </div>
                  <div className="relative flex flex-col justify-end">
                     <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest mb-3`}>{t('type')}</label>
                     <button onClick={() => updateSub(selectedSub.uid, 'isTrial', !selectedSub.isTrial)} className={`h-12 w-full rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${selectedSub.isTrial ? 'bg-yellow-500 text-black border-yellow-500' : `${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-100 border-gray-200'} ${theme.textSec}`}`}>
                       <span className="font-bold uppercase text-xs">{selectedSub.isTrial ? t('trial') : t('paid')}</span>
                     </button>
                  </div>
                </div>

                <div className="relative group pt-4">
                  <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest absolute -top-1 left-0 flex items-center gap-1`}><Icons.Note /> {t('notes')}</label>
                  <textarea value={selectedSub.note || ''} onChange={(e) => updateSub(selectedSub.uid, 'note', e.target.value)} placeholder={t('notesPlaceholder')} className={`w-full ${isDark ? 'bg-zinc-900/30' : 'bg-gray-50'} rounded-xl p-4 text-sm ${theme.textMain} placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-current min-h-[100px] resize-none border ${theme.divider}`} />
                </div>
              </div>
            </div>

            <div className="p-6 pt-2 border-t border-transparent">
              <button onClick={() => setView('home')} className={`w-full h-14 ${theme.btnPrimary} rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all`}>
                {t('save')}
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
    </div>
  );
}
