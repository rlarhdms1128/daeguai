import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // localStorage에서 분석 기록 불러오기
    const saved = JSON.parse(localStorage.getItem('analysis_history') || '[]');
    setHistory(saved);
  }, []);

  const statusConfig = {
    Green:  { label: '안전', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    Yellow: { label: '주의', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    Red:    { label: '위험', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    Error:  { label: '오류', color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
  };

  const handleItemClick = (item) => {
    // 해당 기록을 불러와서 리포트 페이지로 이동
    localStorage.setItem('ai_analysis_result', JSON.stringify(item.data));
    navigate('/caution-report');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('analysis_history', JSON.stringify(updated));
  };

  return (
    <div style={{
      width: '100%', backgroundColor: '#F0F0F7',
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#4B4F8F',
        padding: '20px 20px 20px',
        borderRadius: '0 0 28px 28px',
        color: 'white', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div onClick={() => navigate(-1)} style={{
            cursor: 'pointer', fontWeight: 700, fontSize: 14,
            background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 20,
          }}>←</div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>내 서류 분석 기록</span>
        </div>


      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '20px 16px 24px', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
            전체 {history.length}건
          </h3>
        </div>

        {history.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 18, padding: 48,
            textAlign: 'center', border: '1.5px solid #EDEDF8',
            boxShadow: '0 2px 8px rgba(75,79,143,0.06)',
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 14, opacity: 0.25 }}>
              <rect x="8" y="4" width="28" height="36" rx="3" stroke="#4B4F8F" strokeWidth="2.5"/>
              <path d="M16 16h16M16 22h16M16 28h10" stroke="#4B4F8F" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: '#1E1B4B' }}>분석 기록이 없어요</p>
            <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>서류를 업로드하면 여기에 기록돼요</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map((item) => {
              const status = statusConfig[item.data?.status] || statusConfig.Error;
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    background: 'white', borderRadius: 18,
                    padding: '16px 18px',
                    border: '1.5px solid #EDEDF8',
                    boxShadow: '0 2px 8px rgba(75,79,143,0.06)',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                  }}
                >
                  {/* 아이콘 */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: '#F0F0F7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="3" y="1" width="14" height="18" rx="2" stroke="#4B4F8F" strokeWidth="1.7"/>
                      <path d="M7 7h8M7 10.5h8M7 14h5" stroke="#4B4F8F" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </div>

                  {/* 텍스트 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
                        {item.title || '분석 리포트'}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        background: status.bg, color: status.color,
                        padding: '2px 8px', borderRadius: 20, flexShrink: 0,
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                      {item.date}
                    </span>
                  </div>

                  {/* 삭제 + 화살표 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={e => handleDelete(e, item.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                        color: '#D1D5DB', fontSize: 16, lineHeight: 1,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V2.5A.5.5 0 0 1 5.5 2h5a.5.5 0 0 1 .5.5V4M6 7v5M10 7v5M3 4l.8 9.2A1 1 0 0 0 4.8 14h6.4a1 1 0 0 0 1-.8L13 4" stroke="#D1D5DB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="#C4C4D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
