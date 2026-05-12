'use client';

import { useEffect, useRef } from 'react';

// 탭(짧은 터치)과 스와이프(지도 드래그)를 구분해서 이벤트 등록
function attachTapHandler(el: HTMLElement, onTap: () => void) {
  let startX = 0;
  let startY = 0;

  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    const dx = Math.abs(e.changedTouches[0].clientX - startX);
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (dx < 10 && dy < 10) {
      e.stopPropagation();
      onTap();
    }
  });

  // 데스크톱 fallback
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onTap();
  });
}

interface RestaurantMarkerProps {
  map: kakao.maps.Map;
  lat: number;
  lng: number;
  isOpen: boolean;
  isPartner: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function buildContent(isOpen: boolean, isPartner: boolean, isSelected: boolean): HTMLElement {
  const color = isOpen ? '#D85A30' : '#8A7D6E';
  // 선택 시 핀 자체를 키우고(30→42), 흰 테두리+색 후광 2단으로 시각적 우선순위 부여
  const size = isSelected ? 42 : 30;
  const shadow = isSelected
    ? `0 0 0 3px white, 0 0 0 7px ${color}, 0 0 0 10px ${color}33, 0 6px 16px rgba(0,0,0,0.35)`
    : '0 2px 6px rgba(0,0,0,0.25)';

  // 44px 최소 탭 영역을 위해 wrapper를 넉넉히
  // 선택된 마커가 다른 마커 위에 떠 보이도록 z-index 상향
  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:flex-end',
    'cursor:pointer',
    'min-width:44px',
    'min-height:44px',
    'padding-bottom:2px',
    'transition:transform 0.15s ease',
    isSelected ? 'transform:translateY(-4px)' : '',
    isSelected ? 'z-index:10' : 'z-index:1',
    'position:relative',
  ].filter(Boolean).join(';');

  const pin = document.createElement('div');
  pin.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    'border-radius:50% 50% 50% 0',
    'transform:rotate(-45deg)',
    `background:${color}`,
    'display:flex',
    'align-items:center',
    'justify-content:center',
    `box-shadow:${shadow}`,
    'transition:box-shadow 0.2s,width 0.2s,height 0.2s',
  ].join(';');

  if (isPartner) {
    const star = document.createElement('span');
    star.style.cssText = `transform:rotate(45deg);font-size:${Math.round(size * 0.4)}px;color:#EF9F27;line-height:1`;
    star.textContent = '★';
    pin.appendChild(star);
  }

  wrapper.appendChild(pin);

  if (isPartner) {
    const label = document.createElement('div');
    label.style.cssText = [
      `font-size:10px`,
      `color:${color}`,
      'font-weight:600',
      'margin-top:2px',
      'white-space:nowrap',
      "font-family:Pretendard,sans-serif",
    ].join(';');
    label.textContent = '제휴';
    wrapper.appendChild(label);
  }

  return wrapper;
}

export function RestaurantMarker({
  map,
  lat,
  lng,
  isOpen,
  isPartner,
  isSelected = false,
  onClick,
}: RestaurantMarkerProps) {
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  // 오버레이 생성 (좌표 변경 시 재생성)
  useEffect(() => {
    const position = new window.kakao.maps.LatLng(lat, lng);
    const content = buildContent(isOpen, isPartner, isSelected);

    attachTapHandler(content, () => {
      onClickRef.current?.();
      content.style.transform = 'translateY(-6px)';
      setTimeout(() => { content.style.transform = ''; }, 200);
    });

    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content,
      map,
      yAnchor: 1.0,
      clickable: true,
    });

    overlayRef.current = overlay;
    contentRef.current = content;

    return () => {
      overlayRef.current?.setMap(null);
      overlayRef.current = null;
      contentRef.current = null;
    };
  }, [map, lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // 선택/영업 상태 변경 시 content만 교체
  useEffect(() => {
    if (!overlayRef.current) return;

    const content = buildContent(isOpen, isPartner, isSelected);
    attachTapHandler(content, () => {
      onClickRef.current?.();
      content.style.transform = 'translateY(-6px)';
      setTimeout(() => { content.style.transform = ''; }, 200);
    });

    overlayRef.current.setContent(content);
    contentRef.current = content;
  }, [isOpen, isPartner, isSelected]);

  return null;
}
