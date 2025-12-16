import React, { useState, useEffect, useMemo } from 'react';

// --- 1. ASSETS & ICONS (Giữ nguyên, loại bỏ Ticker Icon) ---
const Icons = {
  Plus: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Close: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Back: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Note: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Settings: () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  NoteIndicator: () => <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  TrendUp: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
};

// --- 2. LOCALIZATION ---
const TRANSLATIONS = {
  en: {
    totalBurn: 'Monthly Total',
    dailyAvg: 'Daily avg',
    noSubs: 'No subscriptions yet.',
    tapToAdd: 'Tap + to add one.',
    groupUrgent: 'Due Soon',
    groupWeek: 'This Week',
    groupLater: 'Upcoming',
    today: 'Today',
    tomorrow: 'Tomorrow',
    inDays: 'in {days}d',
    addService: 'New Subscription',
    customApp: 'Custom App...',
    back: 'Back',
    remove: 'Remove Subscription',
    monthlyCost: 'Monthly Cost',
    renewDay: 'Renew Day',
    dayOfMonth: 'Day (1-31)',
    type: 'Plan Type',
    trial: 'Trial / Free',
    paid: 'Paid',
    notes: 'Notes',
    notesPlaceholder: 'Any details...',
    settings: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    trialLabel: 'TRIAL',
    save: 'Save'
  },
  vi: {
    totalBurn: 'TỔNG CHI TIÊU THÁNG',
    dailyAvg: 'Trung bình ngày',
    noSubs: 'Chưa có đăng ký nào.',
    tapToAdd: 'Bấm + để thêm mới.',
    groupUrgent: 'Sắp đến hạn',
    groupWeek: 'Tuần này',
    groupLater: 'Sắp tới',
    today: 'Hôm nay',
    tomorrow: 'Ngày mai',
    inDays: 'còn {days} ngày',
    addService: 'Thêm Dịch Vụ',
    customApp: 'Ứng dụng khác...',
    back: 'Quay lại',
    remove: 'Xóa gói này',
    monthlyCost: 'PHÍ HÀNG THÁNG',
    renewDay: 'NGÀY GIA HẠN',
    dayOfMonth: 'Ngày (1-31)',
    type: 'LOẠI GÓI',
    trial: 'Dùng thử / Free',
    paid: 'Trả phí',
    notes: 'GHI CHÚ',
    notesPlaceholder: 'Ghi chú thêm...',
    settings: 'Cài đặt',
    appearance: 'Giao diện',
    language: 'Ngôn ngữ',
    trialLabel: 'DÙNG THỬ',
    save: 'Lưu'
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

// --- MAIN COMPONENT ---
export default function SubTrackZen() {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('subtrack_settings');
      return s ? JSON.parse(s) : { theme: 'system', lang: 'vi' };
    }
    return { theme: 'system', lang: 'vi' };
  });

  const [subs, setSubs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('subtrack_vfinal');
        return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
    }
    return [];
  });
  
  const [view, setView] = useState('home'); 
  const [selectedSub, setSelectedSub] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [systemTheme, setSystemTheme] = useState('dark');
  
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

  // --- LOGIC ENGINE ---
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

  // Hàm format ngày tháng tối giản mới
  const formatMinimalDate = (dueDay, daysLeft) => {
    if (daysLeft === 0) return t('today');
    if (daysLeft === 1) return t('tomorrow');
    if (daysLeft <= 3) return t('inDays', { days: daysLeft });
    
    // Nếu còn xa, chỉ hiện ngày/tháng
    const date = getNextPaymentDate(dueDay);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
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

  const totalBurn = useMemo(() => {
    return subs.reduce((acc, s) => s.isTrial ? acc : acc + Number(s.price || 0), 0);
  }, [subs]);

  const fMoney = (n) => new Intl.NumberFormat(settings.lang === 'vi' ? 'vi-VN' : 'en-US').format(n || 0);

  // --- ACTIONS ---
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

  const deleteSub = (uid) => {
    setSubs(prev => prev.filter(s => s.uid !== uid));
    setView('home');
  };

  // --- THEME ---
  const theme = {
    bg: isDark ? 'bg-black' : 'bg-white', // Nền trắng tinh hoặc đen tuyền
    textMain: isDark ? 'text-white' : 'text-gray-900',
    textSec: isDark ? 'text-zinc-500' : 'text-gray-400',
    divider: isDark ? 'border-zinc-800' : 'border-gray-100',
    cardBg: isDark ? 'bg-zinc-900/50' : 'bg-white',
    cardBorder: isDark ? 'border-zinc-800/50' : 'border-gray-100 shadow-sm',
    fab: isDark ? 'bg-white text-black' : 'bg-black text-white',
    groupTitle: isDark ? 'text-zinc-600' : 'text-gray-400',
    settingsBg: isDark ? 'bg-[#111]' : 'bg-white',
    segmentBg: isDark ? 'bg-zinc-800' : 'bg-gray-100',
    segmentActive: isDark ? 'bg-zinc-600 text-white' : 'bg-white text-black shadow-sm',
  };

  // --- RENDER CARD (MINIMALIST VERSION) ---
  const renderCard = (sub) => {
    const daysLeft = calculateDaysLeft(sub.dueDay);
    const isUrgent = daysLeft <= 3;
    const dateDisplay = formatMinimalDate(sub.dueDay, daysLeft);
    
    // Subtle urgency indication (just text color)
    const statusColor = isUrgent ? 'text-orange-500 font-medium' : theme.textSec;

    return (
      <button
        key={sub.uid}
        onClick={() => { setSelectedSub(sub); setView('detail'); }}
        // Card style: Cleaner, less shadow, subtle border
        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 active:scale-[0.98] mb-2 ${theme.cardBg} ${theme.cardBorder}`}
      >
        <div className="flex items-center gap-3">
          {/* Smaller, Circular Icon */}
          <div className={`w-10 h-10 rounded-full ${sub.color} ${sub.text} flex items-center justify-center text-lg font-bold shadow-sm shrink-0`}>
            {sub.icon}
          </div>
          <div className="text-left">
            {/* Name Row */}
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-semibold ${theme.textMain}`}>{sub.name}</h3>
              {sub.note && sub.note.trim() !== '' && (
                 <span className={`${theme.textSec} opacity-70`}><Icons.NoteIndicator /></span>
              )}
              {sub.isTrial && <span className="text-[9px] bg-yellow-400/90 text-black px-1.5 py-0.5 rounded-md font-bold tracking-wider">{t('trialLabel')}</span>}
            </div>
            {/* Minimal Status Row */}
            <div className={`text-xs mt-0.5 ${statusColor}`}>
               {dateDisplay}
            </div>
          </div>
        </div>
        {/* Price */}
        <div className="text-right">
           <p className={`text-sm font-medium ${sub.isTrial ? `line-through ${theme.textSec}` : theme.textMain}`}>{fMoney(sub.price)}</p>
        </div>
      </button>
    );
  };

  return (
    <div className={`h-[100dvh] overflow-hidden ${theme.bg} ${theme.textMain} font-sans flex justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-md ${theme.bg} h-full flex flex-col relative border-x ${theme.divider} transition-colors duration-300`}>
        
        {/* === HOME === */}
        {view === 'home' && (
          <div className="flex flex-col h-full animate-fade-in relative">
            
            {/* CLEAN HEADER */}
            <div className={`pt-12 px-6 pb-4 z-20 sticky top-0 ${theme.bg} ${isDark ? 'bg-opacity-80' : 'bg-opacity-80'} backdrop-blur-md border-b ${theme.divider}`}>
              <div className="flex justify-between items-center mb-2">
                <p className={`${theme.textSec} text-[10px] font-bold tracking-widest uppercase opacity-80`}>
                  {t('totalBurn')}
                </p>
                <button onClick={() => setShowSettings(true)} className={`p-2 -mr-2 rounded-full transition-colors ${theme.textSec} hover:text-current`}>
                  <Icons.Settings />
                </button>
              </div>

              <div className="flex items-end gap-3 mb-2">
                <div className="flex items-baseline">
                  <h1 className="text-4xl font-bold tracking-tighter leading-none">{fMoney(totalBurn)}</h1>
                  <span className={`text-lg font-light ml-1 ${theme.textSec}`}>{settings.lang === 'vi' ? 'đ' : ''}</span>
                </div>
                
                {/* Daily Pill (Cleaner) */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap mb-0.5 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                   <Icons.TrendUp />
                   <span>{fMoney((totalBurn / 30).toFixed(0))}/{t('day')}</span>
                </div>
              </div>
            </div>

            {/* LIST AREA (No Ticker, Subtle Groups) */}
            <div className="flex-1 px-4 overflow-y-auto pb-32 pt-4 no-scrollbar">
              {sortedSubs.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 opacity-40">
                  <p className="text-sm font-medium">{t('noSubs')}</p>
                  <p className="text-xs mt-1">{t('tapToAdd')}</p>
                </div>
              ) : (
                <>
                  {groupedSubs.urgent.length > 0 && (
                    <div className="mb-5 animate-slide-up">
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 pl-1 ${theme.groupTitle}`}>{t('groupUrgent')}</p>
                      {groupedSubs.urgent.map(renderCard)}
                    </div>
                  )}
                  {groupedSubs.week.length > 0 && (
                    <div className="mb-5 animate-slide-up">
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 pl-1 ${theme.groupTitle}`}>{t('groupWeek')}</p>
                      {groupedSubs.week.map(renderCard)}
                    </div>
                  )}
                  {groupedSubs.later.length > 0 && (
                    <div className="mb-5 animate-slide-up">
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 pl-1 ${theme.groupTitle}`}>{t('groupLater')}</p>
                      {groupedSubs.later.map(renderCard)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* FAB */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
               <button onClick={() => setView('add')} className={`pointer-events-auto ${theme.fab} h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all`}>
                 <Icons.Plus />
               </button>
            </div>
          </div>
        )}

        {/* === SETTINGS PANEL (Bottom Sheet style) === */}
        {showSettings && (
           <div className="absolute inset-0 z-[60] bg-black/20 backdrop-blur-sm flex flex-col justify-end animate-fade-in" onClick={() => setShowSettings(false)}>
              <div className={`w-full ${theme.settingsBg} rounded-t-3xl p-6 pb-10 shadow-xl animate-slide-up`} onClick={e => e.stopPropagation()}>
                 <div className="w-10 h-1 bg-gray-300/50 rounded-full mx-auto mb-6"></div>
                 <h2 className="text-xl font-bold mb-6">{t('settings')}</h2>
                 
                 <div className="space-y-6">
                    <div>
                        <p className={`text-xs font-semibold ${theme.textSec} mb-2`}>{t('appearance')}</p>
                        <div className={`flex p-1 rounded-xl ${theme.segmentBg}`}>
                        {['light', 'system', 'dark'].map((mode) => (
                            <button key={mode} onClick={() => setSettings({...settings, theme: mode})} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${settings.theme === mode ? theme.segmentActive : theme.textSec}`}>
                                {mode}
                            </button>
                        ))}
                        </div>
                    </div>
                    <div>
                        <p className={`text-xs font-semibold ${theme.textSec} mb-2`}>{t('language')}</p>
                        <div className={`flex p-1 rounded-xl ${theme.segmentBg}`}>
                        {['vi', 'en'].map((l) => (
                            <button key={l} onClick={() => setSettings({...settings, lang: l})} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${settings.lang === l ? theme.segmentActive : theme.textSec}`}>
                                {l === 'vi' ? 'Tiếng Việt' : 'English'}
                            </button>
                        ))}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* === ADD VIEW === */}
        {view === 'add' && (
          <div className={`absolute inset-0 z-30 ${theme.bg} flex flex-col animate-slide-up`}>
             <div className={`pt-12 px-6 flex justify-between items-center mb-4`}>
               <h2 className="text-xl font-bold">{t('addService')}</h2>
               <button onClick={() => setView('home')} className={`p-2 rounded-full ${theme.segmentBg} hover:opacity-80 transition-opacity`}>
                 <Icons.Close />
               </button>
             </div>
             <div className="px-4 space-y-2 overflow-y-auto pb-10 no-scrollbar">
               {PRESETS.map(p => (
                 <button key={p.name} onClick={() => addSub(p)} className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border active:scale-[0.99] ${theme.cardBg} ${theme.cardBorder}`}>
                   <div className={`w-10 h-10 rounded-full ${p.color} ${p.text} flex items-center justify-center font-bold`}>{p.icon}</div>
                   <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className={`text-xs ${theme.textSec}`}>{fMoney(p.price)}</div>
                   </div>
                 </button>
               ))}
               <button onClick={() => addSub({ name: 'Custom', price: 0, color: 'bg-zinc-500', text: 'text-white', icon: '?', note: '' })} className={`w-full flex items-center gap-4 p-3 rounded-2xl border border-dashed ${theme.cardBorder} transition-all mt-2 opacity-70 hover:opacity-100`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${theme.segmentBg} ${theme.textSec}`}>?</div>
                  <div className="font-medium text-sm ${theme.textSec}">{t('customApp')}</div>
               </button>
             </div>
          </div>
        )}

        {/* === DETAIL / EDIT VIEW (Minimalist) === */}
        {view === 'detail' && selectedSub && (
          <div className={`absolute inset-0 z-40 ${theme.bg} flex flex-col animate-slide-up`}>
            {/* Top Nav */}
            <div className="pt-12 px-6 flex justify-between items-center mb-8">
               <button onClick={() => setView('home')} className={`p-2 -ml-2 ${theme.textSec} hover:text-current transition-colors`}>
                 <Icons.Back />
               </button>
               <button onClick={() => deleteSub(selectedSub.uid)} className="text-red-500 text-xs font-bold uppercase tracking-wider hover:opacity-70 transition-opacity">
                 {t('remove')}
               </button>
            </div>

            <div className="px-8 flex-1 overflow-y-auto pb-4 no-scrollbar">
              {/* Big Icon & Name Input */}
              <div className="flex flex-col items-center gap-4 mb-10">
                <div className={`w-20 h-20 rounded-full ${selectedSub.color} ${selectedSub.text} flex items-center justify-center text-4xl font-bold shadow-md`}>
                  {selectedSub.icon}
                </div>
                <input type="text" value={selectedSub.name} onChange={(e) => updateSub(selectedSub.uid, 'name', e.target.value)} className={`bg-transparent text-2xl font-bold text-center ${theme.textMain} focus:outline-none border-b border-transparent focus:border-current pb-1 transition-colors`} />
              </div>

              {/* Form Fields (Cleaner) */}
              <div className="space-y-8">
                {/* Price */}
                <div className="relative">
                  <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest absolute -top-4 left-0`}>{t('monthlyCost')}</label>
                  <div className="flex items-baseline">
                    <input type="number" inputMode="numeric" value={selectedSub.price === 0 ? '' : selectedSub.price} placeholder="0" onChange={(e) => updateSub(selectedSub.uid, 'price', e.target.value)} className={`w-full bg-transparent py-2 text-4xl font-light ${theme.textMain} focus:outline-none placeholder-gray-300/30 tracking-tight`} />
                    <span className={`${theme.textSec} text-xl font-light ml-2`}>{settings.lang === 'vi' ? 'đ' : ''}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6 items-end">
                  {/* Date */}
                  <div className="col-span-2 relative">
                    <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest absolute -top-4 left-0 flex items-center gap-1`}><Icons.Calendar /> {t('renewDay')}</label>
                    <input type="number" max="31" min="1" inputMode="numeric" value={selectedSub.dueDay} onChange={(e) => updateSub(selectedSub.uid, 'dueDay', parseInt(e.target.value) || '')} className={`w-full bg-transparent py-2 text-3xl font-light ${theme.textMain} focus:outline-none text-center border-b ${theme.divider}`} />
                  </div>
                  {/* Type Toggle */}
                  <div className="col-span-3">
                     <button onClick={() => updateSub(selectedSub.uid, 'isTrial', !selectedSub.isTrial)} className={`h-10 w-full rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${selectedSub.isTrial ? 'bg-yellow-400 border-yellow-400 text-black' : `${theme.cardBg} ${theme.cardBorder} ${theme.textSec}`}`}>
                       <span className="font-bold uppercase text-xs">{selectedSub.isTrial ? t('trial') : t('paid')}</span>
                     </button>
                  </div>
                </div>

                {/* Note */}
                <div className="relative pt-4">
                  <label className={`text-[10px] font-bold ${theme.textSec} uppercase tracking-widest absolute -top-1 left-0 flex items-center gap-1`}><Icons.Note /> {t('notes')}</label>
                  <textarea value={selectedSub.note || ''} onChange={(e) => updateSub(selectedSub.uid, 'note', e.target.value)} placeholder={t('notesPlaceholder')} className={`w-full ${theme.cardBg} rounded-xl p-4 text-sm ${theme.textMain} placeholder-gray-400/50 focus:outline-none focus:ring-1 focus:ring-current min-h-[80px] resize-none border ${theme.cardBorder}`} />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="p-6 pt-4">
              <button onClick={() => setView('home')} className={`w-full h-12 ${theme.fab} rounded-2xl font-bold text-sm uppercase tracking-widest shadow-md active:scale-[0.98] transition-all`}>
                {t('save')}
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>
    </div>
  );
}
