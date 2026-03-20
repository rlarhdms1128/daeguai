import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Menu, ChevronLeft, ChevronRight, Check, X, Sparkles, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  const navigate = useNavigate();
  const MAIN_COLOR = '#3f4d8e'; 

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendar_events_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiSuggestion, setAiSuggestion] = useState(() => {
    const isDismissed = localStorage.getItem('ai_suggestion_dismissed') === 'true';
    return {
      title: '잔금 납부 및 입주',
      date: 20, 
      month: 2, 
      year: 2026,
      show: !isDismissed
    };
  });

  const [isInputOpen, setIsInputOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // ✅ 구글 캘린더 연동 팝업창을 위한 상태 관리
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [latestEventInfo, setLatestEventInfo] = useState(null);

  useEffect(() => {
    localStorage.setItem('calendar_events_v2', JSON.stringify(events));
  }, [events]);

  const years = [];
  for (let y = 2024; y <= 2040; y++) { years.push(y); }
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let i = 1; i <= lastDate; i++) calendarDays.push(i);

  const dismissAiSuggestion = () => {
    setAiSuggestion({ ...aiSuggestion, show: false });
    localStorage.setItem('ai_suggestion_dismissed', 'true');
  };

  // ✅ 일정 추가 직후 팝업을 띄우는 함수
  const triggerGoogleModal = (eventInfo) => {
    setLatestEventInfo(eventInfo);
    setShowGoogleModal(true);
  };

  const acceptAiSuggestion = () => {
    const newEvent = {
      id: 'ai-extract-' + Date.now(),
      year: aiSuggestion.year,
      month: aiSuggestion.month,
      day: aiSuggestion.date,
      title: `[AI] ${aiSuggestion.title}`,
      time: 'AI Extraction',
      color: '#EF4444'
    };
    setEvents([newEvent, ...events]);
    dismissAiSuggestion(); 
    triggerGoogleModal(newEvent); // 팝업 호출
  };

  const handleDirectAdd = () => {
    if (!newTitle.trim()) return;
    const dayNamesEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNamesEn[new Date(viewYear, viewMonth, selectedDate).getDay()];
    
    const newEvent = {
      id: Date.now(),
      year: viewYear,
      month: viewMonth,
      day: selectedDate,
      title: newTitle,
      time: `${selectedDate} ${dayName}`,
      color: 'white' 
    };
    setEvents([newEvent, ...events]);
    setNewTitle('');
    setIsInputOpen(false);
    triggerGoogleModal(newEvent); // 팝업 호출
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm("이 일정을 삭제할까요?")) {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
    }
  };

  // ✅ 구글 캘린더 '네' 버튼 눌렀을 때
  const handleGoogleYes = () => {
    if (!latestEventInfo) return;
    const calendar_summary = latestEventInfo.title;
    const description = "집어줌 AI 전세 사기 예방 서비스에서 추가한 일정입니다.";

    const startDate = new Date(latestEventInfo.year, latestEventInfo.month, latestEventInfo.day);
    const endDate = new Date(latestEventInfo.year, latestEventInfo.month, latestEventInfo.day + 1);

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}${m}${d}`;
    };

    const url = "https://www.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent(calendar_summary)
      + "&dates=" + `${formatDate(startDate)}/${formatDate(endDate)}`
      + "&details=" + encodeURIComponent(description)
      + "&crm=AVAILABLE"
      + "&ctz=Asia/Seoul";

    window.open(url, '_blank', 'noopener,noreferrer');
    setShowGoogleModal(false);
  };

  // ✅ 구글 캘린더 '아니요' 버튼 눌렀을 때
  const handleGoogleNo = () => {
    setShowGoogleModal(false);
  };

  return (
    <div style={{ backgroundColor: MAIN_COLOR, minHeight: '100vh', padding: '20px', color: 'white', boxSizing: 'border-box', position: 'relative' }}>
      <style>{`
        .calendar-card { background: rgba(255, 255, 255, 0.1); border-radius: 28px; padding: 35px 20px; color: white; box-shadow: 0 20px 50px rgba(11, 9, 9, 0.15); margin-top: 20px; backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.08); width: 100%; box-sizing: border-box; }
        .date-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-top: 25px; }
        .day-header { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 15px; }
        .date-cell { height: 48px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; cursor: pointer; position: relative; }
        .selected-date { background: white; color: ${MAIN_COLOR}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3); }
        .event-dot { position: absolute; bottom: 6px; width: 4px; height: 4px; background: #f87171; border-radius: 50%; }
        .full-width-box { width: 100%; box-sizing: border-box; margin-bottom: 12px; }
        .event-card-wide { background: rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 22px; color: white; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; }
        .ai-suggestion-box { background: rgba(255, 255, 255, 0.12); padding: 18px; border-radius: 22px; margin-top: 25px; border: 1px dashed rgba(255,255,255,0.3); backdrop-filter: blur(10px); width: 100%; box-sizing: border-box; }
        .input-box { background: white; padding: 15px; border-radius: 20px; margin: 20px 0; display: flex; gap: 10px; width: 100%; box-sizing: border-box; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* 상단 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ChevronLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        
        <select 
          value={viewYear} 
          onChange={(e) => setViewYear(Number(e.target.value))}
          style={{ 
            background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', 
            padding: '6px 10px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', outline: 'none', cursor: 'pointer'
          }}
        >
          {years.map(y => <option key={y} value={y} style={{ color: 'black' }}>{y}</option>)}
        </select>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '25px 0 10px', color: 'white' }}>Calendar</h1>

      {/* 📅 달력 카드 */}
      <div className="calendar-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <ChevronLeft size={22} onClick={() => setViewMonth(prev => (prev === 0 ? 11 : prev - 1))} style={{ cursor: 'pointer', opacity: 0.7 }} />
          <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '5px', color: 'white', margin: 0 }}>{months[viewMonth]}</h2>
          <ChevronRight size={22} onClick={() => setViewMonth(prev => (prev === 11 ? 0 : prev + 1))} style={{ cursor: 'pointer', opacity: 0.7 }} />
        </div>
        
        <div className="date-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="day-header">{d}</div>)}
          {calendarDays.map((date, i) => {
            const isSelected = selectedDate === date;
            const hasEvent = events.some(e => e.year === viewYear && e.month === viewMonth && e.day === date);
            
            return (
              <div key={i} className="date-cell" onClick={() => date && setSelectedDate(date)}>
                {date && (
                  <>
                    <div className={isSelected ? "selected-date" : ""}>{date}</div>
                    {hasEvent && !isSelected && <div className="event-dot" />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 📋 Upcoming Events */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', letterSpacing: '0.5px' }}>Upcoming Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="full-width-box">
                <div className="event-card-wide">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '4px', height: '30px', background: event.color === '#EF4444' ? '#f87171' : 'white', borderRadius: '2px' }} />
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>{event.title}</p>
                      <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>{event.time} • {event.year}.{event.month + 1}.{event.day}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteEvent(event.id)} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer', padding: '5px' }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', opacity: 0.4 }}>
              <CalendarIcon size={28} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13px' }}> 등록된 일정이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 입력창 (일정 추가하기 눌렀을 때 보임) */}
      {isInputOpen && (
        <div className="input-box">
          <input 
            type="text" 
            placeholder={`Add event for ${selectedDate} ${months[viewMonth].toLowerCase()}...`}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', color: '#102543', fontSize: '14px' }}
          />
          <button onClick={handleDirectAdd} style={{ background: MAIN_COLOR, color: 'white', border: 'none', padding: '8px 18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Add</button>
        </div>
      )}

      {/* 🤖 AI 제안 섹션 */}
      {aiSuggestion.show && (
        <div className="ai-suggestion-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={16} color="#FFD700" />
            <span style={{ fontSize: '12px', fontWeight: '700', opacity: 0.9 }}>AI Smart Extraction</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>{aiSuggestion.title}</p>
              <p style={{ fontSize: '11px', opacity: 0.7 }}>Found in your documents</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={dismissAiSuggestion} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', padding: '8px', cursor: 'pointer' }}><X size={18}/></button>
              <button onClick={acceptAiSuggestion} style={{ background: 'white', border: 'none', borderRadius: '10px', color: MAIN_COLOR, padding: '8px', cursor: 'pointer' }}><Check size={18}/></button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ 메인 일정 추가 버튼 */}
      {!isInputOpen && (
        <button 
          onClick={() => setIsInputOpen(true)}
          style={{ width: '100%', background: 'white', color: MAIN_COLOR, border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '900', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', cursor: 'pointer' }}
        >
          <Plus size={20} strokeWidth={3} /> 일정 추가하기
        </button>
      )}

      {/* 🚨 구글 캘린더 연동 커스텀 팝업 (모달) */}
      {showGoogleModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box'
        }}>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '25px', width: '100%', maxWidth: '340px', 
            padding: '30px 24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
            animation: 'slideUp 0.3s ease-out', color: '#1E293B'
          }}>
            <div style={{ width: '50px', height: '50px', background: '#F0FDF4', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CalendarIcon size={26} color="#22C55E" />
            </div>
            
            <h3 style={{ fontSize: '19px', fontWeight: '900', margin: '0 0 12px 0' }}>일정 등록 완료!</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              구글 캘린더에도 이 일정을<br/>추가하시겠습니까?
            </p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleGoogleNo} 
                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#F1F5F9', color: '#64748B', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
              >
                아니요
              </button>
              <button 
                onClick={handleGoogleYes} 
                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: MAIN_COLOR, color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(63,77,142,0.2)' }}
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}