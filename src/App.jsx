import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Search from './pages/Search';
import Calendar from './pages/Calendar';
import CautionReport from './pages/CautionReport.jsx';
import ContractReport from './pages/ContractReport.jsx';
import Chat from './pages/Chat.jsx';
import MyPage from './pages/MyPage.jsx';
// 👇 8. 북마크 페이지를 불러옵니다.
import Bookmark from './pages/Bookmark.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 1. 메인 홈 화면 */}
          <Route path="/" element={<Landing />} />
          
          {/* 2. 서류 업로드 및 분석 진행 화면 */}
          <Route path="/search" element={<Search />} />

          {/* 3. 북마크(저장 목록) 화면 👈 추가됨! */}
          <Route path="/bookmark" element={<Bookmark />} />
          
          {/* 4. 일정 관리 화면 */}
          <Route path="/calendar" element={<Calendar />} />

          {/* 5. 분석 결과 (주의/위험) 리포트 화면 */}
          <Route path="/caution-report" element={<CautionReport />} />

          {/* 6. AI 안심 특약 생성 결과 화면 */}
          <Route path="/contract-report" element={<ContractReport />} />

          {/* 7. AI 1:1 채팅 상담 화면 */}
          <Route path="/chat" element={<Chat />} />

          {/* 8. 마이페이지 (프로필 및 기록) */}
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;