import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  // 요청하신 4가지 메뉴 구성
  const menuItems = [
    { label: '서류 분석', icon: '📋', path: '/search', desc: 'AI가 계약서와 등기부등본을 분석합니다' },
    { label: '등기 조회', icon: '🚨', path: null, desc: '실시간 등기 변동 사항을 확인합니다' },
    { label: 'AI 상담', icon: '💬', path: '/chat', desc: '궁금한 점을 AI 챗봇에게 물어보세요' },
    { label: '일정 관리', icon: '📅', path: '/calendar', desc: '계약부터 이사까지 일정을 관리합니다' }
  ];

  return (
    <div className="content-wrapper" style={{ padding: 0, backgroundColor: '#F8F9FB', minHeight: '100vh' }}>
      {/* 상단 히어로 섹션 */}
      <div style={{ 
        background: '#3f4d8e', 
        padding: '50px 20px 60px 20px',
        textAlign: 'left',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        boxShadow: '0 10px 30px rgba(63, 77, 142, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
          <span style={{ 
            background: 'white', color: '#3f4d8e', padding: '6px 16px', 
            borderRadius: '20px', fontWeight: '800', fontSize: '14px' 
          }}>집어줌</span>
        </div>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>
          AI 전세 사기 예방 서비스
        </p>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '800', lineHeight: '1.4', margin: 0 }}>
          전세 사기,<br/>AI가 먼저<br/>잡아드립니다
        </h1>
        
        <button 
          onClick={() => navigate('/search')} 
          style={{ 
            marginTop: '25px', width: '100%', padding: '18px', borderRadius: '20px', 
            border: 'none', background: 'white', color: '#3f4d8e', fontWeight: '800', fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
          }}
        >
          무료로 분석하기 →
        </button>
      </div>

      {/* 서비스 메뉴 리스트 (4x1 세로 배열) */}
      <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              if (item.path) navigate(item.path);
              else alert('준비 중인 기능입니다!');
            }}
            style={{ 
              background: 'white', 
              padding: '20px',
              borderRadius: '20px', 
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* 아이콘 부분 */}
            <div style={{ 
              fontSize: '24px', 
              background: '#F8FAFC', 
              width: '54px', height: '54px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginRight: '16px', flexShrink: 0
            }}>{item.icon}</div>
            
            {/* 텍스트 부분 */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#334155', marginBottom: '2px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>
                {item.desc}
              </div>
            </div>

            {/* 화살표 아이콘 (오른쪽 끝) */}
            <div style={{ marginLeft: 'auto', color: '#E2E8F0', fontSize: '18px' }}>
              ❯
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}