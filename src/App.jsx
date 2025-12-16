import React, { useState, useEffect, useMemo } from 'react';

// --- 1. ICONS (GIỮ NGUYÊN, CHỈ BỎ CÁI KHÔNG DÙNG) ---
const Icons = {
  Plus: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Close: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Back: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Note: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Settings: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
};

// --- 2. LOCALIZATION (TỐI GIẢN HÓA TEXT) ---
const TRANSLATIONS = {
  vi: {
    totalBurn: 'Tổng chi tiêu tháng', // Viết thường cho nhẹ nhàng
    dailyAvg: 'TB ngày', // Viết tắt cho gọn
    noSubs: 'Chưa có đăng ký nào',
    tapToAdd: 'Chạm vào + để thêm',
    groupUrgent: 'Sắp đến hạn', // Bỏ chữ "Cần chú ý" nghe nặng nề
    groupWeek: 'Trong tuần này',
    groupLater: 'Sắp tới',
    today: 'Hôm nay',
    tomorrow: 'Ngày mai',
    addService: 'Thêm dịch vụ',
    customApp: 'Tùy chỉnh...',
    back: 'Quay lại',
    remove: 'Xóa dịch vụ',
    monthlyCost: 'Phí hàng tháng',
    renewDay: 'Ngày gia hạn hàng tháng',
    type: 'Loại gói',
    trial: 'Dùng thử',
    paid: 'Trả phí',
    notes: 'Ghi chú',
    notesPlaceholder: 'Thêm ghi chú...',
    settings: 'Cài đặt',
    appearance: 'Giao diện',
    language: 'Ngôn ngữ',
    save: 'Lưu thay đổi'
  }
};
// (Tạm thời hardcode tiếng Việt cho gọn, bạn có thể thêm lại tiếng Anh sau)
const t = (key) => TRANSLATIONS.vi[key] || key;


const PRESETS = [
  { name: 'Netflix', price: 260000, color: 'bg-[#E50914]', text: 'text-white', icon: 'N' },
  { name: 'Spotify', price: 59000, color: 'bg-[#1DB954]', text: 'text-black', icon: 'S' },
  { name: 'Youtube', price: 79000, color: 'bg-[#FF0000]', text: 'text-white', icon: '▶' },
  { name: 'Apple One', price: 239000, color: 'bg-white', text: 'text-black', icon: '' },
  { name: 'iCloud', price: 19000, color: 'bg-[#007AFF]', text: 'text-white', icon: '☁️' },
  { name: 'ChatGPT', price: 490000, color: 'bg-[#10A37F]', text: 'text-white', icon: 'AI' },
  { name: 'X', price: 250000, color: 'bg-zinc-800', text: 'text-white', icon: 'X' },
];

