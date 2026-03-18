//Layout.jsx
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
  const MAIN_COLOR = '#3f4d8e'; 

  return (
    <div className="phone-container" style={{ position: 'relative', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* 컨텐츠 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '120px' }}>
        {children}
      </div>

      {/* 하단 탭바 */}
      <div style={{ 
        position: 'absolute', bottom: 0, width: '100%', 
        backgroundColor: 'white', borderTop: '1px solid #E2E8F0',
        display: 'flex', justifyContent: 'space-around', 
        alignItems: 'center', 
        height: '90px',      
        paddingTop: '12px',   
        paddingBottom: '20px',
        zIndex: 1000 
      }}>
        
        {/* 홈 */}
        <div 
          onClick={() => { setActiveTab('홈'); navigate('/'); }} 
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Icons.Home color={activeTab === '홈' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: '10px', color: activeTab === '홈' ? MAIN_COLOR : '#94A3B8', fontWeight: 'bold', marginTop: '4px' }}>홈</div>
        </div>

        {/* 북마크 (🚨 이 부분을 수정했습니다!) */}
        <div 
          onClick={() => {
            setActiveTab('북마크');
            navigate('/bookmark'); // ✅ 북마크 페이지(/bookmark)로 이동!
          }} 
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Icons.Bookmark color={activeTab === '북마크' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: '10px', color: activeTab === '북마크' ? MAIN_COLOR : '#94A3B8', fontWeight: 'bold', marginTop: '4px' }}>북마크</div>
        </div>

        {/* 중앙 돋보기 버튼 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div 
            onClick={() => { setActiveTab(''); navigate('/search'); }} 
            style={{ 
              width: '52px', height: '52px', background: MAIN_COLOR, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', 
              boxShadow: `0 4px 12px rgba(63, 77, 142, 0.4)`, cursor: 'pointer', marginTop: '-12px' 
            }}
          >
            <Icons.Search />
          </div>
        </div>

        {/* 상담 */}
        <div 
          onClick={() => { setActiveTab('상담'); navigate('/chat'); }} 
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Icons.Chat color={activeTab === '상담' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: '10px', color: activeTab === '상담' ? MAIN_COLOR : '#94A3B8', fontWeight: 'bold', marginTop: '4px' }}>상담</div>
        </div>

        {/* 마이 */}
        <div 
          onClick={() => { setActiveTab('마이'); navigate('/mypage'); }} 
          style={{ textAlign: 'center', flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Icons.User color={activeTab === '마이' ? MAIN_COLOR : '#94A3B8'} />
          <div style={{ fontSize: '10px', color: activeTab === '마이' ? MAIN_COLOR : '#94A3B8', fontWeight: 'bold', marginTop: '4px' }}>마이</div>
        </div>

      </div>
    </div>
  );
}