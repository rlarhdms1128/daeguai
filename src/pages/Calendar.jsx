import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Menu, ChevronDown, ChevronLeft, ChevronRight, Check, X, Sparkles, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  const navigate = useNavigate();
  const MAIN_COLOR = '#3f4d8e'; 

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const [aiSuggestion, setAiSuggestion] = useState({
    title: '잔금 납부 및 입주',
    date: 20, 
    month: 2, 
    year: 2026,
    show: true
  });

  const [events, setEvents] = useState([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const years = [];
  for (let y = 2024; y <= 2040; y++) { years.push(y); }
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let i = 1; i <= lastDate; i++) calendarDays.push(i);

  const acceptAiSuggestion = () => {
    const newEvent = {
      id: 'ai-extract',
      year: aiSuggestion.year,
      month: aiSuggestion.month,
      day: aiSuggestion.date,
      title: `[AI] ${aiSuggestion.title}`,
      time: 'AI Extraction',
      color: '#EF4444'
    };
    setEvents([newEvent, ...events]);
    setAiSuggestion({ ...aiSuggestion, show: false });
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
  };

  return (
    <div style={{ backgroundColor: MAIN_COLOR, minHeight: '100vh', padding: '20px', color: 'white', boxSizing: 'border-box' }}>
      <style>{`
        .calendar-card {
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 28px; padding: 35px 20px; color: white;
          box-shadow: 0 20px 50px rgba(11, 9, 9, 0.15); margin-top: 20px;
          backdrop-filter: blur(25px); 
          border: 1px solid rgba(255,255,255,0.08);
          width: 100%; box-sizing: border-box;
        }
        .date-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-top: 25px; }
        .day-header { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 15px; }
        .date-cell { height: 48px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; cursor: pointer; position: relative; }
        .selected-date { background: white; color: ${MAIN_COLOR}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3); }
        .event-dot { position: absolute; bottom: 6px; width: 4px; height: 4px; background: #f87171; border-radius: 50%; }
        
        /* ✅ 버튼과 카드의 가로 길이를 100%로 통일 ㅋ */
        .full-width-box { width: 100%; box-sizing: border-box; margin-bottom: 12px; }
        
        .event-card-wide { 
          background: rgba(255, 255, 255, 0.08); 
          padding: 20px; border-radius: 22px; 
          color: white; backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }

        .ai-suggestion-box {
          background: rgba(255, 255, 255, 0.12); padding: 18px; border-radius: 22px; margin-top: 25px;
          border: 1px dashed rgba(255,255,255,0.3); backdrop-filter: blur(10px); width: 100%; box-sizing: border-box;
        }
        .input-box { background: white; padding: 15px; border-radius: 20px; margin: 20px 0; display: flex; gap: 10px; width: 100%; box-sizing: border-box; }
      `}</style>

      {/* 상단 바 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Menu size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <span style={{ fontWeight: '800' }}>{viewYear}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* ✅ 'Calendar' 글자 하얗게 설정 ㅋ */}
      <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '25px 0 10px', color: 'white' }}>Calendar</h1>

      {/* 📅 달력 카드 */}
      <div className="calendar-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <ChevronLeft size={22} onClick={() => setViewMonth(prev => (prev === 0 ? 11 : prev - 1))} style={{ cursor: 'pointer', opacity: 0.7 }} />
          <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '5px', color: 'white', margin: 0 }}>{months[viewMonth]}</h2>
          <ChevronRight size={22} onClick={() => setViewMonth(prev => (prev === 11 ? 0 : prev + 1))} style={{ cursor: 'pointer', opacity: 0.7 }} />
        </div>
        
        <div className="date-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="day-header">{d}</div>
          ))}
          {calendarDays.map((date, i) => {
            const isSelected = selectedDate === date;
            const hasEvent = events.some(e => e.year === viewYear && e.month === viewMonth && e.day === date);
            
            return (
              <div key={i} className="date-cell" onClick={() => date && setSelectedDate(date)}>
                {date && (
                  <>
                    <div className={isSelected ? "selected-date" : ""}>
                      {date}
                    </div>
                    {hasEvent && !isSelected && <div className="event-dot" />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 📋 Upcoming Events (가로 길이 통일 ㅋ) */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', letterSpacing: '0.5px' }}>Upcoming Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="full-width-box">
                <div className="event-card-wide">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '4px', height: '30px', background: event.id === 'ai-extract' ? '#f87171' : 'white', borderRadius: '2px' }} />
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>{event.title}</p>
                      <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>{event.time} • {event.year}.{event.month + 1}.{event.day}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ opacity: 0.3 }} />
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', opacity: 0.4 }}>
              <CalendarIcon size={28} style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '13px' }}>No events added yet.</p>
            </div>
          )}
        </div>
      </div>

      {isInputOpen && (
        <div className="input-box">
          <input 
            type="text" 
            placeholder={`Add event for ${selectedDate} ${months[viewMonth].toLowerCase()}...`}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', color: '#102543', fontSize: '14px' }}
          />
          <button onClick={handleDirectAdd} style={{ background: MAIN_COLOR, color: 'white', border: 'none', padding: '8px 18px', borderRadius: '12px', fontWeight: 'bold' }}>Add</button>
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
              <button onClick={() => setAiSuggestion({...aiSuggestion, show: false})} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', color: 'white', padding: '8px' }}><X size={18}/></button>
              <button onClick={acceptAiSuggestion} style={{ background: 'white', border: 'none', borderRadius: '10px', color: MAIN_COLOR, padding: '8px' }}><Check size={18}/></button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ 추가 버튼 (가로 길이 카드와 동일 ㅋ) */}
      {!isInputOpen && (
        <button 
          onClick={() => setIsInputOpen(true)}
          style={{ width: '100%', background: 'white', color: MAIN_COLOR, border: 'none', padding: '18px', borderRadius: '18px', fontWeight: '800', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
        >
          <Plus size={20} strokeWidth={3} /> Create Events
        </button>
      )}
    </div>
  );
}
