import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  MessageCircle,
  Calendar,
  BookOpen,
  Search,
  Wrench,
  CheckCircle,
  XOctagon
} from 'lucide-react';

const CautionReport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState({});

  // 1. LocalStorage에서 AI 분석 결과 불러오기
  const [reportData, setReportData] = useState({
    status: "Green", score: 100, summary: "데이터를 불러오는 중입니다...", details: [], advice: ""
  });

  useEffect(() => {
    const savedData = localStorage.getItem('ai_analysis_result');
    if (savedData) {
      setReportData(JSON.parse(savedData));
    }
  }, []);

  // 2. 신호등 상태에 따른 테마 설정 (색상, 텍스트, 아이콘)
  const themeConfig = {
    Green: { color: '#10b981', text: '안전해요', icon: <CheckCircle size={24} />, bgBorder: '#d1fae5' },
    Yellow: { color: '#f59e0b', text: '주의가 필요해요', icon: <AlertTriangle size={24} />, bgBorder: '#fef3c7' },
    Red: { color: '#ef4444', text: '위험해요!', icon: <XOctagon size={24} />, bgBorder: '#fee2e2' },
    Error: { color: '#3f4d8e', text: '분석 오류', icon: <AlertTriangle size={24} />, bgBorder: '#e0e7ff' }
  };

  const currentTheme = themeConfig[reportData.status] || themeConfig.Green;
  const MAIN_COLOR = currentTheme.color;

  // 북마크 로직 (기존과 동일)
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    setIsBookmarked(savedReports.some(item => item.title === 'AI 분석 리포트'));

    const savedTerms = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    const termMap = {};
    savedTerms.forEach(item => { termMap[item.title] = true; });
    setBookmarkedItems(termMap);
  }, []);

  const toggleMainBookmark = () => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    let newList;
    if (isBookmarked) {
      newList = currentList.filter(item => item.title !== 'AI 분석 리포트');
      alert('리포트 북마크가 해제되었습니다.');
    } else {
      newList = [...currentList, { id: Date.now(), title: 'AI 분석 리포트', date: new Date().toLocaleDateString(), status: reportData.status }];
      alert('리포트가 북마크에 저장되었습니다!');
    }
    localStorage.setItem('bookmarked_reports', JSON.stringify(newList));
    setIsBookmarked(!isBookmarked);
  };

  const toggleItemBookmark = (title, desc) => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    let newList;
    if (bookmarkedItems[title]) {
      newList = currentList.filter(item => item.title !== title);
      alert(`${title} 북마크가 해제되었습니다.`);
    } else {
      newList = [...currentList, { id: Date.now(), title, desc }];
      alert(`${title} 항목이 북마크에 저장되었습니다!`);
    }
    localStorage.setItem('bookmarked_terms', JSON.stringify(newList));
    setBookmarkedItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const BookmarkSvg = ({ isActive, onClick }) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isActive ? MAIN_COLOR : "none"} stroke={isActive ? MAIN_COLOR : "#cbd5e1"} strokeWidth="2.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );

  // 3. AI 데이터를 기존 3-Step UI에 맞춰 재구성
  const steps = [
    {
      title: "Step 1. 상세 분석 및 용어",
      icon: <Search size={18} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reportData.details?.map((item, idx) => (
            <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '15px', border: `1px solid ${currentTheme.bgBorder}`, position: 'relative' }}>
              <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                <BookmarkSvg isActive={bookmarkedItems[item.title]} onClick={() => toggleItemBookmark(item.title, item.desc)} />
              </div>
              <h4 style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 8px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.title}
                <span style={{
                  fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                  background: item.risk === 'High' ? '#fee2e2' : item.risk === 'Medium' ? '#fef3c7' : '#d1fae5',
                  color: item.risk === 'High' ? '#ef4444' : item.risk === 'Medium' ? '#f59e0b' : '#10b981'
                }}>
                  {item.risk}
                </span>
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0, paddingRight: '20px' }}>{item.desc}</p>
            </div>
          ))}
          {(!reportData.details || reportData.details.length === 0) && (
            <p style={{ fontSize: '13px', color: '#64748b' }}>상세 분석 항목이 없습니다.</p>
          )}
        </div>
      )
    },
    {
      title: "Step 2. AI 종합 요약",
      icon: <BookOpen size={18} />,
      content: (
        <div style={{ background: 'white', padding: '24px', borderRadius: '15px', border: `1px solid ${currentTheme.bgBorder}`, position: 'relative' }}>
          <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
            <BookmarkSvg
              isActive={bookmarkedItems["AI 종합 요약"]}
              onClick={() => toggleItemBookmark("AI 종합 요약", reportData.summary)}
            />
          </div>
          <p style={{ fontSize: '15px', lineHeight: '1.8', margin: 0, paddingRight: '20px' }}>
            {reportData.summary}
          </p>
        </div>
      )
    },
    {
      title: "Step 3. AI 맞춤 대응",
      icon: <Wrench size={18} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: `1px solid ${currentTheme.bgBorder}`, position: 'relative' }}>
            <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
              <BookmarkSvg
                isActive={bookmarkedItems["AI 맞춤 대응 가이드"]}
                onClick={() => toggleItemBookmark("AI 맞춤 대응 가이드", reportData.advice)}
              />
            </div>
            <h4 style={{ fontWeight: 'bold', color: MAIN_COLOR, fontSize: '14px', margin: '0 0 8px 0' }}>💡 현실적인 조언</h4>
            <p style={{ fontWeight: 'bold', fontSize: '15px', margin: 0, paddingRight: '24px', lineHeight: '1.5' }}>
              "{reportData.advice}"
            </p>
          </div>

          <button onClick={() => navigate('/contract-report')} style={{ width: '100%', background: '#3f4d8e', color: 'white', padding: '16px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(63, 77, 142, 0.2)' }}>
            ✍️ AI 안심 특약 자동 생성
          </button>
        </div>
      )
    }
  ];

  // 드래그 로직 (기존 동일)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const handleMouseDown = (e) => { setIsDragging(true); setStartX(e.pageX - carouselRef.current.offsetLeft); setScrollLeft(carouselRef.current.scrollLeft); };
  const handleMouseMove = (e) => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - carouselRef.current.offsetLeft; const walk = (x - startX) * 2; carouselRef.current.scrollLeft = scrollLeft - walk; };
  const handleMouseUpOrLeave = () => { if (!isDragging) return; setIsDragging(false); const index = Math.round(carouselRef.current.scrollLeft / carouselRef.current.offsetWidth); setCurrentStep(index); carouselRef.current.scrollTo({ left: index * carouselRef.current.offsetWidth, behavior: 'smooth' }); };
  const goToStep = (i) => { setCurrentStep(i); carouselRef.current.scrollTo({ left: i * carouselRef.current.offsetWidth, behavior: 'smooth' }); };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#e5e7eb', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '430px', backgroundColor: '#F8F9FB', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

        {/* 상단 Header (AI 데이터 연동) */}
        <div style={{ backgroundColor: MAIN_COLOR, padding: '56px 24px 80px 24px', borderRadius: '0 0 40px 40px', color: 'white', position: 'relative', flexShrink: 0, transition: 'background-color 0.5s ease' }}>
          <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>← Back</div>
            <button onClick={toggleMainBookmark} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "white" : "none"} stroke="white" strokeWidth="2.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px', fontWeight: 'bold' }}>AI 안전 점수: {reportData.score}점</p>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentTheme.text} {currentTheme.icon}
          </h2>
        </div>

        {/* 4가지 핵심 요약 (시각적 일관성을 위해 유지) */}
        <div style={{ padding: '0 20px', marginTop: '-48px', zIndex: 10, flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { label: '종합평가', icon: '🤖', status: reportData.status === 'Green' ? '안전' : '주의', color: MAIN_COLOR },
              { label: '소유권', icon: '🏠', status: '확인', color: '#64748b' },
              { label: '채무', icon: '⚖️', status: '확인', color: '#64748b' },
              { label: '특약필요', icon: '📋', status: reportData.status === 'Red' ? '필수' : '권장', color: '#64748b' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', padding: '12px 4px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `1px solid ${currentTheme.bgBorder}` }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', marginTop: '4px' }}>{item.label}</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: item.color }}>● {item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 캐러셀 영역 */}
        <div style={{ marginTop: '32px', backgroundColor: 'white', borderRadius: '40px 40px 0 0', flex: 1, padding: '16px 0', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', padding: '0 24px', marginBottom: '32px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} onClick={() => goToStep(i)} style={{ flex: 1, height: '6px', borderRadius: '3px', cursor: 'pointer', backgroundColor: currentStep === i ? MAIN_COLOR : '#e2e8f0', transition: '0.3s' }}></div>
            ))}
          </div>
          <div ref={carouselRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} style={{ overflowX: 'hidden', display: 'flex', flex: 1, cursor: isDragging ? 'grabbing' : 'grab' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ minWidth: '100%', padding: '0 24px', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ color: MAIN_COLOR }}>{step.icon}</span> {step.title}
                </h3>
                {step.content}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 탭 버튼 */}
        <div style={{ display: 'flex', height: '80px', borderTop: '1px solid #f1f5f9', backgroundColor: 'white', flexShrink: 0 }}>
          <button onClick={() => navigate('/chat')} style={{ flex: 1, backgroundColor: '#3f4d8e', color: 'white', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
            <MessageCircle size={22} fill="white" />
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>AI 챗봇 상담</span>
          </button>
          <button onClick={() => navigate('/calendar')} style={{ flex: 1, backgroundColor: 'white', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
            <Calendar size={22} color="#94a3b8" />
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155' }}>캘린더 기록</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CautionReport;