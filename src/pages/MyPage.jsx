import React from "react";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "📄", title: "내 서류 분석 기록", desc: "분석한 계약서와 위험도 결과 확인" },
    { icon: "✍️", title: "내 특약 관리", desc: "저장한 특약 문구 모아보기" },
    { icon: "🔔", title: "알림 설정", desc: "중요 일정과 분석 알림 설정" },
    { icon: "☎️", title: "고객센터", desc: "문의하기 및 도움말 확인" },
  ];

  const historyItems = [
    { title: "마포구 합정동 123-4 / 302호", status: "주의", date: "2026.03.14", level: "warning" },
    { title: "대구 북구 대학로 80 / 원룸", status: "안전", date: "2026.02.25", level: "safe" },
  ];

  return (
    <div style={{ backgroundColor: '#f3f4f8', minHeight: '100vh', paddingBottom: '100px' }}>
      <style>{`
        .topbar { height: 78px; background: #3f4d8e; color: white; display: flex; align-items: center; justify-content: space-between; padding: 40px 16px 12px; }
        .mypage-container { padding: 18px 16px; }
        .profile-card { background: linear-gradient(135deg, #4c40d4, #3f4d8e); border-radius: 22px; padding: 18px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 20px rgba(63, 77, 142, 0.2); }
        .avatar { width: 58px; height: 58px; border-radius: 18px; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .summary-section { margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .summary-card { background: white; border-radius: 20px; padding: 14px 10px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
        .summary-label { font-size: 11px; color: #8a90a3; margin-bottom: 4px; }
        .menu-item { width: 100%; border: none; background: white; border-radius: 22px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 14px rgba(0,0,0,0.05); margin-bottom: 12px; cursor: pointer; }
        .history-card { background: white; border-radius: 18px; padding: 14px; margin-bottom: 10px; border-left: 5px solid #ccc; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
        .history-card.safe { border-left-color: #22c55e; }
        .history-card.warning { border-left-color: #f59e0b; }
        .history-status { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 10px; }
        .history-status.safe { background: #dcfce7; color: #15803d; }
        .history-status.warning { background: #fef3c7; color: #b45309; }
      `}</style>

      <header className="topbar">
        <div style={{ fontSize: '20px', fontWeight: '800' }}>마이페이지</div>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>🏠</button>
      </header>

      <main className="mypage-container">
        <section className="profile-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="avatar">👤</div>
            <div>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>경북대학교 컴퓨터학부</p>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>김고은 님</h2>
              <p style={{ fontSize: '12px', opacity: 0.9 }}>2025005271</p>
            </div>
          </div>
          <button style={{ border: 'none', background: 'white', color: '#3f4d8e', padding: '8px 14px', borderRadius: '12px', fontWeight: '700', fontSize: '13px' }}>수정</button>
        </section>

        <section className="summary-section">
          <div className="summary-card">
            <p className="summary-label">서류 분석</p>
            <h3 style={{ margin: 0 }}>12건</h3>
          </div>
          <div className="summary-card">
            <p className="summary-label">상담 기록</p>
            <h3 style={{ margin: 0 }}>8건</h3>
          </div>
          <div className="summary-card" onClick={() => navigate('/calendar')} style={{ cursor: 'pointer' }}>
            <p className="summary-label">중요 일정</p>
            <h3 style={{ margin: 0 }}>3건</h3>
          </div>
        </section>

        <h3 style={{ margin: '24px 0 12px', fontSize: '16px', fontWeight: '800' }}>메뉴</h3>
        <section className="menu-section">
          {menuItems.map((item, index) => (
            <button className="menu-item" key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: '11px', color: '#9197aa', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
              <span style={{ color: '#b5bbcb' }}>›</span>
            </button>
          ))}
        </section>

        <h3 style={{ margin: '24px 0 12px', fontSize: '16px', fontWeight: '800' }}>최근 분석 기록</h3>
        <section className="history-section">
          {historyItems.map((item, index) => (
            <div className={`history-card ${item.level}`} key={index}>
              <p style={{ fontSize: '11px', color: '#9399aa', marginBottom: '4px' }}>{item.date}</p>
              <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{item.title}</p>
              <span className={`history-status ${item.level}`}>{item.status}</span>
            </div>
          ))}
        </section>

        <button style={{ width: '100%', marginTop: '20px', height: '50px', border: 'none', borderRadius: '16px', background: '#eceef5', color: '#6b7280', fontWeight: '700', cursor: 'pointer' }}>로그아웃</button>
      </main>
    </div>
  );
}

export default MyPage;