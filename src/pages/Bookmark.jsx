import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Bookmark() {
  const navigate = useNavigate();
  const MAIN_COLOR = '#3f4d8e';

  const [reports, setReports] = useState([]);
  const [terms, setTerms] = useState([]);
  const [chatReplies, setChatReplies] = useState([]);

  useEffect(() => {
    // 분석 리포트 확인 (전체 리포트와 세부 항목이 모두 섞여 있음)
    const savedReports = JSON.parse(localStorage.getItem('bookmarked_reports') || '[]');
    setReports(savedReports);

    // 특약 및 상담 답변
    const savedAllTerms = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    setTerms(savedAllTerms.filter(item => item.title !== 'AI 상담 답변'));
    setChatReplies(savedAllTerms.filter(item => item.title === 'AI 상담 답변'));
  }, []);

  const clearAllData = () => {
    if (window.confirm("모든 북마크 데이터를 초기화할까요?")) {
      localStorage.clear(); 
      setReports([]);
      setTerms([]);
      setChatReplies([]);
      alert("모두 삭제되었습니다!");
    }
  };

  const removeItem = (id, type) => {
    if (!window.confirm("북마크를 취소하시겠습니까?")) return;
    if (type === 'report') {
      const newList = reports.filter(item => item.id !== id);
      setReports(newList);
      localStorage.setItem('bookmarked_reports', JSON.stringify(newList));
    } else {
      const allTerms = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
      const newList = allTerms.filter(item => item.id !== id);
      localStorage.setItem('bookmarked_terms', JSON.stringify(newList));
      setTerms(newList.filter(item => item.title !== 'AI 상담 답변'));
      setChatReplies(newList.filter(item => item.title === 'AI 상담 답변'));
    }
  };

  return (
    <div style={{ padding: '20px 16px', backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '120px' }}>
      <style>{`
        .section-title { font-size: 16px; font-weight: 800; color: #475569; margin: 24px 0 12px; display: flex; align-items: center; gap: 8px; }
        .card { background: white; padding: 18px; border-radius: 20px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 10px; cursor: pointer; position: relative; margin-bottom: 12px; }
        .bookmark-btn { position: absolute; right: 14px; top: 14px; background: none; border: none; cursor: pointer; }
        .empty-box { font-size: 14px; color: #94a3b8; padding: 30px 10px; text-align: center; background: #F1F5F9; border-radius: 20px; border: 1.5px dashed #cbd5e1; font-weight: 500; }
        .reset-btn { font-size: 10px; color: #cbd5e1; background: none; border: none; cursor: pointer; float: right; margin-top: 5px; transition: 0.2s; }
        .reset-btn:hover { color: #3f4d8e; text-decoration: underline; }
      `}</style>

      <button className="reset-btn" onClick={clearAllData}>데이터 초기화</button>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', margin: '20px 0 8px 0' }}>북마크</h2>
      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>카테고리별로 저장된 내역을 확인하세요.</p>
      
      {/* 1. 분석 리포트 섹션 */}
      <div className="section-title"><span>📋</span> 분석 리포트</div>
      {reports.length > 0 ? reports.map((item) => (
        <div key={item.id} className="card" onClick={() => navigate('/caution-report')}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#334155' }}>{item.title}</div>
            
            {/* ✅ 수정 3: 전체 리포트면 날짜를 띄우고, 세부 분석 항목이면 내용을 띄웁니다 */}
            {item.date ? (
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{item.date} 분석 완료</div>
            ) : (
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', background: '#F8FAFC', padding: '12px', borderRadius: '14px', marginTop: '8px' }}>{item.desc}</div>
            )}
            
          </div>
          <button className="bookmark-btn" onClick={(e) => { e.stopPropagation(); removeItem(item.id, 'report'); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={MAIN_COLOR}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      )) : <div className="empty-box">저장된 분석 리포트가 없습니다.</div>}

      {/* 2. 나의 안심 특약 섹션 */}
      <div className="section-title"><span>📝</span> 나의 안심 특약</div>
      {terms.length > 0 ? terms.map((item) => (
        <div key={item.id} className="card">
          <div style={{ fontSize: '13px', fontWeight: '800', color: MAIN_COLOR, marginBottom: '4px' }}>[{item.title}]</div>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', background: '#F8FAFC', padding: '12px', borderRadius: '14px' }}>{item.desc}</div>
          <button className="bookmark-btn" onClick={() => removeItem(item.id, 'term')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={MAIN_COLOR}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      )) : <div className="empty-box">저장된 특약이 없습니다.</div>}

      {/* 3. AI 상담 답변 섹션 */}
      <div className="section-title"><span>💬</span> AI 상담 답변</div>
      {chatReplies.length > 0 ? chatReplies.map((item) => (
        <div key={item.id} className="card">
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', background: '#EEF2FF', padding: '12px', borderRadius: '14px' }}>{item.desc}</div>
          <button className="bookmark-btn" onClick={() => removeItem(item.id, 'term')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={MAIN_COLOR}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      )) : <div className="empty-box">저장된 상담 답변이 없습니다.</div>}
    </div>
  );
}