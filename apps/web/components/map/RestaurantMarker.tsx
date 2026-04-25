'use client';

import { useEffect, useRef } from 'react';

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
  const size = isSelected ? 36 : 30;
  const shadow = isSelected
    ? `0 0 0 4px ${color}40, 0 2px 8px rgba(0,0,0,0.3)`
    : '0 2px 6px rgba(0,0,0,0.25)';

  // 44px 최소 탭 영역을 위해 wrapper를 넉넉히
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
  ].join(';');

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
    'transition:box-shadow 0.2s,width 0.15s,height 0.15s',
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

    content.addEventListener('click', () => {
      onClickRef.current?.();
      content.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        content.style.transform = '';
      }, 200);
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
    content.addEventListener('click', () => {
      onClickRef.current?.();
      content.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        content.style.transform = '';
      }, 200);
    });

    overlayRef.current.setContent(content);
    contentRef.current = content;
  }, [isOpen, isPartner, isSelected]);

  return null;
}
