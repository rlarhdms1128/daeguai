import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Search, 
  Wrench
} from 'lucide-react';

const CautionReport = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState({}); // 개별 카드 북마크 상태

  const MAIN_COLOR = '#3f4d8e';

  // ✅ 로드 시 로컬스토리지와 상태 동기화
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    setIsBookmarked(savedReports.some(item => item.title === '마포구 합정동 123-4 / 302호'));

    const savedTerms = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    const termMap = {};
    savedTerms.forEach(item => { termMap[item.title] = true; });
    setBookmarkedItems(termMap);
  }, []);

  // ✅ 전체 리포트 북마크 토글
  const toggleMainBookmark = () => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    let newList;
    if (isBookmarked) {
      newList = currentList.filter(item => item.title !== '마포구 합정동 123-4 / 302호');
      alert('리포트 북마크가 해제되었습니다.');
    } else {
      newList = [...currentList, { id: Date.now(), title: '마포구 합정동 123-4 / 302호', date: new Date().toLocaleDateString(), status: '주의' }];
      alert('리포트가 북마크에 저장되었습니다!');
    }
    localStorage.setItem('bookmarked_reports', JSON.stringify(newList));
    setIsBookmarked(!isBookmarked);
  };

  // ✅ 개별 카드 북마크 토글 (Step 1, 2, 3 공용)
  const toggleItemBookmark = (title, desc) => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    let newList;
    
    if (bookmarkedItems[title]) {
      // 이미 북마크 된 경우 -> 삭제
      newList = currentList.filter(item => item.title !== title);
      alert(`${title} 북마크가 해제되었습니다.`);
    } else {
      // 북마크 안 된 경우 -> 추가
      newList = [...currentList, { id: Date.now(), title, desc }];
      alert(`${title} 항목이 북마크에 저장되었습니다!`);
    }
    
    localStorage.setItem('bookmarked_terms', JSON.stringify(newList));
    // 🔥 중요: 상태를 즉시 업데이트하여 아이콘 색상을 변경합니다.
    setBookmarkedItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // ✅ 북마크 아이콘 컴포넌트 (isActive 값에 따라 색상 변경)
  const BookmarkSvg = ({ isActive, onClick }) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isActive ? MAIN_COLOR : "none"} stroke={isActive ? MAIN_COLOR : "#cbd5e1"} strokeWidth="2.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );

  const steps = [
    {
      title: "Step 1. 관련 용어",
      icon: <BookOpen size={18} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { title: "근저당권", desc: "집주인이 집을 담보로 대출을 받았음을 의미합니다." },
            { title: "대항력", desc: "낙찰 후에도 보증금을 돌려받을 권리를 말합니다." }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f1f5f9', position: 'relative' }}>
              <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                <BookmarkSvg isActive={bookmarkedItems[item.title]} onClick={() => toggleItemBookmark(item.title, item.desc)} />
              </div>
              <h4 style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 8px 0', color: '#1e293b' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Step 2. 분석 항목",
      icon: <Search size={18} />,
      content: (
        <div style={{ background: 'white', padding: '24px', borderRadius: '15px', border: '1px solid #fde68a', position: 'relative' }}>
          <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
            <BookmarkSvg 
              isActive={bookmarkedItems["융자 비율 분석"]} 
              onClick={() => toggleItemBookmark("융자 비율 분석", "현재 건물에 시세 대비 62%의 융자가 설정되어 있습니다. 안전 기준(60%)을 초과하므로 주의가 필요합니다.")} 
            />
          </div>
          <p style={{ fontSize: '15px', lineHeight: '1.8', margin: 0, paddingRight: '20px' }}>
            현재 건물에 <span style={{ fontWeight: 'bold' }}>시세 대비 62%의 융자</span>가 설정되어 있습니다. 안전 기준(60%)을 초과하므로 주의가 필요합니다.
          </p>
        </div>
      )
    },
    {
      title: "Step 3. 대응 방법",
      icon: <Wrench size={18} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #fef3c7', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
              <BookmarkSvg 
                isActive={bookmarkedItems["대응 1. 특약 삽입"]} 
                onClick={() => toggleItemBookmark("대응 1. 특약 삽입", "잔금 지급 시 대출금 상환 및 말소 조건을 넣으세요.")} 
              />
            </div>
            <h4 style={{ fontWeight: 'bold', color: '#d97706', fontSize: '14px', margin: '0 0 8px 0' }}>대응 1. 특약 삽입</h4>
            <p style={{ fontWeight: 'bold', fontSize: '16px', margin: 0, paddingRight: '24px' }}>"잔금 지급 시 대출금 상환 및 말소" 조건을 넣으세요.</p>
          </div>
          
          <button onClick={() => navigate('/contract-report')} style={{ width: '100%', background: MAIN_COLOR, color: 'white', padding: '16px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(63, 77, 142, 0.2)' }}>
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
        
        {/* Header */}
        <div style={{ backgroundColor: MAIN_COLOR, padding: '56px 24px 80px 24px', borderRadius: '0 0 40px 40px', color: 'white', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>← Back</div>
            <button onClick={toggleMainBookmark} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "white" : "none"} stroke="white" strokeWidth="2.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.6, marginBottom: '4px' }}>마포구 합정동 123-4 / 302호</p>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            주의가 필요해요 <AlertTriangle size={24} />
          </h2>
        </div>

        {/* Icons Grid */}
        <div style={{ padding: '0 20px', marginTop: '-48px', zIndex: 10, flexShrink: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { label: '소유권', icon: '🏠', status: '안전', color: '#34C759' },
              { label: '채무', icon: '⚖️', status: '주의', color: '#FF9500' },
              { label: '건물', icon: '🏢', status: '주의', color: '#FF9500' },
              { label: '세금', icon: '📋', status: '안전', color: '#34C759' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', padding: '12px 4px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: item.status === '주의' ? '1px solid #ffe8a3' : '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155', marginTop: '4px' }}>{item.label}</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: item.color }}>● {item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Area */}
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
                  <span style={{ color: '#64748b' }}>{step.icon}</span> {step.title}
                </h3>
                {step.content}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', height: '80px', borderTop: '1px solid #f1f5f9', backgroundColor: 'white', flexShrink: 0 }}>
          <button onClick={() => navigate('/chat')} style={{ flex: 1, backgroundColor: MAIN_COLOR, color: 'white', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
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