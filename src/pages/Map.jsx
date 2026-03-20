import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 기본 마커 아이콘 fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 커스텀 마커
const customIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="
      width:36px; height:36px;
      background:#4B4F8F;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid white;
      box-shadow:0 4px 12px rgba(75,79,143,0.4);
      display:flex; align-items:center; justify-content:center;
    ">
      <div style="
        width:10px; height:10px;
        background:white; border-radius:50%;
        transform:rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// 지도 중심 이동 컴포넌트
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 17, { animate: true });
    }
  }, [center]);
  return null;
}

function Map() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.5665, 126.9780]);

  // Daum 우편번호 스크립트 로드
  useEffect(() => {
    if (window.daum?.Postcode) return;
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setQuery(fullAddress);
        setSelected({
          main: fullAddress,
          sub: data.buildingName || data.bname || '',
          zonecode: data.zonecode,
        });

        // 주소 → 좌표 변환 (OpenStreetMap Nominatim)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`,
            { headers: { 'Accept-Language': 'ko' } }
          );
          const data2 = await res.json();
          if (data2.length > 0) {
            setMapCenter([parseFloat(data2[0].lat), parseFloat(data2[0].lon)]);
          }
        } catch (e) {
          console.error('좌표 변환 실패', e);
        }
      },
    }).open();
  };

  const handleConfirm = () => {
    if (!selected) return;
    localStorage.setItem('selected_address', selected.main);
    navigate('/search');
  };

  return (
    <div style={{
      width: '100%', backgroundColor: '#F0F0F7',
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: '#4B4F8F',
        padding: '20px 20px 20px',
        borderRadius: '0 0 28px 28px',
        color: 'white', flexShrink: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div onClick={() => navigate(-1)} style={{
            cursor: 'pointer', fontWeight: 700, fontSize: 14,
            background: 'rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: 20,
          }}>←</div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>주소 검색</span>
        </div>

        {/* 검색창 */}
        <div onClick={openPostcode} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="#9CA3AF" strokeWidth="1.7"/>
              <path d="M12 12l3 3" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{
            width: '100%', boxSizing: 'border-box',
            padding: '13px 14px 13px 42px',
            borderRadius: 14,
            fontSize: 14, fontWeight: 500,
            background: 'white', color: query ? '#1E1B4B' : '#9CA3AF',
            userSelect: 'none',
          }}>
            {query || '도로명 주소를 입력하세요'}
          </div>
          {query && (
            <button
              onClick={e => { e.stopPropagation(); setQuery(''); setSelected(null); setMapCenter([37.5665, 126.9780]); }}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: '#E5E7EB', border: 'none', borderRadius: '50%',
                width: 20, height: 20, cursor: 'pointer', fontSize: 11, color: '#6B7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          )}
        </div>
      </div>

      {/* ── 지도 (Leaflet) ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, zIndex: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          {selected && (
            <Marker position={mapCenter} icon={customIcon} />
          )}
        </MapContainer>
      </div>

      {/* ── 하단 카드 ── */}
      {selected ? (
        <div style={{
          padding: '16px 16px 100px', background: 'white',
          borderTop: '1.5px solid #EDEDF8', flexShrink: 0,
          boxShadow: '0 -4px 16px rgba(75,79,143,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: '#F0F0F7', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2C6.24 2 4 4.24 4 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Z" stroke="#4B4F8F" strokeWidth="1.5"/>
                <circle cx="9" cy="7" r="1.8" fill="#4B4F8F"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 800, color: '#1E1B4B' }}>
                {selected.main}
              </p>
              {selected.sub && (
                <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6B7280' }}>{selected.sub}</p>
              )}
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#4B4F8F',
                background: '#EDEDF8', padding: '2px 8px', borderRadius: 20,
                display: 'inline-block',
              }}>
                {selected.zonecode}
              </span>
            </div>
            <button onClick={openPostcode} style={{
              background: 'none', border: '1.5px solid #EDEDF8', borderRadius: 10,
              padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              color: '#4B4F8F', flexShrink: 0,
            }}>
              재검색
            </button>
          </div>
          <button onClick={handleConfirm} style={{
            width: '100%', background: '#4B4F8F', color: 'white',
            padding: 15, borderRadius: 14, border: 'none',
            fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(75,79,143,0.3)',
          }}>
            이 주소로 서류 분석하기
          </button>
        </div>
      ) : (
        /* 미선택 상태 안내 */
        <div style={{
          padding: '16px 16px 100px', background: 'white',
          borderTop: '1.5px solid #EDEDF8', flexShrink: 0,
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
            위 검색창을 눌러 주소를 입력하세요
          </p>
        </div>
      )}
    </div>
  );
}

export default Map;
