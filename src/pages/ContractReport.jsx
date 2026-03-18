import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ContractReport() {
  const navigate = useNavigate();
  
  // ✅ 1. 시연을 위해 상태를 무조건 빈 객체({})로 시작합니다.
  const [bookmarkedIds, setBookmarkedIds] = useState({});

  // ✅ 2. 기존 데이터를 불러오는 로직을 시연용으로 비워두었습니다.
  // 이 페이지를 열 때는 항상 '북마크 안 된 상태'로 보이게 됩니다.
  useEffect(() => {
    // 시연 중 새로고침해도 깨끗한 상태를 유지하고 싶다면 이 안을 비워두면 됩니다.
    setBookmarkedIds({}); 
  }, []);

  const toggleBookmark = (title, desc) => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    let newList;

    if (bookmarkedIds[title]) {
      // 해제 로직
      newList = currentList.filter(item => item.title !== title);
      alert('특약 북마크가 해제되었습니다.');
    } else {
      // 저장 로직
      const newTerm = {
        id: Date.now(),
        title: title,
        desc: desc
      };
      newList = [...currentList, newTerm];
      alert('나의 특약에 저장되었습니다! 북마크 페이지에서 확인하세요.');
    }

    localStorage.setItem('bookmarked_terms', JSON.stringify(newList));
    setBookmarkedIds(prev => ({ ...prev, [title] : !prev[title] }));
  };

  return (
    <>
      <style>{`
        *{ box-sizing:border-box; }
        body{ margin:0; font-family: Arial, sans-serif; background:#eef1f7; }
        .container{ width:100%; max-width:430px; margin:0 auto; background:#eef1f7; min-height:100vh; padding-bottom:24px; }
        .topSection{ background:linear-gradient(180deg,#3f4d8e 0%, #3f4d8e 100%); padding:50px 20px 25px; color:white; border-bottom-left-radius:30px; border-bottom-right-radius:30px; }
        .header{ display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .backBtn{ width:32px; height:32px; border:none; border-radius:10px; background:rgba(255,255,255,0.16); color:white; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .header h2{ margin:0; font-size:20px; font-weight:800; }
        .addressCard{ width:100%; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(10px); border-radius:18px; padding:18px; }
        .addrTag{ margin:0 0 8px 0; font-size:11px; color:rgba(255,255,255,0.7); font-weight:600; }
        .addressCard h3{ margin:0 0 12px 0; font-size:16px; font-weight:800; color:white; }
        .warnRow{ display:flex; align-items:center; gap:8px; }
        .warnDot{ width:6px; height:6px; border-radius:50%; background:#ffbf1a; }
        .warnText{ margin:0; color:#ffd35e; font-size:12px; font-weight:600; }
        .section{ background:white; padding:24px 20px; border-radius:30px; margin: -15px 10px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .sectionHeader{ display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
        .sectionHeader h3{ margin:0; font-size:16px; color:#24244d; font-weight:800; }
        .pdfBtn{ border:none; background:transparent; color:#7167ff; font-size:12px; font-weight:700; cursor:pointer; }
        .specialCard{ background:#f8faff; border:1.5px solid #eef0ff; border-radius:20px; padding:18px; margin-bottom:15px; position: relative; }
        .cardTop{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-right: 30px; }
        .cardTitleWrap{ display:flex; align-items:center; gap:10px; }
        .smallNumber{ width:28px; height:28px; border-radius:8px; background:#eef0ff; color:#3f4d8e; font-size:15px; font-weight:800; display:flex; align-items:center; justify-content:center; }
        .cardTitleWrap h4{ margin:0; font-size:14px; color:#24244d; font-weight:800; }
        .badge{ padding:6px 10px; border-radius:8px; font-size:11px; font-weight:800; }
        .warning{ background:#ffe4a1; color:#db8b00; }
        .success{ background:#d7f2da; color:#33a856; }
        .quoteBox{ background:white; border-radius:12px; padding:15px; margin-bottom:10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .quoteBox.purple{ border-left:4px solid #3f4d8e; }
        .quoteBox.green{ border-left:4px solid #1ec25a; }
        .quoteBox p{ margin:0; font-size:13px; line-height:1.6; color:#475569; font-weight:500; }
        .lawText{ margin:0; font-size:11px; color:#3f4d8e; text-decoration:underline; }
        .saveBtn{ width:calc(100% - 40px); margin:20px auto; display:block; border:none; border-radius:18px; background:#3f4d8e; color:white; font-size:16px; font-weight:800; padding:18px; cursor:pointer; box-shadow: 0 4px 15px rgba(81, 70, 239, 0.3); }

        .bookmarkBtn {
          position: absolute; right: 15px; top: 18px;
          background: none; border: none; cursor: pointer;
          padding: 5px; transition: transform 0.2s;
        }
        .bookmarkBtn:active { transform: scale(1.2); }
      `}</style>

      <div className="container">
        <div className="topSection">
          <div className="header">
            <button className="backBtn" onClick={() => navigate(-1)}>←</button>
            <h2>AI 특약 자동 생성</h2>
          </div>
          <div className="addressCard">
            <p className="addrTag">분석된 주소지 정보</p>
            <h3>서울시 마포구 합정동 123-4</h3>
            <div className="warnRow">
              <span className="warnDot"></span>
              <p className="warnText">주의 항목 2개 발견 — 맞춤 특약 생성</p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sectionHeader">
            <h3>📝 안심 특약 리스트</h3>
            <button className="pdfBtn">PDF 전체 저장</button>
          </div>

          {/* 특약 리스트 아이템들 */}
          {[
            { id: 1, title: "근저당 말소 조건부 특약", badge: "주의 대응", type: "purple", law: "민법 제357조", desc: "임대인은 잔금 지급일 이전까지 이 건물에 설정된 근저당권 전액을 말소하여야 하며..." },
            { id: 2, title: "용도 변경 확인 특약", badge: "주의 대응", type: "purple", law: "건축법 시행령", desc: "임대인은 본 임대차 목적물이 주거 목적으로 사용함에 있어 법적 하자가 없음을 보증하며..." },
            { id: 3, title: "확정일자 취득 협조 특약", badge: "기본 권장", type: "green", law: "주택임대차보호법 제3조의2", desc: "임차인은 입주일 당일 확정일자를 취득하며, 임대인은 이에 필요한 정보 제공에 적극 협조한다." }
          ].map((item) => (
            <div className="specialCard" key={item.id}>
              <button className="bookmarkBtn" onClick={() => toggleBookmark(item.title, item.desc)}>
                <svg width="22" height="22" viewBox="0 0 24 24" 
                     fill={bookmarkedIds[item.title] ? "#3f4d8e" : "none"} 
                     stroke={bookmarkedIds[item.title] ? "#3f4d8e" : "#cbd5e1"} 
                     strokeWidth="2.5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
              <div className="cardTop">
                <div className="cardTitleWrap">
                  <div className="smallNumber">{item.id}</div>
                  <h4>{item.title}</h4>
                </div>
                <div className={`badge ${item.type === 'purple' ? 'warning' : 'success'}`}>{item.badge}</div>
              </div>
              <div className={`quoteBox ${item.type}`}>
                <p>"{item.desc}"</p>
              </div>
              <p className="lawText">📜 {item.law} 관련</p>
            </div>
          ))}
        </div>

        <button className="saveBtn" onClick={() => alert('PDF 저장 기능 준비 중입니다.')}>
          📄 전체 특약 리포트 PDF 저장
        </button>
      </div>
    </>
  );
}

export default ContractReport;