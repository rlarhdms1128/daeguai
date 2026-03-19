import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText, Bell, Headphones, Home, Mail, Phone, Calendar, User, LogOut } from "lucide-react";

function MyPage() {
  const navigate = useNavigate();
  const MAIN_COLOR = "#3f4d8e";

  const menuItems = [
    { icon: <FileText size={20} color={MAIN_COLOR} />, title: "내 서류 분석 기록", desc: "분석한 계약서와 결과 확인", path: "/history" },
    { icon: <Bell size={20} color={MAIN_COLOR} />, title: "알림 설정", desc: "중요 일정 및 분석 알림", path: "/settings" },
    { icon: <Headphones size={20} color={MAIN_COLOR} />, title: "고객센터", desc: "문의하기 및 도움말", path: "/support" },
  ];

  return (
    <div style={{ backgroundColor: '#F8F9FB', minHeight: '100vh', paddingBottom: '60px' }}>
      <style>{`
        .header-profile-wrap { 
          background: ${MAIN_COLOR}; 
          color: white; 
          padding-bottom: 40px; 
          box-shadow: 0 10px 30px rgba(63, 77, 142, 0.15); 
          margin-bottom: -35px; 
          position: relative; 
          z-index: 10; 
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
        }

        .topbar { 
          display: flex; 
          align-items: center; 
          justify-content: flex-end; 
          padding: 85px 24px 0; 
          position: absolute; 
          right: 0;
          top: 0;
          z-index: 100;
        }
        .home-btn { background: none; border: none; cursor: pointer; color: white; opacity: 0.9; }

        .profile-section { 
          padding: 75px 24px 10px; 
          display: flex; 
          align-items: center; 
          gap: 20px; 
          justify-content: flex-start; 
        }
        
        .avatar-box { 
          width: 100px; height:100px; border-radius: 32px; 
          background: rgba(255, 255, 255, 0.12); 
          display: flex; align-items: center; justify-content: center; 
          border: 1px solid rgba(255, 255, 255, 0.2); flex-shrink: 0; 
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .user-info { display: flex; flex-direction: column; gap: 3px; flex: 1; align-items: flex-start; }
        .user-name { font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0; letter-spacing: -0.5px; }
        
        .detail-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255, 255, 255, 0.8); margin-bottom: 2px; }

        .stat-container { display: flex; width: calc(100% - 40px); background: white; border-radius: 26px; padding: 20px; margin: 0 20px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); box-sizing: border-box; position: relative; z-index: 20; }
        .stat-item { flex: 1; display: flex; flex-direction: column; gap: 4px; align-items: center; }
        .stat-label { font-size: 11.5px; color: #94a3b8; font-weight: 500; }
        .stat-value { font-size: 18px; font-weight: 800; color: ${MAIN_COLOR}; } 
        .stat-divider { width: 1px; background: #f1f5f9; margin: 0 5px; }

        .menu-card { background: white; border-radius: 26px; margin: 0 20px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.03); }
        .menu-item { width: 100%; border: none; background: none; padding: 19px 22px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-bottom: 1px solid #f8fafc; transition: background 0.2s; box-sizing: border-box; }
        .menu-item:last-child { border-bottom: none; }

        /* ✅ 와이드 로그아웃 버튼 스타일 */
        .logout-btn-wide {
          width: calc(100% - 40px);
          margin: 30px 20px 10px;
          height: 56px;
          border-radius: 18px;
          border: none;
          background: #f1f3f7;
          color: #94a3b8;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn-wide:active {
          background: #e6e9ef;
          transform: scale(0.98);
        }

        .version-info {
          text-align: center;
          font-size: 11px;
          color: #cbd5e1;
          margin-top: 10px;
        }
      `}</style>

      <div className="header-profile-wrap">

        <section className="profile-section">
          <div className="avatar-box">
            <User size={60} color="rgba(255, 255, 255, 0.6)" strokeWidth={1.5} />
          </div>

          <div className="user-info">
            <h2 className="user-name">김고은</h2>
            
            <div style={{ marginTop: '4px' }}>
              <div className="detail-row">
                <Mail size={12} color="rgba(255, 255, 255, 0.6)" />
                <span>rlarhdms1128@knu.ac.kr</span>
              </div>
              <div className="detail-row">
                <Phone size={12} color="rgba(255, 255, 255, 0.6)" />
                <span>010-8663-4254</span>
              </div>
              <div className="detail-row" style={{ marginTop: '6px', opacity: 0.7 }}>
                <Calendar size={12} />
                <span>2026.03.14 가입</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        <div className="stat-container">
          <div className="stat-item">
            <span className="stat-label">서류 분석 건수</span>
            <span className="stat-value">12건</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">상담 기록 내역</span>
            <span className="stat-value">8건</span>
          </div>
        </div>

        <section className="menu-card">
          {menuItems.map((item, index) => (
            <button className="menu-item" key={index} onClick={() => navigate(item.path)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '17px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0f2f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </button>
          ))}
        </section>

        {/* ✅ 길게 바뀐 로그아웃 버튼 */}
      <button className="logout-btn-wide" onClick={() => {}}>
          <LogOut size={18} />
          로그아웃
        </button>

        <p className="version-info">Version 1.0.2 (Build 20260319)</p>
      </main>
    </div>
  );
}

export default MyPage;
