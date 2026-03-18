import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 제미나이 초기 세팅
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

function ContractReport() {
  const navigate = useNavigate();
  const [bookmarkedIds, setBookmarkedIds] = useState({});
  const [clauses, setClauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookmarkedIds({});
    generateClauses();
  }, []);

  const generateClauses = async () => {
    try {
      // 1. 저장된 부동산 분석 결과 불러오기
      const savedData = localStorage.getItem('ai_analysis_result');
      const analysisContext = savedData ? savedData : "특이사항 없음";

      // 2. 제미나이에게 특약 생성 요청 프롬프트 (JSON 강제)
      const prompt = `
        너는 전세 사기를 예방하는 전문 변호사야. 
        다음 부동산 분석 결과를 바탕으로, 세입자를 완벽하게 보호할 수 있는 '안심 특약' 3가지를 작성해줘.
        
        [부동산 분석 결과]
        ${analysisContext}

        [출력 규칙]
        반드시 아래 JSON 배열 형식으로만 대답해. 마크다운 기호 없이 순수 JSON만 출력해.
        [
          { 
            "id": 1, 
            "title": "특약 제목 (예: 근저당 말소 조건부 특약)", 
            "badge": "주의 대응" 또는 "기본 권장", 
            "type": "purple" (주의) 또는 "green" (안전/기본), 
            "law": "관련 법률 (예: 주택임대차보호법)", 
            "desc": "실제 계약서에 들어갈 구체적이고 법적인 특약 문구" 
          },
          ... 2, 3번 항목
        ]
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const aiGeneratedClauses = JSON.parse(cleanJson);

      setClauses(aiGeneratedClauses);
    } catch (error) {
      console.error("특약 생성 오류:", error);
      // 에러 시 보여줄 기본 데이터(Fallback)
      setClauses([
        { id: 1, title: "기본 안전 특약", badge: "기본 권장", type: "green", law: "주택임대차보호법", desc: "임대인은 잔금일 익일까지 현재의 권리관계를 유지한다." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (title, desc) => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    let newList;

    if (bookmarkedIds[title]) {
      newList = currentList.filter(item => item.title !== title);
      alert('특약 북마크가 해제되었습니다.');
    } else {
      newList = [...currentList, { id: Date.now(), title: title, desc: desc }];
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
        .section{ background:white; padding:24px 20px; border-radius:30px; margin: -15px 10px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); min-height: 400px; }
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
        .bookmarkBtn { position: absolute; right: 15px; top: 18px; background: none; border: none; cursor: pointer; padding: 5px; transition: transform 0.2s; }
        .bookmarkBtn:active { transform: scale(1.2); }
        
        .loading-text { text-align: center; color: #3f4d8e; font-weight: bold; margin-top: 50px; animation: blink 1.5s infinite; }
        @keyframes blink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
      `}</style>

      <div className="container">
        <div className="topSection">
          <div className="header">
            <button className="backBtn" onClick={() => navigate(-1)}>←</button>
            <h2>AI 특약 자동 생성</h2>
          </div>
          <div className="addressCard">
            <p className="addrTag">AI 맞춤형 특약 리포트</p>
            <h3>위험 요소 방어 특약</h3>
            <div className="warnRow">
              <span className="warnDot"></span>
              <p className="warnText">AI가 분석한 결과를 바탕으로 생성되었습니다.</p>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="sectionHeader">
            <h3>📝 안심 특약 리스트</h3>
            <button className="pdfBtn">PDF 전체 저장</button>
          </div>

          {/* AI 로딩 중일 때 */}
          {loading ? (
            <div className="loading-text">AI가 맞춤형 특약을 작성하고 있습니다... ✍️</div>
          ) : (
            /* AI가 생성한 특약 리스트 렌더링 */
            clauses.map((item) => (
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
            ))
          )}
        </div>

        <button className="saveBtn" onClick={() => alert('PDF 저장 기능 준비 중입니다.')}>
          📄 전체 특약 리포트 PDF 저장
        </button>
      </div>
    </>
  );
}

export default ContractReport;