// --- MAIN COMPONENT ---
export default function SubTrackMinimal() {
  // SETTINGS & THEME
  const [settings, setSettings] = useState(() => {
    const s = localStorage.getItem('subtrack_settings');
    return s ? JSON.parse(s) : { theme: 'system' };
  });

  const [subs, setSubs] = useState(() => {
    try {
        const saved = localStorage.getItem('subtrack_v5');
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
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
    localStorage.setItem('subtrack_v5', JSON.stringify(subs));
    localStorage.setItem('subtrack_settings', JSON.stringify(settings));
  }, [subs, settings]);


  // --- LOGIC ENGINE (TỐI GIẢN HÓA NGÀY THÁNG) ---
  const getNextPaymentDate = (dueDay) => {
    const today = new Date(); today.setHours(0,0,0,0);
    let year = today.getFullYear(), month = today.getMonth(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let targetDay = Math.min(dueDay, daysInMonth);
    let paymentDate = new Date(year, month, targetDay);
    if (paymentDate < today) {
      month++;
      paymentDate = new Date(year, month, Math.min(dueDay, new Date(year, month + 1, 0).getDate()));
    }
    return paymentDate;
  };

  const calculateDaysLeft = (dueDay) => {
    const today = new Date(); today.setHours(0,0,0,0);
    return Math.ceil((getNextPaymentDate(dueDay) - today) / (86400000));
  };

  // Format ngày tháng siêu gọn: "05 thg 1" hoặc "Hôm nay"
  const formatShortDate = (dueDay) => {
    const daysLeft = calculateDaysLeft(dueDay);
    if (daysLeft === 0) return t('today');
    if (daysLeft === 1) return t('tomorrow');
    
    const date = getNextPaymentDate(dueDay);
    // Sử dụng Intl để format ngày tháng địa phương hóa gọn gàng
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short' }).format(date);
  };

  const sortedSubs = useMemo(() => {
    return [...subs].sort((a, b) => calculateDaysLeft(a.dueDay) - calculateDaysLeft(b.dueDay));
  }, [subs]);

  // Grouping Logic (Giữ nguyên vì nó giúp chia bố cục tốt)
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
    return { total };
  }, [subs]);

  const fMoney = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

  // ACTIONS
  const addSub = (preset) => {
    const newItem = { ...preset, uid: Date.now(), isTrial: false, dueDay: new Date().getDate(), price: preset.price || 0, note: '' };
    setSubs(prev => [...prev, newItem]); setSelectedSub(newItem); setView('detail'); 
  };
  const updateSub = (uid, field, value) => {
    setSubs(prev => prev.map(s => s.uid === uid ? { ...s, [field]: value } : s));
    setSelectedSub(prev => ({ ...prev, [field]: value })); 
  };
  const deleteSub = (uid) => { setSubs(prev => prev.filter(s => s.uid !== uid)); setView('home'); };

  // --- THEME COLORS (TINH CHỈNH LẠI CHO SẠCH HƠN) ---
  const theme = {
    bg: isDark ? 'bg-black' : 'bg-white', // Nền trắng tinh ở Light mode cho sạch
    // Card không còn border ở light mode, chỉ có shadow nhẹ
    cardBg: isDark ? 'bg-zinc-900' : 'bg-white', 
    cardStyle: isDark ? 'border border-zinc-800' : 'shadow-sm border border-gray-100', 
    textMain: isDark ? 'text-white' : 'text-zinc-900',
    textSec: isDark ? 'text-zinc-500' : 'text-zinc-500',
    divider: isDark ? 'border-zinc-800' : 'border-gray-100',
    headerBg: isDark ? 'bg-black/80' : 'bg-white/80', // Tăng độ trong suốt
    settingsBg: isDark ? 'bg-zinc-900' : 'bg-white',
    fab: isDark ? 'bg-white text-black' : 'bg-black text-white',
    groupTitle: isDark ? 'text-zinc-600' : 'text-zinc-400',
    accent: isDark ? 'text-emerald-400' : 'text-emerald-600', // Màu điểm nhấn (Daily Avg)
  };

  // --- RENDER CARD (THIẾT KẾ MỚI - SIÊU TỐI GIẢN) ---
  const renderCard = (sub) => {
    const daysLeft = calculateDaysLeft(sub.dueDay);
    const isUrgent = daysLeft <= 3;
    // Urgent chỉ đổi màu text ngày tháng, không đổi màu nền card nữa
    const dateColor = isUrgent ? (isDark ? 'text-orange-400 font-medium' : 'text-orange-600 font-medium') : theme.textSec;

    return (
      <button
        key={sub.uid}
        onClick={() => { setSelectedSub(sub); setView('detail'); }}
        // Loại bỏ hiệu ứng lún sâu, chỉ scale nhẹ. Card gọn gàng hơn.
        className={`w-full flex items-center justify-between p-3 mb-2 rounded-2xl transition-all active:scale-[0.99] ${theme.cardBg} ${theme.cardStyle}`}
      >
        <div className="flex items-center gap-3.5 overflow-hidden">
          {/* Icon nhỏ lại một chút */}
          <div className={`w-10 h-10 rounded-xl ${sub.color} ${sub.text} flex items-center justify-center text-lg font-bold shrink-0`}>
            {sub.icon}
          </div>
          <div className="text-left overflow-hidden">
            <h3 className={`text-[15px] font-semibold truncate flex items-center gap-1.5 ${theme.textMain}`}>
              {sub.name}
              {/* Chấm vàng tinh tế cho Trial thay vì badge to */}
              {sub.isTrial && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block"></span>}
              {/* Icon Note nhỏ xíu nếu có */}
              {sub.note && <span className={`${theme.textSec} opacity-70 scale-75`}><Icons.Note /></span>}
            </h3>
            {/* Ngày tháng siêu gọn */}
            <p className={`text-[13px] ${dateColor}`}>
               {formatShortDate(sub.dueDay)}
            </p>
          </div>
        </div>
        <div className="text-right pl-2 shrink-0">
           {/* Giá tiền to rõ */}
           <p className={`text-[15px] font-semibold tabular-nums ${sub.isTrial ? `line-through ${theme.textSec} opacity-70` : theme.textMain}`}>
             {fMoney(sub.price)}<span className="text-[11px] font-normal ml-0.5 opacity-70">đ</span>
           </p>
        </div>
      </button>
    );
  };

  // --- LAYOUT CHÍNH ---
  return (
    // Thêm safe-area-inset cho các đời iPhone mới
    <div className={`h-[100dvh] overflow-hidden ${theme.bg} font-sans flex justify-center transition-colors duration-300 supports-[height:100dvh]:h-[100dvh] safe-area-inset-bottom`}>
      <div className={`w-full max-w-md h-full flex flex-col relative shadow-2xl transition-colors duration-300`}>
        
        {/* === HOME VIEW (GIAO DIỆN MỚI) === */}
        {view === 'home' && (
          <div className="flex flex-col h-full animate-fade-in relative">
            {/* HEADER MỚI: Căn giữa, tập trung vào tổng tiền */}
            <div className={`pt-12 px-6 pb-4 ${theme.headerBg} backdrop-blur-lg z-20 sticky top-0 border-b ${theme.divider} transition-all text-center flex flex-col items-center`}>
              
              {/* Nút Settings nhỏ gọn góc phải */}
              <button onClick={() => setShowSettings(true)} className={`absolute top-12 right-4 p-2 rounded-full transition-colors ${theme.textSec} hover:text-current opacity-70 hover:opacity-100`}>
                <Icons.Settings />
              </button>

              <p className={`${theme.textSec} text-[11px] font-medium tracking-widest uppercase mb-1 opacity-80`}>
                {t('totalBurn')}
              </p>
              
              {/* Tổng tiền to và nằm giữa */}
              <div className="flex items-baseline justify-center">
                <h1 className={`text-5xl font-bold tracking-tight leading-none ${theme.textMain}`}>{fMoney(stats.total)}</h1>
                <span className={`text-2xl font-light ml-1 ${theme.textSec}`}>đ</span>
              </div>
              
              {/* Daily Avg: Dòng text nhỏ tinh tế bên dưới, không dùng Pill nữa */}
              <p className={`text-xs font-medium mt-2 ${theme.accent} flex items-center gap-1 opacity-90`}>
                 ≈ {fMoney((stats.total / 30).toFixed(0))}đ / {t('dailyAvg')}
              </p>
              
              {/* ĐÃ LOẠI BỎ HOÀN TOÀN TICKER */}
            </div>

            {/* LIST AREA (BỐ CỤC THOÁNG HƠN) */}
            <div className="flex-1 px-4 overflow-y-auto pb-32 pt-2 no-scrollbar">
              {sortedSubs.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-32 opacity-40">
                  <p className={`text-sm font-medium ${theme.textSec}`}>{t('noSubs')}</p>
                  <p className={`text-xs mt-1 ${theme.textSec}`}>{t('tapToAdd')}</p>
                </div>
              ) : (
                <>
                  {/* Tiêu đề nhóm nhỏ và mờ hơn */}
                  {[
                    { key: 'urgent', label: t('groupUrgent') },
                    { key: 'week', label: t('groupWeek') },
                    { key: 'later', label: t('groupLater') }
                  ].map(group => groupedSubs[group.key].length > 0 && (
                    <div key={group.key} className="mb-5 animate-slide-up">
                      <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 pl-1 ${theme.groupTitle}`}>
                        {group.label}
                      </p>
                      {groupedSubs[group.key].map(renderCard)}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
               <button onClick={() => setView('add')} className={`pointer-events-auto ${theme.fab} h-14 w-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all`}>
                 <Icons.Plus />
               </button>
            </div>
          </div>
        )}

        {/* === SETTINGS VIEW (Tối giản hóa) === */}
        {showSettings && (
           <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in" onClick={() => setShowSettings(false)}>
              <div className={`w-full ${theme.settingsBg} rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-slide-up`} onClick={e => e.stopPropagation()}>
                 <div className="w-10 h-1 bg-gray-300/20 rounded-full mx-auto mb-8"></div>
                 <h2 className={`text-2xl font-bold mb-8 ${theme.textMain}`}>{t('settings')}</h2>
                 
                 {/* Appearance Setting */}
                 <div className="mb-8">
                    <p className={`text-xs font-bold ${theme.textSec} uppercase tracking-widest mb-3`}>Chế độ nền</p>
                    <div className={`flex p-1 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                       {['light', 'system', 'dark'].map((mode) => (
                          <button key={mode} onClick={() => setSettings({ theme: mode })} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${settings.theme === mode ? (isDark ? 'bg-zinc-700 text-white shadow-sm' : 'bg-white text-black shadow-sm') : theme.textSec}`}>
                             {mode === 'light' ? 'Sáng' : mode === 'dark' ? 'Tối' : 'Tự động'}
                          </button>
                       ))}
                    </div>
                 </div>
                 {/* Bỏ phần chọn ngôn ngữ vì đang hardcode tiếng Việt cho gọn */}
              </div>
           </div>
        )}

        {/* === ADD VIEW & DETAIL VIEW (Giữ nguyên logic, chỉ cập nhật theme) === */}
        {/* (Phần này dài dòng và logic không đổi, tôi giữ lại khung sườn để code chạy được.
            Nếu bạn cần tối giản cả phần này, hãy bảo tôi, nhưng tôi nghĩ Home mới là quan trọng nhất) */}
        {(view === 'add' || (view === 'detail' && selectedSub)) && (
           <div className={`absolute inset-0 z-40 ${theme.bg} flex flex-col animate-slide-up ${theme.textMain}`}>
               {/* Header đơn giản */}
               <div className="pt-12 px-4 flex justify-between items-center mb-4 z-10">
                 {view === 'detail' ? (
                    <button onClick={() => setView('home')} className={`p-2 ${theme.textSec} hover:text-current`}><Icons.Back /></button>
                 ) : <div className="w-8"></div>}
                 
                 <h2 className="text-lg font-semibold">{view === 'add' ? t('addService') : selectedSub.name}</h2>

                 {view === 'detail' ? (
                   <button onClick={() => deleteSub(selectedSub.uid)} className="text-red-500 text-sm font-medium p-2">{t('remove')}</button>
                 ) : (
                   <button onClick={() => setView('home')} className={`p-2 ${theme.textSec} hover:text-current`}><Icons.Close /></button>
                 )}
               </div>

               <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
                  {view === 'add' ? (
                    // ADD LIST
                    <div className="space-y-3">
                      {PRESETS.map(p => (
                        <button key={p.name} onClick={() => addSub(p)} className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-colors active:scale-[0.98] ${theme.cardBg} ${theme.cardStyle}`}>
                          <div className={`w-10 h-10 rounded-xl ${p.color} ${p.text} flex items-center justify-center font-bold`}>{p.icon}</div>
                          <div className="flex-1 text-left font-medium">{p.name}</div>
                          <div className={`${theme.textSec} text-sm`}>{fMoney(p.price)}đ</div>
                        </button>
                      ))}
                       <button onClick={() => addSub({ name: 'Tùy chỉnh', price: 0, color: 'bg-zinc-500', text: 'text-white', icon: '?', note: '' })} className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed transition-all mt-4 ${theme.textSec} border-current opacity-60 hover:opacity-100`}>
                          + {t('customApp')}
                       </button>
                    </div>
                  ) : (
                    // DETAIL EDIT FORM
                    <div className="space-y-8 pt-4">
                        {/* Input Giá */}
                        <div>
                          <label className={`text-xs font-medium ${theme.textSec} block mb-1`}>{t('monthlyCost')}</label>
                          <div className="flex items-baseline">
                            <input type="number" inputMode="numeric" value={selectedSub.price === 0 ? '' : selectedSub.price} placeholder="0" onChange={(e) => updateSub(selectedSub.uid, 'price', e.target.value)} className={`bg-transparent text-4xl font-bold focus:outline-none w-full p-0 placeholder-opacity-30 ${theme.textMain} placeholder-current`} />
                            <span className={`text-xl ${theme.textSec} ml-2`}>đ</span>
                          </div>
                        </div>
                        
                        {/* Input Ngày & Loại */}
                        <div className="flex gap-6">
                          <div className="flex-1">
                             <label className={`text-xs font-medium ${theme.textSec} block mb-2 flex items-center gap-1`}><Icons.Calendar /> {t('renewDay')}</label>
                             <input type="number" max="31" min="1" inputMode="numeric" value={selectedSub.dueDay} onChange={(e) => updateSub(selectedSub.uid, 'dueDay', parseInt(e.target.value) || '')} className={`w-full bg-transparent border-b ${theme.divider} py-2 text-2xl font-semibold text-center focus:outline-none focus:border-current transition-colors ${theme.textMain}`} />
                          </div>
                           <div className="flex-1">
                             <label className={`text-xs font-medium ${theme.textSec} block mb-2`}>{t('type')}</label>
                             <button onClick={() => updateSub(selectedSub.uid, 'isTrial', !selectedSub.isTrial)} className={`h-[50px] w-full rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 font-medium text-sm ${selectedSub.isTrial ? 'bg-yellow-400 text-black border-yellow-400' : `${theme.cardStyle} ${theme.textSec}`}`}>
                               {selectedSub.isTrial ? t('trial') : t('paid')}
                             </button>
                           </div>
                        </div>
                        {/* Note */}
                         <div>
                           <label className={`text-xs font-medium ${theme.textSec} block mb-2 flex items-center gap-1`}><Icons.Note /> {t('notes')}</label>
                           <textarea value={selectedSub.note || ''} onChange={(e) => updateSub(selectedSub.uid, 'note', e.target.value)} placeholder={t('notesPlaceholder')} className={`w-full ${isDark ? 'bg-zinc-800/50' : 'bg-gray-50'} rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-current min-h-[100px] resize-none ${theme.textMain} placeholder-opacity-50 placeholder-current`} />
                         </div>
                    </div>
                  )}
               </div>
               
               {/* Save Button cho Detail View */}
               {view === 'detail' && (
                  <div className="p-4 pt-2">
                    <button onClick={() => setView('home')} className={`w-full h-12 ${theme.fab} rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all`}>
                      {t('save')}
                    </button>
                  </div>
               )}
           </div>
        )}
      </div>

      {/* GLOBAL CSS TRICKS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.25s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
        /* Hỗ trợ iPhone tai thỏ */
        .safe-area-inset-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}
