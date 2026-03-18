import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Icons = {
  Back: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
};

export default function Calendar() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const MAIN_COLOR = '#3f4d8e';

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // 1. AI 자동 분석 일정 포함 상태
  // 시연을 위해 2026년 3월(month: 2)에 AI가 찾은 일정을 미리 넣어두었습니다.
  const [events, setEvents] = useState([
    { 
      id: 'ai-1', 
      year: 2026, 
      month: 2, 
      day: 20, 
      title: '[AI분석] 잔금 납부 및 입주 예정', 
      color: '#EF4444', // AI 분석 일정은 빨간색으로 강조
      isAI: true 
    },
    { 
      id: 'ai-2', 
      year: 2026, 
      month: 2, 
      day: 21, 
      title: '[AI분석] 전입신고 및 확정일자 권장', 
      color: '#3B82F6',
      isAI: true 
    }
  ]);
  
  const [newTripTitle, setNewTripTitle] = useState('');

  const years = [];
  for (let y = 2024; y <= 2040; y++) { years.push(y); }
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; 
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= lastDate; i++) calendarDays.push(i);

  useEffect(() => {
    if (scrollRef.current) {
      const activeItem = scrollRef.current.children[viewMonth];
      if (activeItem) {
        scrollRef.current.scrollTo({
          left: activeItem.offsetLeft - scrollRef.current.offsetWidth / 2 + activeItem.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [viewMonth]);

  const handleAddEvent = () => {
    if (!selectedDate) return alert('날짜를 먼저 선택해주세요!');
    if (!newTripTitle.trim()) return alert('일정 내용을 입력해주세요!');

    const newEntry = {
      id: Date.now(),
      year: viewYear,
      month: viewMonth,
      day: selectedDate,
      title: newTripTitle,
      color: MAIN_COLOR,
      isAI: false
    };

    setEvents([...events, newEntry]);
    setNewTripTitle(''); 
    alert(`${selectedDate}일 일정이 등록되었습니다.`);
  };

  const currentMonthEvents = events.filter(e => e.year === viewYear && e.month === viewMonth);
  const filteredEvents = selectedDate 
    ? currentMonthEvents.filter(e => e.day === selectedDate)
    : currentMonthEvents;

  return (
    <div className="content-wrapper" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ background: MAIN_COLOR, padding: '40px 20px 60px 20px', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div onClick={() => navigate('/')} style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icons.Back />
          </div>
          <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 'bold' }}>일정 관리</h2>
          <div style={{ width: '50px' }} />
        </div>
        
        <select 
          value={viewYear} 
          onChange={(e) => { setViewYear(Number(e.target.value)); setSelectedDate(null); }}
          style={{ 
            appearance: 'none', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
            color: 'white', padding: '10px 20px', borderRadius: '15px', fontSize: '20px', fontWeight: 'bold', outline: 'none'
          }}
        >
          {years.map(y => <option key={y} value={y} style={{color: 'black'}}>{y}년</option>)}
        </select>
      </div>

      <div style={{ background: 'white', marginTop: '-30px', borderRadius: '35px 35px 0 0', padding: '25px', flex: 1 }}>
        
        <div ref={scrollRef} style={{ display: 'flex', gap: '30px', overflowX: 'auto', paddingBottom: '25px', scrollbarWidth: 'none' }}>
          {months.map((m, idx) => (
            <div key={m} onClick={() => { setViewMonth(idx); setSelectedDate(null); }} style={{ flexShrink: 0, cursor: 'pointer', color: viewMonth === idx ? MAIN_COLOR : '#94A3B8', fontWeight: viewMonth === idx ? '900' : 'bold', fontSize: '19px', position: 'relative' }}>
              {m}월
              {viewMonth === idx && <div style={{ position: 'absolute', bottom: '-10px', left: '0', width: '100%', height: '4px', background: MAIN_COLOR, borderRadius: '10px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '15px', marginBottom: '20px', color: '#64748b', fontWeight: 'bold' }}>
          {['월', '화', '수', '목', '금', '토', '일'].map((day, i) => <div key={day} style={{ color: i >= 5 ? '#EF4444' : '#64748b' }}>{day}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', rowGap: '8px' }}>
          {calendarDays.map((date, i) => {
            const isToday = today.getDate() === date && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
            const isSelected = selectedDate === date;
            const dayEvents = currentMonthEvents.filter(e => e.day === date);
            const hasEvent = dayEvents.length > 0;
            const hasAIEvent = dayEvents.some(e => e.isAI);
            
            return (
              <div key={i} style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {date && (
                  <div 
                    onClick={() => setSelectedDate(date)} 
                    style={{
                      width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isSelected ? MAIN_COLOR : (isToday ? '#EEF2FF' : 'transparent'),
                      color: isSelected ? 'white' : (i % 7 >= 5 ? '#EF4444' : '#1E293B'),
                      fontWeight: '700', fontSize: '17px', cursor: 'pointer', border: isToday ? `1px solid ${MAIN_COLOR}` : 'none'
                    }}
                  >
                    {date}
                  </div>
                )}
                {/* AI 일정이 있으면 반짝이는 파란 점, 일반 일정이면 회색 점 */}
                {date && hasEvent && (
                  <div style={{ 
                    position: 'absolute', bottom: '2px', width: '6px', height: '6px', borderRadius: '50%', 
                    background: isSelected ? 'white' : (hasAIEvent ? '#3B82F6' : '#94A3B8'),
                    boxShadow: hasAIEvent ? '0 0 8px #3B82F6' : 'none'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div style={{ marginTop: '30px', padding: '20px', background: '#F8FAFC', borderRadius: '25px', border: `1.5px solid ${MAIN_COLOR}33` }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', color: MAIN_COLOR }}>{selectedDate}일 일정 등록</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={newTripTitle}
                onChange={(e) => setNewTripTitle(e.target.value)}
                placeholder="내용을 입력하세요"
                style={{ flex: 1, padding: '12px 15px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '17px', outline: 'none' }}
              />
              <button 
                onClick={handleAddEvent}
                style={{ padding: '0 20px', borderRadius: '12px', background: MAIN_COLOR, color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
              >
                추가
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>
            {selectedDate ? `${selectedDate}일 상세 일정` : `${viewMonth + 1}월 전체 일정`}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item) => (
                <div key={item.id} style={{ 
                  display: 'flex', alignItems: 'center', padding: '18px', borderRadius: '20px', 
                  background: item.isAI ? '#F0F7FF' : '#F8FAFC', 
                  border: item.isAI ? '1.2px solid #3B82F6' : '1.2px solid #F1F5F9' 
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, marginRight: '15px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '17px', fontWeight: '600', color: '#334155' }}>
                      {item.title}
                      {item.isAI && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#3B82F6', background: '#E0EFFF', padding: '2px 6px', borderRadius: '4px' }}>AI추천</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#94A3B8' }}>{item.day}일</div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#94A3B8', marginTop: '20px', fontSize: '16px' }}>등록된 일정이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}