import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const customIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="width:36px; height:36px; background:#4B4F8F; border-radius:50% 50% 50% 0; transform:rotate(-45deg); border:3px solid white; box-shadow:0 4px 12px rgba(75,79,143,0.4); display:flex; align-items:center; justify-content:center;">
      <div style="width:10px; height:10px; background:white; border-radius:50%; transform:rotate(45deg);"></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 17, { animate: true });
  }, [center]);
  return null;
}

function Map() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.5665, 126.9780]);
  const MAIN_COLOR = '#4B4F8F';

  useEffect(() => {
    if (window.daum?.Postcode) return;
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const openPostcode = () => {
    if (!window.daum?.Postcode) { alert('주소 검색 서비스를 불러오는 중입니다.'); return; }
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setQuery(fullAddress);
        setSelected({ main: fullAddress, sub: data.buildingName || data.bname || '', zonecode: data.zonecode });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`);
          const data2 = await res.json();
          if (data2.length > 0) setMapCenter([parseFloat(data2[0].lat), parseFloat(data2[0].lon)]);
        } catch (e) { console.error(e); }
      },
    }).open();
  };

  const handleConfirm = () => {
    if (!selected) return;
    alert("🚧 서비스 준비 중입니다!\n현재 AI 상세 분석 기능을 고도화하고 있습니다.");
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#F0F0F7', display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Noto Sans KR', sans-serif", overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ background: MAIN_COLOR, padding: '20px', borderRadius: '0 0 24px 24px', color: 'white', flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: 20 }}>←</div>
          <span style={{ fontSize: 15, fontWeight: 800 }}>주소 검색</span>
        </div>
        <div onClick={openPostcode} style={{ position: 'relative', cursor: 'pointer', background: 'white', padding: '13px 42px', borderRadius: 14, color: query ? '#1E1B4B' : '#9CA3AF', fontSize: 14 }}>
          {query || '도로명 주소를 입력하세요'}
        </div>
      </div>

      {/* ── 지도 영역: 화면의 약 65% 차지 ── */}
      <div style={{ flex: 1.8, width: '100%', position: 'relative', zIndex: 1 }}>
        <MapContainer center={mapCenter} zoom={13} style={{ width: '100%', height: '100%' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController center={mapCenter} />
          {selected && <Marker position={mapCenter} icon={customIcon} />}
        </MapContainer>
      </div>

      {/* ── 하단 카드 영역: 아래쪽으로 많이 내림 ── */}
      <div style={{
        flex: 1, background: 'white', borderTop: '1.5px solid #EDEDF8',
        borderRadius: '28px 28px 0 0', marginTop: '-20px', zIndex: 5,
        padding: '24px 20px 40px', boxShadow: '0 -8px 20px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {selected ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#1E1B4B' }}>{selected.main}</p>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6B7280' }}>{selected.sub}</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: MAIN_COLOR, background: '#EDEDF8', padding: '2px 10px', borderRadius: 20 }}>{selected.zonecode}</span>
            </div>
            <button onClick={handleConfirm} style={{ width: '100%', background: MAIN_COLOR, color: 'white', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              이 주소로 서류 분석하기
            </button>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <p style={{ color: '#9CA3AF', fontWeight: 600, fontSize: 14 }}>검색창에서 주소를 입력해 주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;
