import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });


function Chat() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { type: "banner", text: "등기부등본 · 계약서 분석 결과를 바탕으로 답변해드려요" },
    { type: "ai", text: "안녕하세요! 분석 결과를 바탕으로 궁금한 점을 질문해주세요. 근저당, 용도, 특약 등 뭐든 물어보세요.", time: "오후 2:34" },
  ]);


  const [bookmarkedTexts, setBookmarkedTexts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 채팅 답변 ++ 북마크
  const toggleBookmark = (text) => {
    const currentList = JSON.parse(localStorage.getItem('bookmarked_terms') || '[]');
    let newList;

    if (bookmarkedTexts.includes(text)) {
      // 해제 로직
      newList = currentList.filter(item => item.desc !== text);
      setBookmarkedTexts(prev => prev.filter(t => t !== text));
      alert('북마크가 해제되었습니다.');
    } else {
      // 저장 로직
      const newBookmark = {
        id: Date.now(),
        title: 'AI 상담 답변', // Bookmark 페이지의 [item.title]로 표시됨
        desc: text           // Bookmark 페이지의 item.desc로 표시됨
      };
      newList = [...currentList, newBookmark];
      setBookmarkedTexts(prev => [...prev, text]);
      alert('북마크에 저장되었습니다! 북마크 페이지에서 확인하세요.');
    }

    localStorage.setItem('bookmarked_terms', JSON.stringify(newList));
  };

  const aiReplies = [
    "근저당 62%는 주의 수준이에요. 경매 시 보증금 전액 회수가 어려울 수 있어요. 계약 전 집주인에게 대출 상환 계획을 확인하는 걸 권장해요.",
    "네, 근저당 말소 조건부 특약을 추가하면 법적으로 보호받을 수 있어요. 아까 생성해드린 특약 리포트의 1번 항목을 확인해보세요!",
  ];

  const userCount = messages.filter((msg) => msg.type === "user").length;

  const sendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const timeString = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 내 메시지 화면에 추가
    setMessages(prev => [...prev, { type: "user", text: trimmed, time: timeString }]);
    setInputValue("");

    try {
      // 분석된 서류 내용(Context)을 같이 보내주면 챗봇이 더 똑똑하게 대답합니다.
      const savedReport = localStorage.getItem('ai_analysis_result') || "";
      const prompt = `
        너는 부동산 전문가야. 다음은 이 집의 서류 분석 결과야: ${savedReport}
        사용자의 다음 질문에 친절하게 짧게 대답해줘: ${trimmed}
      `;

      const result = await model.generateContent(prompt);
      const aiText = result.response.text();

      setMessages(prev => [...prev, { type: "ai", text: aiText, time: timeString }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: "ai", text: "죄송합니다, 잠시 오류가 발생했어요.", time: timeString }]);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f6fb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .topBar { background: #3f4d8e; color: white; padding: 50px 16px 20px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; flex-shrink: 0; }
        .headerRow { display: flex; align-items: center; gap: 12px; }
        .iconBtn { width: 32px; height: 32px; border: none; border-radius: 10px; background: rgba(255, 255, 255, 0.15); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .title { font-size: 18px; font-weight: 800; margin: 0; }
        .chatArea { flex: 1; padding: 20px 16px 200px; overflow-y: auto; scroll-behavior: smooth; }
        .banner { width: 100%; border-radius: 12px; border: 1px solid #bfd0f7; background: #eaf1ff; color: #5a61b5; font-size: 12px; padding: 12px; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
        .bubbleWrap { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 20px; position: relative; }
        .bubble { border-radius: 18px; padding: 12px 16px; font-size: 14px; line-height: 1.6; max-width: 75%; position: relative; }
        .bubble.ai { background: white; border: 1px solid #d8ddea; color: #334155; border-top-left-radius: 4px; padding-right: 34px; }
        .bubble.user { background: #3f4d8e; color: white; border-top-right-radius: 4px; }
        
        .chat-bookmark-btn { 
          position: absolute; right: 8px; top: 8px; background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; 
        }
        
        .bottomInputWrap { position: fixed; left: 0; right: 0; bottom: 120px; background: white; padding: 12px 16px; border-top: 1px solid #eee; z-index: 1000; }
        .inputRow { display: flex; align-items: center; gap: 10px; }
        .chatInput { flex: 1; height: 44px; border-radius: 22px; border: 1px solid #d5d9e5; background: #f8f9ff; outline: none; padding: 0 18px; font-size: 14px; }
        .sendBtn { width: 40px; height: 40px; border: none; border-radius: 50%; background: #3f4d8e; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
      `}</style>

      <div className="topBar">
        <div className="headerRow">
          <button className="iconBtn" onClick={() => navigate(-1)}>←</button>
          <p className="title">집어줌 AI 상담</p>
        </div>
      </div>

      <div className="chatArea" ref={scrollRef}>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === "banner" ? (
              <div className="banner">📋 {msg.text}</div>
            ) : (
              <div className="bubbleWrap" style={{ justifyContent: msg.type === 'ai' ? 'flex-start' : 'flex-end' }}>
                <div className={`bubble ${msg.type}`}>
                  {msg.text}
                  {msg.type === 'ai' && (
                    <button className="chat-bookmark-btn" onClick={() => toggleBookmark(msg.text)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarkedTexts.includes(msg.text) ? "#3f4d8e" : "none"} stroke={bookmarkedTexts.includes(msg.text) ? "#3f4d8e" : "#cbd5e1"} strokeWidth="2.5">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{msg.time}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bottomInputWrap">
        <div className="inputRow">
          <input
            className="chatInput"
            placeholder="궁금한 점을 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="sendBtn" onClick={sendMessage}>↑</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
