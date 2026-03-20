import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Icons = {
  Home: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Bookmark: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Chat: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  User: ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Search: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )
};

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState('홈');
  const navigate = useNavigate();
  const MAIN_COLOR = '#4B4F8F';

  return (
    <div className="phone-container" style={{ position: 'relative', backgroundColor: '#F0F0F7', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* 컨텐츠 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }}>
        {children}
      </div>

      {/* 하단 탭바 */}
      <div style={{
        position: 'absolute', bottom: 0, width: '100%',
        backgroundColor: 'white', borderTop: '1px solid #EDEDF8',
        display: 'flex', justifyContent: 'space-around',
        alignItems: 'center',
        height: '68px',
        paddingBottom: '8px',
        zIndex: 1000,
        fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      }}>

        {/* 홈 */}
        <div onClick={() => { setActiveTab('홈'); navigate('/'); }}
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Icons.Home color={activeTab === '홈' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: 10, color: activeTab === '홈' ? MAIN_COLOR : '#94A3B8', fontWeight: 700 }}>홈</div>
        </div>

        {/* 북마크 */}
        <div onClick={() => { setActiveTab('북마크'); navigate('/bookmark'); }}
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Icons.Bookmark color={activeTab === '북마크' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: 10, color: activeTab === '북마크' ? MAIN_COLOR : '#94A3B8', fontWeight: 700 }}>북마크</div>
        </div>

        {/* 중앙 돋보기 → /map 으로 이동 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div
            onClick={() => { setActiveTab('지도'); navigate('/map'); }}
            style={{
              width: 52, height: 52, background: MAIN_COLOR, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(75,79,143,0.4)',
              cursor: 'pointer', marginTop: '-5px',
            }}
          >
            <Icons.Search />
          </div>
        </div>

        {/* 상담 */}
        <div onClick={() => { setActiveTab('상담'); navigate('/chat'); }}
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Icons.Chat color={activeTab === '상담' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: 10, color: activeTab === '상담' ? MAIN_COLOR : '#94A3B8', fontWeight: 700 }}>상담</div>
        </div>

        {/* 마이 */}
        <div onClick={() => { setActiveTab('마이'); navigate('/mypage'); }}
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Icons.User color={activeTab === '마이' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: 10, color: activeTab === '마이' ? MAIN_COLOR : '#94A3B8', fontWeight: 700 }}>마이</div>
        </div>

      </div>
    </div>
  );
}
