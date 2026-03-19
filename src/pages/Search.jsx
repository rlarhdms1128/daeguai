import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react'; 
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '../prompt';

// 🔥 1. 제미나이 초기 세팅 부활!
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  systemInstruction: SYSTEM_PROMPT
});

const Icons = {
  Back: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#22C55E"/>
      <path d="M14 24L21 31L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function Search() {
  const [step, setStep] = useState('upload'); 
  const [progress, setProgress] = useState(0); 
  const [loopCount, setLoopCount] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isAgreed, setIsAgreed] = useState(false); 
  const navigate = useNavigate();
  const MAIN_COLOR = '#3f4d8e';
  const SUCCESS_COLOR = '#22C55E';

  const [uploadedFiles, setUploadedFiles] = useState({
    doc1: null, doc2: null, doc3: null, doc4: null
  });

  // 🚨 가짜 타이머(useEffect)는 삭제했습니다! 

  const handleFileChange = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("PDF 형식의 파일만 업로드 가능합니다. 다시 선택해주세요.");
        e.target.value = ""; 
        return;
      }
      // 🔥 2. 파일 이름(글자)이 아니라 파일 객체 자체를 저장해야 AI가 읽을 수 있습니다.
      setUploadedFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  // 🔥 3. 파일을 AI가 읽을 수 있게 변환해주는 함수 부활!
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

  // 🔥 4. 진짜 AI 통신 로직으로 교체!
  const startAnalysis = async () => {
    setIsModalOpen(false);
    setStep('loading');
    setProgress(0);
    setLoopCount(0);

    // 심미용 진행바 애니메이션
    const progressInterval = setInterval(() => {
      setProgress(p => (p < 3 ? p + 1 : 0));
      setLoopCount(l => l + 1);
    }, 1500);

    try {
      const filePart = await fileToGenerativePart(uploadedFiles.doc1);

      // 제미나이 호출
      const result = await model.generateContent(["이 부동산 서류를 꼼꼼히 분석해줘.", filePart]);
      const responseText = result.response.text();

      // 마크다운 제거 후 파싱
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const aiData = JSON.parse(cleanJson);

      clearInterval(progressInterval);
      setStep('finish');

      // 🔥 5. 결과를 LocalStorage에 저장! (결과창에서 이 데이터를 꺼내 씁니다)
      localStorage.setItem('ai_analysis_result', JSON.stringify(aiData));

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
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', position: 'relative' }}>
      {step === 'upload' ? (
        <div style={{ paddingBottom: '40px' }}>
          <div style={{ background: MAIN_COLOR, padding: '40px 20px 60px 20px', color: 'white', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Icons.Back />
              </div>
              <h2 style={{ flex: 1, fontSize: '18px', margin: 0, fontWeight: 'bold', color : '#EEF2FF', marginRight: '24px' }}>
                서류 업로드
              </h2>
            </div>
            <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.5', margin: 0 }}>
              등기부등본은 필수예요.<br/>추가할수록 분석이 더 정확해져요.
            </p>
          </div>

          <div style={{ background: 'white', marginTop: '-30px', borderRadius: '30px 30px 0 0', padding: '30px 20px', minHeight: '500px' }}>
            <input type="file" id="f1" accept=".pdf" style={{display:'none'}} onChange={(e)=>handleFileChange('doc1', e)} />
            <input type="file" id="f2" accept=".pdf" style={{display:'none'}} onChange={(e)=>handleFileChange('doc2', e)} />
            <input type="file" id="f3" accept=".pdf" style={{display:'none'}} onChange={(e)=>handleFileChange('doc3', e)} />
            <input type="file" id="f4" accept=".pdf" style={{display:'none'}} onChange={(e)=>handleFileChange('doc4', e)} />
            
            {/* 🔥 6. 흰 화면 에러 방지를 위해 .name을 추가했습니다 */}
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
              onClick={() => setIsModalOpen(true)} 
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
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: MAIN_COLOR, margin: 0 }}>집어<span style={{color: '#94A3B8'}}>줌</span></h2>
            <button onClick={() => {setStep('upload'); setProgress(0); setLoopCount(0);}} style={{ border: '1px solid #E2E8F0', background: 'white', padding: '6px 14px', borderRadius: '8px', color: '#94A3B8' }}>취소</button>
          </div>

          <div className={step === 'loading' ? "pulse-circle" : ""} style={{ width: '80px', height: '80px', borderRadius: '50%', border: step === 'finish' ? "none" : `2px solid ${MAIN_COLOR}`, margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {step === 'finish' ? <Icons.CheckCircle /> : <span style={{ fontSize: '30px' }}>🛡️</span>}
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
                cursor: 'pointer'
              }}
            >
              분석 결과 확인하기 →
            </button>
          )}
        </div>
      )}

      {/* 모달 유지 */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box'
        }}>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '25px', width: '100%', maxWidth: '400px', 
            padding: '30px 24px', position: 'relative', textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.3s ease-out'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X size={24} />
            </button>

            <div style={{ width: '60px', height: '60px', background: '#FEF2F2', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertCircle size={32} color="#EF4444" />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '12px' }}>분석 시작 전 유의사항</h3>
            <div style={{ textAlign: 'left', background: '#F8FAFC', padding: '16px', borderRadius: '15px', fontSize: '13px', color: '#64748B', lineHeight: '1.6', marginBottom: '20px' }}>
              • 본 분석 결과는 AI가 입력된 서류를 바탕으로 제공하는 <b>참고용 자료</b>입니다.<br/>
              • 실제 권리 관계와 다를 수 있으며, 당사는 분석 결과에 대해 <b>법적 책임을 지지 않습니다.</b><br/>
              • 계약 전 반드시 공인중개사나 전문가와 상담하시기 바랍니다.
            </div>

            <div 
              onClick={() => setIsAgreed(!isAgreed)}
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                cursor: 'pointer', marginBottom: '30px', padding: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isAgreed ? (
                  <CheckCircle2 size={24} color={MAIN_COLOR} fill={`${MAIN_COLOR}15`} />
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #CBD5E1' }} />
                )}
              </div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: isAgreed ? MAIN_COLOR : '#94A3B8' }}>
                위 내용을 모두 확인했습니다.
              </span>
            </div>

            <button 
              onClick={startAnalysis}
              disabled={!isAgreed}
              style={{ 
                width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                background: isAgreed ? MAIN_COLOR : '#E2E8F0', 
                color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: isAgreed ? 'pointer' : 'not-allowed'
              }}
            >
              확인 및 분석 시작
            </button>
          </div>
        </div>
      )}

      <style>{`
        .pulse-circle { animation: pulse 2s infinite ease-out; }
        @keyframes pulse { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

function UploadItem({ title, tag, desc, completed, dashed }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', padding: '20px 16px', borderRadius: '15px', 
      border: dashed ? '1.5px dashed #E2E8F0' : completed ? '1.5px solid #3f4d8e' : '1.5px solid #E2E8F0',
      background: 'white', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s'
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