//Search.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '../prompt';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  systemInstruction: SYSTEM_PROMPT
});

const Icons = {
  Back: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  Doc: () => <span style={{ fontSize: '24px' }}>📋</span>,
  CheckCircle: () => (
    <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#22C55E" />
      <path d="M14 24L21 31L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function Search() {
  const [step, setStep] = useState('upload');
  const [progress, setProgress] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const navigate = useNavigate();
  const MAIN_COLOR = '#3f4d8e';
  const SUCCESS_COLOR = '#22C55E';

  const [uploadedFiles, setUploadedFiles] = useState({
    doc1: null, doc2: null, doc3: null, doc4: null
  });

  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        if (progress < 3) {
          setProgress(prev => prev + 1);
        } else {
          if (loopCount < 2) {
            setProgress(0);
            setLoopCount(prev => prev + 1);
          } else {
            setStep('finish');
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, progress, loopCount]);

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("PDF 형식의 파일만 업로드 가능합니다.");
        e.target.value = "";
        return;
      }
      setUploadedFiles(prev => ({ ...prev, [key]: file })); // file 저장
    }
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const startAIAnalysis = async () => {
    setStep('loading');
    const progressInterval = setInterval(() => setProgress(p => (p < 3 ? p + 1 : 0)), 1500);

    try {
      // 업로드된 파일 변환
      const filePart = await fileToGenerativePart(uploadedFiles.doc1);

      // Gemini에게 분석 요청
      const result = await model.generateContent(["이 부동산 서류를 꼼꼼히 분석해줘.", filePart]);
      const responseText = result.response.text();

      // JSON 파싱 (마크다운 기호 제거)
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const aiData = JSON.parse(cleanJson);

      clearInterval(progressInterval);
      setStep('finish');

      // 🔥 5. 결과를 LocalStorage에 저장! (다른 페이지에서 쓰기 위함)
      localStorage.setItem('ai_analysis_result', JSON.stringify(aiData));

      // 1초 뒤 결과창으로 이동
      setTimeout(() => navigate('/caution-report'), 1000);

    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStep('upload');
    }
  };

  const loadingData = [
    { title: "서류 파싱 완료", desc: "텍스트·날인 인식 완료" },
    { title: "소유권·채무관계 분석", desc: "갑구·을구 검토 중..." },
    { title: "건물·세금 상태 확인", desc: "건축물대장·세금 체납" },
    { title: "위험도 리포트 생성", desc: "신호등 점수 도출" },
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {step === 'upload' ? (
        <div style={{ paddingBottom: '40px' }}>
          <div style={{ background: MAIN_COLOR, padding: '40px 20px 60px 20px', color: 'white', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>

              {/* 👇 뒤로가기 클릭 시 메인(Landing) 페이지로 이동 */}
              <div
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Icons.Back />
              </div>

              <h2 style={{ flex: 1, fontSize: '18px', margin: 0, fontWeight: 'bold', color: '#EEF2FF', marginRight: '24px' }}>
                서류 업로드
              </h2>
            </div>
            <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.5', margin: 0 }}>
              등기부등본은 필수예요.<br />추가할수록 분석이 더 정확해져요.
            </p>
          </div>

          <div style={{ background: 'white', marginTop: '-30px', borderRadius: '30px 30px 0 0', padding: '30px 20px', minHeight: '500px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#E2E8F0', marginRight: '6px' }} />
              <span style={{ display: 'inline-block', width: '20px', height: '8px', borderRadius: '10px', background: MAIN_COLOR, marginRight: '6px' }} />
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#E2E8F0' }} />
            </div>

            <input type="file" id="f1" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange('doc1', e)} />
            <input type="file" id="f2" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange('doc2', e)} />
            <input type="file" id="f3" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange('doc3', e)} />
            <input type="file" id="f4" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange('doc4', e)} />


            <div onClick={() => document.getElementById('f1').click()}>
              <UploadItem title="등기부등본" tag="필수" desc={uploadedFiles.doc1?.name || "인터넷등기소 발급본"} completed={!!uploadedFiles.doc1} />
            </div>
            <div onClick={() => document.getElementById('f2').click()}>
              <UploadItem title="부동산 계약서" tag="선택" desc={uploadedFiles.doc2?.name || "전세계약서 PDF 파일"} dashed completed={!!uploadedFiles.doc2} />
            </div>
            <div onClick={() => document.getElementById('f3').click()}>
              <UploadItem title="건축물대장" tag="선택" desc={uploadedFiles.doc3?.name || "정부24 무료 발급 PDF"} dashed completed={!!uploadedFiles.doc3} />
            </div>
            <div onClick={() => document.getElementById('f4').click()}>
              <UploadItem title="세금완납증명서" tag="선택" desc={uploadedFiles.doc4?.name || "국세·지방세 완납 확인서"} dashed completed={!!uploadedFiles.doc4} />
            </div>


            <button
              onClick={startAIAnalysis}
              disabled={!uploadedFiles.doc1}
              style={{
                width: '100%', padding: '18px', borderRadius: '15px', border: 'none',
                background: uploadedFiles.doc1 ? MAIN_COLOR : '#EEF2FF',
                color: uploadedFiles.doc1 ? 'white' : '#94A3B8',
                fontWeight: 'bold', fontSize: '16px', marginTop: '40px',
                cursor: uploadedFiles.doc1 ? 'pointer' : 'not-allowed'
              }}
            >
              분석 시작하기
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: MAIN_COLOR, margin: 0 }}>집어<span style={{ color: '#94A3B8' }}>줌</span></h2>
            <button onClick={() => { setStep('upload'); setProgress(0); setLoopCount(0); }} style={{ border: '1px solid #E2E8F0', background: 'white', padding: '6px 14px', borderRadius: '8px', color: '#94A3B8' }}>취소</button>
          </div>

          <div className={step === 'loading' ? "pulse-circle" : ""} style={{ width: '80px', height: '80px', borderRadius: '50%', border: step === 'finish' ? "none" : `2px solid ${MAIN_COLOR}`, margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {step === 'finish' ? (
              <Icons.CheckCircle />
            ) : (
              <span style={{ fontSize: '30px' }}>🛡️</span>
            )}
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E293B' }}>
            {step === 'finish' ? '분석이 완료되었습니다!' : 'AI가 심층 분석 중입니다'}
          </h3>
          <p style={{ color: '#94A3B8', marginBottom: '40px', fontSize: '14px' }}>
            {step === 'finish' ? '결과 확인 버튼을 눌러주세요.' : `서류 대조 및 검증 진행 중 (${loopCount + 1}/3)`}
          </p>

          <div style={{ textAlign: 'left' }}>
            {loadingData.map((data, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '20px 16px', borderRadius: '15px', marginBottom: '10px',
                background: step === 'finish' ? '#F0FDF4' : (i === progress ? '#EEF2FF' : '#F8FAFC'),
                border: step === 'loading' && i === progress ? `1.5px solid ${MAIN_COLOR}` : '1.5px solid transparent',
                opacity: step === 'finish' || i === progress ? 1 : 0.4,
                transition: 'all 0.2s'
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: step === 'finish' ? SUCCESS_COLOR : (i === progress ? MAIN_COLOR : '#334155') }}>{data.title}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>{data.desc}</p>
                </div>
                <div style={{
                  width: '20px', height: '20px',
                  border: step === 'finish' ? `2px solid ${SUCCESS_COLOR}` : (i === progress ? `2px solid ${MAIN_COLOR}` : '2px solid #E2E8F0'),
                  borderRadius: '50%',
                  background: step === 'finish' ? SUCCESS_COLOR : (i === progress ? MAIN_COLOR : 'transparent')
                }} />
              </div>
            ))}
          </div>

          {step === 'finish' && (
            <button
              onClick={() => navigate('/caution-report')}
              style={{
                width: '100%', padding: '18px', borderRadius: '15px', border: 'none',
                background: SUCCESS_COLOR, color: 'white', fontWeight: 'bold', fontSize: '16px',
                marginTop: '30px', boxShadow: `0 4px 15px rgba(34, 197, 94, 0.3)`,
                animation: 'slideUp 0.5s ease-out', cursor: 'pointer'
              }}
            >
              분석 결과 확인하기 →
            </button>
          )}

          <style>{`
            .pulse-circle { animation: pulse 2s infinite ease-out; }
            @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}
    </div>
  );
}

function UploadItem({ title, tag, desc, completed, dashed }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '20px 16px',
      borderRadius: '15px',
      border: dashed ? '1.5px dashed #E2E8F0' : completed ? '1.5px solid #3f4d8e' : '1.5px solid #E2E8F0',
      background: 'white',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}>
      <div style={{ width: '45px', height: '45px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
        📋
      </div>
      <div style={{ marginLeft: '15px', flex: 1, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#334155' }}>{title}</span>
          <span style={{ marginLeft: '6px', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: tag === '필수' ? '#FEE2E2' : '#F1F5F9', color: tag === '필수' ? '#EF4444' : '#94A3B8' }}>{tag}</span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: completed ? '#3f4d8e' : '#94A3B8', lineHeight: '1.4' }}>{desc}</p>
      </div>
      <div style={{ width: '22px', height: '22px', border: completed ? '6px solid #3f4d8e' : '2px solid #E2E8F0', borderRadius: '50%', transition: 'all 0.2s', flexShrink: 0 }} />
    </div>
  );
}