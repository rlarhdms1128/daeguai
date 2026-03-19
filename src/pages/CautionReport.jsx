import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, MessageCircle, Calendar,
  BookOpen, Search, Wrench, CheckCircle, XOctagon
} from 'lucide-react';

const CautionReport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [reportData, setReportData] = useState({
    status: 'Green', score: 100, summary: '데이터를 불러오는 중입니다...', details: [], advice: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('ai_analysis_result');
    if (savedData) setReportData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    setIsBookmarked(savedReports.some(item => item.title === 'AI 분석 리포트'));
    const itemMap = {};
    savedReports.forEach(item => { if (item.title !== 'AI 분석 리포트') itemMap[item.title] = true; });
    setBookmarkedItems(itemMap);
  }, []);

  const themeConfig = {
    Green:  { color: '#10b981', text: '안전해요',        icon: <CheckCircle size={18} /> },
    Yellow: { color: '#f59e0b', text: '주의가 필요해요',  icon: <AlertTriangle size={18} /> },
    Red:    { color: '#ef4444', text: '위험해요!',        icon: <XOctagon size={18} /> },
    Error:  { color: '#4B4F8F', text: '분석 오류',        icon: <AlertTriangle size={18} /> },
  };
  const currentTheme = themeConfig[reportData.status] || themeConfig.Green;
  const MAIN_COLOR = currentTheme.color;

  const toggleMainBookmark = () => {
    const list = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    let newList;
    if (isBookmarked) {
      newList = list.filter(i => i.title !== 'AI 분석 리포트');
      alert('리포트 북마크가 해제되었습니다.');
    } else {
      newList = [...list, { id: Date.now(), title: 'AI 분석 리포트', date: new Date().toLocaleDateString(), status: reportData.status }];
      alert('리포트가 북마크에 저장되었습니다!');
    }
    localStorage.setItem('bookmarked_reports', JSON.stringify(newList));
    setIsBookmarked(!isBookmarked);
  };

  const toggleItemBookmark = (title, desc) => {
    const list = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    let newList;
    if (bookmarkedItems[title]) {
      newList = list.filter(i => i.title !== title);
      alert(`${title} 북마크가 해제되었습니다.`);
    } else {
      newList = [...list, { id: Date.now(), title, desc }];
      alert(`${title} 항목이 북마크에 저장되었습니다!`);
    }
    localStorage.setItem('bookmarked_reports', JSON.stringify(newList));
    setBookmarkedItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const BookmarkSvg = ({ isActive, onClick }) => (
    <button
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      onClick={e => { e.preventDefault(); e.stopPropagation(); onClick(); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', position: 'relative', zIndex: 50 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24"
        fill={isActive ? '#4B4F8F' : 'none'}
        stroke={isActive ? '#4B4F8F' : '#cbd5e1'} strokeWidth="2.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );

  const riskStyle = (risk) => ({
    fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 700,
    background: risk === 'High' ? 'rgba(248,113,113,0.15)' : risk === 'Medium' ? 'rgba(251,191,36,0.15)' : 'rgba(16,185,129,0.15)',
    color: risk === 'High' ? '#F87171' : risk === 'Medium' ? '#FBBF24' : '#10b981',
  });

  const cardStyle = {
    background: 'white', padding: '18px 20px', borderRadius: '16px',
    border: '1.5px solid #EDEDF8', position: 'relative',
    boxShadow: '0 2px 8px rgba(75,79,143,0.06)',
  };

  const steps = [
    {
      title: 'Step 1. 상세 분석 및 용어', icon: <Search size={15} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reportData.details?.map((item, idx) => (
            <div key={idx} style={cardStyle}>
              <div style={{ position: 'absolute', right: 12, top: 12 }}>
                <BookmarkSvg isActive={bookmarkedItems[item.title]} onClick={() => toggleItemBookmark(item.title, item.desc)} />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: 14, margin: '0 0 8px', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.title}
                <span style={riskStyle(item.risk)}>{item.risk}</span>
              </h4>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: 0, paddingRight: 20 }}>{item.desc}</p>
            </div>
          ))}
          {(!reportData.details || reportData.details.length === 0) && (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>상세 분석 항목이 없습니다.</p>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Step 2. AI 종합 요약', icon: <BookOpen size={15} />,
      content: (
        <div style={cardStyle}>
          <div style={{ position: 'absolute', right: 12, top: 12 }}>
            <BookmarkSvg isActive={bookmarkedItems['AI 종합 요약']} onClick={() => toggleItemBookmark('AI 종합 요약', reportData.summary)} />
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.85, margin: 0, paddingRight: 20, color: '#374151' }}>{reportData.summary}</p>
        </div>
      )
    },
    {
      title: 'Step 3. AI 맞춤 대응', icon: <Wrench size={15} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={cardStyle}>
            <div style={{ position: 'absolute', right: 12, top: 12 }}>
              <BookmarkSvg isActive={bookmarkedItems['AI 맞춤 대응 가이드']} onClick={() => toggleItemBookmark('AI 맞춤 대응 가이드', reportData.advice)} />
            </div>
            <h4 style={{ fontWeight: 800, color: '#4B4F8F', fontSize: 13, margin: '0 0 10px' }}>💡 현실적인 조언</h4>
            <p style={{ fontWeight: 600, fontSize: 14, margin: 0, paddingRight: 24, lineHeight: 1.7, color: '#1E1B4B' }}>"{reportData.advice}"</p>
          </div>
          <button onClick={() => navigate('/contract-report')} style={{
            width: '100%', background: '#4B4F8F', color: 'white',
            padding: 16, borderRadius: 16, border: 'none',
            fontWeight: 800, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(75,79,143,0.3)',
          }}>
            ✍️ AI 안심 특약 자동 생성
          </button>
        </div>
      )
    }
  ];

  const handleMouseDown = e => { setIsDragging(true); setStartX(e.pageX - carouselRef.current.offsetLeft); setScrollLeft(carouselRef.current.scrollLeft); };
  const handleMouseMove = e => { if (!isDragging) return; e.preventDefault(); carouselRef.current.scrollLeft = scrollLeft - (e.pageX - carouselRef.current.offsetLeft - startX) * 2; };
  const handleMouseUpOrLeave = () => { if (!isDragging) return; setIsDragging(false); const i = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth); setCurrentStep(i); carouselRef.current.scrollTo({ left: i * carouselRef.current.offsetWidth, behavior: 'smooth' }); };
  const goToStep = i => { setCurrentStep(i); carouselRef.current.scrollTo({ left: i * carouselRef.current.offsetWidth, behavior: 'smooth' }); };

  const categoryCards = [
    {
      label: '종합평가', dotColor: MAIN_COLOR,
      status: reportData.status === 'Green' ? '안전' : '주의',
      svg: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect x="2" y="6" width="22" height="15" rx="3" stroke="#4B4F8F" strokeWidth="1.7"/>
          <circle cx="13" cy="13.5" r="4" stroke="#4B4F8F" strokeWidth="1.7"/>
          <circle cx="13" cy="13.5" r="1.4" fill="#4B4F8F"/>
          <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h5A1.5 1.5 0 0 1 17 4.5V6" stroke="#4B4F8F" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: '소유권', dotColor: '#F59E0B', status: '확인',
      svg: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M13 3L3 9.5V23h20V9.5L13 3Z" stroke="#4B4F8F" strokeWidth="1.7" strokeLinejoin="round"/>
          <rect x="9.5" y="16" width="7" height="7" rx="1" stroke="#4B4F8F" strokeWidth="1.7"/>
          <path d="M10.5 11.5h5" stroke="#4B4F8F" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: '채무', dotColor: '#F59E0B', status: '확인',
      svg: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <line x1="13" y1="4" x2="13" y2="22" stroke="#4B4F8F" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="9" y1="22" x2="17" y2="22" stroke="#4B4F8F" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="5" y1="8" x2="21" y2="8" stroke="#4B4F8F" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="6" y1="8" x2="4" y2="14" stroke="#4B4F8F" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="6" y1="8" x2="8" y2="14" stroke="#4B4F8F" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M3.5 14h5a2.5 2.5 0 0 1-5 0Z" stroke="#4B4F8F" strokeWidth="1.4" strokeLinejoin="round"/>
          <line x1="20" y1="8" x2="18" y2="14" stroke="#4B4F8F" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="20" y1="8" x2="22" y2="14" stroke="#4B4F8F" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M17.5 14h5a2.5 2.5 0 0 1-5 0Z" stroke="#4B4F8F" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      label: '특약필요', dotColor: '#A78BFA',
      status: reportData.status === 'Red' ? '필수' : '권장',
      svg: (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <rect x="5" y="2" width="14" height="19" rx="2" stroke="#4B4F8F" strokeWidth="1.7"/>
          <path d="M9 8h6M9 12h6M9 16h3" stroke="#4B4F8F" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="19.5" cy="19.5" r="4" fill="white" stroke="#4B4F8F" strokeWidth="1.5"/>
          <path d="M17.8 19.5l1.2 1.2 2-2" stroke="#4B4F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  return (
    <div style={{
        width: '100%', backgroundColor: '#F0F0F7',
        display: 'flex', flexDirection: 'column', minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: '#4B4F8F',
          padding: '20px 20px 20px',
          borderRadius: '0 0 28px 28px',
          color: 'white', flexShrink: 0,
        }}>
          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div onClick={() => navigate(-1)} style={{
              cursor: 'pointer', fontWeight: 700, fontSize: 14,
              background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 20,
            }}>← Back</div>
            <button onClick={e => { e.stopPropagation(); toggleMainBookmark(); }} style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12,
              width: 40, height: 40, cursor: 'pointer', zIndex: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24"
                fill={isBookmarked ? 'white' : 'none'} stroke="white" strokeWidth="2.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          {/* 신호등 + 상태 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              background: 'rgba(0,0,0,0.25)', borderRadius: 50,
              padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
            }}>
              {[
                { key: 'Red',    color: '#EF4444' },
                { key: 'Yellow', color: '#FBBF24' },
                { key: 'Green',  color: '#10B981' },
              ].map(({ key, color }) => (
                <div key={key} style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: reportData.status === key ? color : 'rgba(255,255,255,0.12)',
                  boxShadow: reportData.status === key ? `0 0 12px 3px ${color}99` : 'none',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.18)', borderRadius: 12,
              padding: '10px 16px', fontSize: 16, fontWeight: 800,
            }}>
              {currentTheme.icon} {currentTheme.text}
            </span>
          </div>

          {/* Category Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {categoryCards.map((item, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 16, padding: '14px 6px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
              }}>
                {item.svg}
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1E1B4B' }}>{item.label}</span>
                <div style={{
                  width: '100%', borderTop: '1px solid #F3F4F6', paddingTop: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.dotColor, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: item.dotColor }}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>

          {/* Step Tabs */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {steps.map((step, i) => (
              <button key={i} onClick={() => goToStep(i)} style={{
                flex: 1, padding: '10px 4px', border: 'none', borderRadius: 12,
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: currentStep === i ? '#4B4F8F' : 'white',
                color: currentStep === i ? 'white' : '#9CA3AF',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}>
                <span style={{ opacity: currentStep === i ? 1 : 0.5 }}>{step.icon}</span>
                Step {i + 1}
              </button>
            ))}
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{ overflowX: 'hidden', display: 'flex', flex: 1, cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {steps.map((step, index) => (
              <div key={index} style={{ minWidth: '100%', boxSizing: 'border-box', paddingBottom: 24 }}>
                <h3 style={{
                  fontSize: 15, fontWeight: 800,
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 12, marginTop: 0, color: '#1E1B4B',
                }}>
                  <span style={{
                    width: 26, height: 26, background: '#4B4F8F', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0,
                  }}>{step.icon}</span>
                  {step.title}
                </h3>
                {step.content}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{
          display: 'flex', height: 68,
          borderTop: '1px solid #EDEDF8',
          backgroundColor: 'white', flexShrink: 0,
        }}>
          <button onClick={() => navigate('/chat')} style={{
            flex: 1, background: '#4B4F8F', color: 'white', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}>
            <MessageCircle size={20} fill="white" />
            <span style={{ fontSize: 11, fontWeight: 700 }}>AI 챗봇 상담</span>
          </button>
          <button onClick={() => navigate('/calendar')} style={{
            flex: 1, backgroundColor: 'white', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}>
            <Calendar size={20} color="#4B4F8F" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4B4F8F' }}>캘린더 기록</span>
          </button>
        </div>

      </div>
  );
};

export default CautionReport;
