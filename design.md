# 팡슐랭 디자인 시스템

> **컨셉**: 오래된 동네 분식집 간판, 손글씨 메뉴판, 따뜻한 전등불의 감성
> **타겟**: 광운대 학생과 인근 주민이 편안하게 찾는, 친근한 동네 가이드
> **우선 플랫폼**: 📱 **모바일 웹 (Mobile-First)** — 90% 이상 모바일 접속 예상
> **키워드**: 따뜻함, 손맛, 친근함, 정겨움, 미슐랭의 위트 있는 변주

---

## 🎯 설계 원칙: Mobile-First

팡슐랭은 **학생들이 등하교 길에 한 손으로 사용하는 서비스**입니다.
모든 디자인 결정은 다음 가정에서 출발합니다:

- 📱 **한 손 조작**: 엄지손가락 하나로 모든 인터랙션 가능해야 함
- 🚶 **이동 중 사용**: 걸으면서도 빠르게 정보 파악 가능
- 📶 **불안정한 네트워크**: 지하철/건물 안에서 로딩 체감 속도 중요
- 🔋 **배터리 절약**: 무거운 애니메이션 지양
- ☀️ **실외 사용**: 직사광선에서도 읽히는 충분한 명도 대비

데스크톱은 "부가적 지원" 수준으로만 대응합니다.

---

## 1. 컬러 팔레트

### 1.1 Primary Colors (토마토 레드 계열)
분식집 간판, 김치찌개, 떡볶이 등 "따뜻한 한 끼"의 상징색

```css
--color-primary-50:  #FEF6F1;   /* 배경 틴트 */
--color-primary-100: #FBE5D7;   /* 호버 배경 */
--color-primary-200: #F5C4B3;   /* 서브 액센트 */
--color-primary-400: #E8765A;   /* 아이콘, 보조 버튼 */
--color-primary-500: #D85A30;   /* 메인 브랜드 컬러 ⭐ */
--color-primary-600: #B8431F;   /* 호버 상태 */
--color-primary-800: #712B13;   /* 진한 텍스트 (배경에 대비) */
--color-primary-900: #4A1B0C;   /* 가장 진한 텍스트 */
```

### 1.2 Accent Colors (머스터드 옐로우)
제휴 배지, 추천 마크, 포인트 강조

```css
--color-accent-50:  #FEF8ED;
--color-accent-100: #FAEEDA;
--color-accent-400: #EF9F27;   /* 제휴 배지 */
--color-accent-600: #BA7517;
--color-accent-800: #633806;   /* 제휴 배지 텍스트 */
```

### 1.3 Neutral (따뜻한 아이보리/베이지)

```css
--color-bg-canvas:    #FAF7F2;   /* 페이지 배경 (아이보리) */
--color-bg-surface:   #FFFFFF;   /* 카드 배경 */
--color-bg-muted:     #F5F1EA;   /* 섹션 배경 */
--color-bg-hover:     #EFEAE0;

--color-border:       #E8E1D3;
--color-border-strong:#D3C9B5;

--color-text-primary: #2C2620;   /* 본문 (진갈색) */
--color-text-body:    #4A3F35;
--color-text-muted:   #8A7D6E;
--color-text-subtle:  #B8A994;
```

### 1.4 Semantic Colors

```css
/* 영업중 */
--color-success-bg:   #EAF1D9;
--color-success:      #6B8E3D;
--color-success-dark: #3B5A1A;

/* 마감 */
--color-closed-bg:    #EFEAE0;
--color-closed:       #8A7D6E;

/* 제휴 */
--color-partner-bg:   #FAEEDA;
--color-partner:      #BA7517;
--color-partner-dark: #633806;

/* 제보/경고 */
--color-warn-bg:      #FEF3DC;
--color-warn:         #C67D0F;
```

### 1.5 ☀️ 실외 사용 대비 검증
- 모든 텍스트는 배경 대비 **WCAG AA 기준(4.5:1)** 이상
- 상태 배지는 **색상 + 텍스트 + 아이콘** 세 가지로 중복 전달 (색맹 고려)
- 중요 액션 버튼은 `--color-primary-500` 고정 사용 (대비 확실)

---

## 2. 타이포그래피

### 2.1 폰트 선정

```css
/* Display: 제목, 식당 이름 - 약간 클래식한 명조체 */
--font-display: 'RIDIBatang', 'Noto Serif KR', serif;

/* Body: 본문 - 편안한 고딕 */
--font-body: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;

/* Accent: 가격/숫자 - 개성 있는 산세리프 */
--font-accent: 'IBM Plex Sans KR', sans-serif;
```

### 2.2 📱 모바일 타이포그래피 스케일

**모바일에서는 데스크톱보다 약간 작은 스케일 사용** (화면 공간 효율):

```css
/* Display (앱 헤더, 페이지 제목) */
.text-display-xl  { font-size: 28px; line-height: 1.2;  font-weight: 700; font-family: var(--font-display); }
.text-display-lg  { font-size: 22px; line-height: 1.25; font-weight: 700; font-family: var(--font-display); }
.text-display-md  { font-size: 18px; line-height: 1.3;  font-weight: 600; font-family: var(--font-display); }

/* Headings */
.text-heading-lg  { font-size: 17px; line-height: 1.4;  font-weight: 600; }
.text-heading-md  { font-size: 15px; line-height: 1.4;  font-weight: 600; }
.text-heading-sm  { font-size: 14px; line-height: 1.5;  font-weight: 600; }

/* Body */
.text-body-lg     { font-size: 15px; line-height: 1.6;  font-weight: 400; }
.text-body-md     { font-size: 13px; line-height: 1.6;  font-weight: 400; }
.text-body-sm     { font-size: 12px; line-height: 1.5;  font-weight: 400; }
.text-caption     { font-size: 11px; line-height: 1.4;  font-weight: 500; letter-spacing: 0.02em; }

/* Price (강조) */
.text-price-lg    { font-size: 17px; font-weight: 700; font-family: var(--font-accent); color: var(--color-primary-500); }
.text-price-md    { font-size: 14px; font-weight: 600; font-family: var(--font-accent); color: var(--color-primary-500); }

/* 데스크톱 (≥1024px)에서 1~2px 업스케일 */
@media (min-width: 1024px) {
  .text-display-xl { font-size: 36px; }
  .text-display-lg { font-size: 28px; }
  .text-body-lg { font-size: 16px; }
  .text-body-md { font-size: 14px; }
}
```

### 2.3 ⚠️ iOS 줌 방지
iOS Safari는 **폰트 크기가 16px 미만인 input을 포커스하면 자동 줌**됩니다:

```css
/* 모든 input/textarea/select는 최소 16px */
input, textarea, select {
  font-size: 16px;
}
```

---

## 3. 📱 탭 타겟 및 간격

### 3.1 최소 탭 타겟 크기 (중요!)

```css
/* 모든 인터랙티브 요소 최소 44x44px (Apple HIG 기준) */
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Material Design은 48px 권장 - 주요 버튼에만 적용 */
.btn-primary {
  min-height: 48px;
}
```

### 3.2 🖐️ 엄지 영역 (Thumb Zone)

한 손으로 잡았을 때 엄지가 닿기 쉬운 영역을 고려한 배치:

```
┌─────────────────┐
│  🔴 Hard         │ ← 상단: 닿기 어려움 (정보 표시용)
│                 │
│  🟡 OK           │ ← 중단: 보통
│                 │
│  🟢 Natural      │ ← 하단: 가장 편함 (주요 액션)
│  🟢 Natural      │
└─────────────────┘
```

**배치 원칙**:
- **하단**: 주요 액션 버튼, 바텀 시트, 탭바
- **중단**: 콘텐츠 영역 (지도, 카드)
- **상단**: 헤더, 상태 표시 (보여주기만 하는 정보)

### 3.3 간격 시스템

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;

/* 모바일에서 터치 요소 간 최소 간격 */
--touch-gap: 8px;
```

### 3.4 Border Radius

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;    /* 바텀 시트, 모달 상단 */
--radius-full: 999px;
```

### 3.5 Shadow

```css
--shadow-sm:  0 1px 2px rgba(44, 38, 32, 0.04);
--shadow-md:  0 4px 8px rgba(44, 38, 32, 0.06), 0 2px 4px rgba(44, 38, 32, 0.04);
--shadow-lg:  0 8px 24px rgba(44, 38, 32, 0.08), 0 4px 8px rgba(44, 38, 32, 0.04);
--shadow-card:0 2px 6px rgba(44, 38, 32, 0.05);

/* 바텀 시트 전용 */
--shadow-sheet: 0 -4px 16px rgba(44, 38, 32, 0.08);
```

---

## 4. 📱 Safe Area 및 Viewport 처리

### 4.1 iPhone 노치/Dynamic Island 대응

```css
/* 전체 레이아웃 */
.app-container {
  min-height: 100dvh;  /* 주소창 숨겨질 때 고려 (svh/dvh 사용) */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 하단 고정 바텀 시트 */
.bottom-sheet {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* 상단 헤더 */
.app-header {
  padding-top: max(12px, env(safe-area-inset-top));
}
```

### 4.2 Viewport Meta Tag

`apps/web/app/layout.tsx`에 반드시 포함:

```tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,           // iOS 더블탭 줌 방지 (지도 UX에 중요)
  userScalable: false,       // 지도 핀치줌과 페이지 줌 충돌 방지
  viewportFit: 'cover',      // 노치 대응 필수
  themeColor: '#D85A30',     // 상단 상태바 색상
};
```

> ⚠️ `userScalable: false`는 접근성 논쟁이 있으나, **지도 앱에서는 지도 자체의 줌/팬이 핵심 UX**이므로 예외 적용이 일반적입니다. (카카오맵, 네이버맵도 동일)

---

## 5. 컴포넌트 스타일 가이드 (모바일 최적화)

### 5.1 버튼

**Primary**
```css
background: var(--color-primary-500);
color: white;
min-height: 48px;
padding: 12px 24px;
border-radius: var(--radius-md);
font-weight: 600;
font-size: 15px;
/* 터치 피드백 */
transition: transform 0.1s, background 0.2s;
}
.btn-primary:active {
  transform: scale(0.97);
  background: var(--color-primary-600);
}
```

**Pill (구역 선택)**
```css
min-height: 40px;
padding: 8px 16px;
border-radius: var(--radius-full);
/* 비활성 */
background: white;
border: 1px solid var(--color-border);
color: var(--color-text-body);
/* 활성 */
&.active {
  background: var(--color-primary-900);
  color: var(--color-primary-50);
  border-color: var(--color-primary-900);
}
```

### 5.2 📱 바텀 시트 (Bottom Sheet)

**가장 중요한 모바일 컴포넌트**. 카카오맵/배민 스타일로 구현:

```
상태:
1. 📌 Peek    (기본): 요약 카드 1개만 보임 (높이 ~120px)
2. 📋 Half    (중간): 리스트 3~5개 (높이 ~50vh)
3. 📖 Full    (전체): 전체 목록 (높이 ~90vh)

상호작용:
- 드래그 핸들(상단 36x4px 바)을 위아래로 드래그
- 배경 지도 터치 시 Peek로 복귀
- 뒤로가기 버튼으로 한 단계씩 축소
```

**스타일**:
```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-sheet);
  padding-bottom: env(safe-area-inset-bottom);
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 20;
}

.bottom-sheet__handle {
  width: 36px;
  height: 4px;
  background: var(--color-border-strong);
  border-radius: 999px;
  margin: 8px auto;
}
```

**라이브러리 추천**: `react-modal-sheet` 또는 `@chakra-ui/slide` 같은 것 대신, **Framer Motion**으로 직접 구현하는 게 깔끔합니다 (의존성 최소화).

### 5.3 식당 카드 (모바일 버전)

```
┌──────────────────────────────────────┐
│ [사진]  할매분식 [공대 제휴]          │
│ 52×52   ● 영업중 · 정문 2분 · ★ 4.6  │
│         치즈라면 4,500원              │
└──────────────────────────────────────┘
```

- 사진 52x52px (모바일용, 데스크톱은 64px)
- 패딩: 12px (데스크톱 16px보다 작게)
- 터치 영역 전체가 상세 페이지로 링크
- 탭 시 `active:bg-primary-50` 피드백

### 5.4 플로팅 액션 버튼 (FAB)

지도 우측에 배치하는 원형 버튼:

```css
.fab {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

배치:
- **현재 위치 버튼**: 우측 상단 (바텀 시트 위로 16px)
- **검색 버튼**: 우측 상단의 바로 위
- **제휴만 보기 토글**: 우측 중단 (선택사항)

### 5.5 상단 필터바 (모바일)

```
┌─────────────────────────────────────┐
│ [로고 팡슐랭]              [☰ 메뉴] │ ← 헤더
├─────────────────────────────────────┤
│ [ 정문 ] [ 후문 ] [ 광운대역 ]       │ ← 구역 (가로 3등분)
│ [한식][분식][영업중][~8천원] →      │ ← 기타 필터 (가로 스크롤)
└─────────────────────────────────────┘
```

- 구역 버튼은 **3등분 flex**: `display: flex; gap: 6px;` + `flex: 1`
- 기타 필터는 **가로 스크롤**: `overflow-x: auto; scrollbar-width: none;`
- 선택된 필터 개수를 헤더의 메뉴 아이콘에 배지로 표시

### 5.6 인풋 (폼)

```css
input, textarea, select {
  min-height: 48px;
  font-size: 16px;              /* iOS 줌 방지 */
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

input:focus {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px var(--color-primary-100);
  outline: none;
}
```

---

## 6. 📱 모바일 레이아웃 패턴

### 6.1 메인 지도 페이지

```
┌─────────────────────────┐
│  Safe Area (notch)      │
├─────────────────────────┤
│ [로고] 팡슐랭   [메뉴]  │ ← Header (56px)
├─────────────────────────┤
│ [정문][후문][광운대역]  │ ← Zone Tabs (48px)
│ [필터 가로 스크롤]      │ ← Filter Chips (40px)
├─────────────────────────┤
│                   [◎]   │
│                   [⌕]   │ ← Floating Actions
│      [지도]             │
│                         │
│     [📍 마커들]         │
│                         │
├─────────────────────────┤
│  ━━━━ (드래그 핸들)     │
│  [카드 미리보기]        │ ← Bottom Sheet (Peek)
├─────────────────────────┤
│  Safe Area (home bar)   │
└─────────────────────────┘
```

### 6.2 식당 상세 페이지

```
┌─────────────────────────┐
│ [←]                 [⋮] │ ← 상단 (뒤로/메뉴)
├─────────────────────────┤
│                         │
│      [대표 사진]        │ ← Hero (가로 = 세로 16:10)
│                         │
├─────────────────────────┤
│ 할매분식 [제휴][영업중] │
│ 분식 · ★ 4.6           │
├─────────────────────────┤
│ 📍 서울시 노원구...     │
│ ⏰ 월-금 09:00-22:00    │ ← 기본 정보
│ 📞 02-xxx-xxxx          │
├─────────────────────────┤
│ 메뉴                    │
│ [메뉴 카드들...]        │
├─────────────────────────┤
│ [ 길찾기 ]  [ 제보 ]    │ ← Sticky Bottom Bar
└─────────────────────────┘
```

- 하단에 **Sticky 액션 바** (길찾기 + 제보하기 버튼)
- 스크롤 시 상단 헤더에 식당 이름 나타남 (sticky + 페이드인)

### 6.3 제보 페이지

- **한 화면 = 한 질문** 원칙 (모바일에서 긴 폼 분할)
- 단계: ①제보 타입 → ②대상 식당 → ③수정 내용 → ④증빙 사진 → ⑤완료
- 각 단계 하단에 "다음" 버튼 (48px 높이)
- 상단에 진행 바 (1/5, 2/5...)

---

## 7. 🎭 디테일 & 마이크로 인터랙션

### 7.1 터치 피드백

**모든 인터랙티브 요소는 터치 즉시 시각 피드백**:

```css
button:active, [role="button"]:active {
  transform: scale(0.97);
  transition: transform 0.1s;
}

/* 리스트 아이템 */
.list-item:active {
  background: var(--color-primary-50);
}

/* 마커 탭 */
.marker:active {
  transform: rotate(-45deg) scale(1.15);
}
```

### 7.2 ⚠️ Hover 상태 주의

**모바일에는 hover가 없습니다**. Tailwind `hover:` 남발 금지:

```css
/* ❌ 나쁜 예 */
.card:hover { box-shadow: var(--shadow-md); }

/* ⭕ 좋은 예 - hover는 mouse 환경에서만 */
@media (hover: hover) {
  .card:hover { box-shadow: var(--shadow-md); }
}

.card:active {
  background: var(--color-bg-hover);  /* 모바일 터치 피드백 */
}
```

### 7.3 스크롤 및 제스처

- **지도**: 카카오맵 자체 제스처(핀치줌, 팬) 그대로
- **바텀 시트**: 수직 드래그로 Peek/Half/Full 전환
- **카드 리스트**: 상하 스크롤 (바텀 시트 안에서)
- **필터 칩**: 가로 스크롤 + `scroll-snap-type: x proximity`
- **뒤로가기**: iOS 스와이프 뒤로가기 지원 (Next.js router history)

### 7.4 애니메이션 최소화

**배터리/성능 고려, 과한 애니메이션 지양**:

- ⭕ 간단한 scale/opacity 트랜지션 (GPU 가속)
- ⭕ 바텀 시트 슬라이드 (핵심 UX)
- ⭕ 마커 bounce (선택 피드백)
- ❌ 배경 파티클, 무한 루프 애니메이션
- ❌ scroll-triggered 복잡한 애니메이션

**prefers-reduced-motion 대응**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.5 문구 톤앤매너

- ❌ "영업 종료" → ⭕ "오늘은 끝났어요"
- ❌ "필터 없음" → ⭕ "모든 식당 보기"
- ❌ "제휴 식당 등록" → ⭕ "여기 제휴 중이에요"
- ❌ "데이터 불러오는 중..." → ⭕ "맛있는 정보 가져오는 중"
- ❌ "제보 완료" → ⭕ "알려주셔서 고마워요!"
- ❌ "오류가 발생했습니다" → ⭕ "앗, 잠시 후 다시 시도해주세요"

---

## 8. 📱 성능 최적화 (모바일 네트워크 대응)

### 8.1 이미지

- Next.js `<Image />` 필수 사용
  - 자동 WebP 변환
  - 반응형 sizes 속성 필수 지정
  - `loading="lazy"` (뷰포트 밖 이미지)
  - 썸네일은 `placeholder="blur"` 적용
- 카드 썸네일: 최대 **100x100px @2x** (웹에서 200x200)
- Hero 이미지: 최대 **800x500** (모바일 기준)

### 8.2 초기 로드

- **LCP 2.5초 이내** 목표
- 카카오맵 SDK는 `next/script`의 `strategy="lazyOnload"` 또는 `afterInteractive`
- 관리자 페이지는 `dynamic import`로 초기 번들에서 제외
- Font는 `font-display: swap` + subset 사용

### 8.3 오프라인/약한 네트워크

- 로딩 스켈레톤 필수 (spinner 대신)
- API 응답 캐싱 (TanStack Query `staleTime: 5min`)
- 지도 타일은 카카오맵 자체 캐시에 의존
- PWA로 확장 고려 (Phase 5 이후)

### 8.4 번들 크기

- Tailwind JIT로 실제 사용하는 유틸리티만 번들링
- Lucide React는 개별 import (`import { MapPin } from 'lucide-react'`)
- Framer Motion 대신 CSS 애니메이션 우선 (필요한 곳에만 Motion)

---

## 9. 📱 브레이크포인트 전략

```css
/* 모바일 우선 - 기본 스타일은 모바일 */

/* 작은 모바일 (~360px) - iPhone SE 등 */
/* 기본 CSS가 여기 대응 */

/* 일반 모바일 (361px~) */
@media (min-width: 360px) { ... }

/* 큰 모바일 / 작은 태블릿 (640px~) */
@media (min-width: 640px) { ... }

/* 태블릿 (768px~) - 지도 + 카드 리스트 병렬 표시 검토 */
@media (min-width: 768px) { ... }

/* 데스크톱 (1024px~) - 좌측 리스트 + 우측 지도 */
@media (min-width: 1024px) { ... }
```

### 9.1 Tailwind 커스텀 브레이크포인트

```typescript
// tailwind.config.ts
theme: {
  screens: {
    'xs': '360px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
  },
}
```

### 9.2 레이아웃 전환 시점

- **~767px**: 모바일 — 바텀 시트 + 전체 화면 지도
- **768~1023px**: 태블릿 — 필요시 사이드 패널 검토, 기본은 모바일 레이아웃
- **1024px~**: 데스크톱 — 좌측 식당 리스트(380px) + 우측 지도

---

## 10. Tailwind 설정 예시

`apps/web/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        primary: {
          50: '#FEF6F1',
          100: '#FBE5D7',
          200: '#F5C4B3',
          400: '#E8765A',
          500: '#D85A30',
          600: '#B8431F',
          800: '#712B13',
          900: '#4A1B0C',
        },
        accent: {
          50: '#FEF8ED',
          100: '#FAEEDA',
          400: '#EF9F27',
          600: '#BA7517',
          800: '#633806',
        },
        canvas: '#FAF7F2',
        surface: '#FFFFFF',
        muted: '#F5F1EA',
        hover: '#EFEAE0',
        border: {
          DEFAULT: '#E8E1D3',
          strong: '#D3C9B5',
        },
        ink: {
          primary: '#2C2620',
          body: '#4A3F35',
          muted: '#8A7D6E',
          subtle: '#B8A994',
        },
      },
      fontFamily: {
        display: ['RIDIBatang', 'Noto Serif KR', 'serif'],
        body: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
        accent: ['IBM Plex Sans KR', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 6px rgba(44, 38, 32, 0.05)',
        md: '0 4px 8px rgba(44, 38, 32, 0.06), 0 2px 4px rgba(44, 38, 32, 0.04)',
        lg: '0 8px 24px rgba(44, 38, 32, 0.08), 0 4px 8px rgba(44, 38, 32, 0.04)',
        sheet: '0 -4px 16px rgba(44, 38, 32, 0.08)',
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
};

export default config;
```

---

## 11. Claude Code 프롬프트 (실전 구현용)

VSCode의 Claude Code에 컴포넌트 생성 요청 시 이 프롬프트를 함께 전달:

```
팡슐랭은 광운대 학생 대상 맛집 추천 웹서비스입니다.
📱 모바일 웹 우선으로 설계합니다 (90% 이상 모바일 접속).

디자인 컨셉: "따뜻한 대학가 분식집 감성 + 미슐랭의 위트"

컬러:
- 메인: primary-500 (#D85A30, 토마토 레드)
- 액센트: accent-400 (#EF9F27, 머스터드)
- 배경: canvas (#FAF7F2, 크림 아이보리)
- 텍스트: ink-primary (#2C2620, 진갈색)

폰트:
- 제목: font-display (RIDIBatang, 명조체)
- 본문: font-body (Pretendard)
- 가격/숫자: font-accent (IBM Plex Sans KR)

모바일 우선 원칙:
1. 최소 탭 타겟: 44x44px (주요 버튼 48px)
2. input/select/textarea는 font-size: 16px (iOS 줌 방지)
3. safe-area-inset 활용 (노치, 홈바 대응)
4. @media (hover: hover) 로 hover 스타일 감싸기
5. 애니메이션 최소화 (scale/opacity만, prefers-reduced-motion 대응)
6. 주요 액션은 화면 하단 (엄지 영역)
7. next/image로 이미지 최적화 필수

톤앤매너: 친근한 존댓말
- "영업 종료" → "오늘은 끝났어요"
- "데이터 로딩" → "맛있는 정보 가져오는 중"

Tailwind 설정(tailwind.config.ts)의 커스텀 토큰 활용.
Lucide React 아이콘 (stroke-width 1.75).

절대 피할 것:
- 고정 px 폭 (반응형 우선)
- Inter 폰트, 보라색 그라데이션, 흔한 AI 톤
- position: fixed의 잘못된 사용 (safe-area 무시)
- localStorage 사용 (artifact 환경에서 차단됨)
```

---

## 12. 📱 테스트 체크리스트

개발 중 모바일 관련 꼭 확인할 것:

### 12.1 실제 기기 테스트
- [ ] iPhone (Safari) - 가장 중요
- [ ] Android Chrome
- [ ] 노치 있는 기기 (iPhone X 이후)
- [ ] 큰 폰 (iPhone Pro Max) 및 작은 폰 (iPhone SE)

### 12.2 인터랙션
- [ ] 한 손으로 모든 주요 기능 접근 가능
- [ ] 탭 타겟이 손가락보다 큼 (44px+)
- [ ] 가로/세로 회전 시 레이아웃 깨지지 않음
- [ ] 키보드 올라왔을 때 input이 가려지지 않음
- [ ] 스크롤 시 상단 주소창 숨김 동작 정상

### 12.3 성능
- [ ] Lighthouse Mobile 점수 90+ 목표
- [ ] LCP < 2.5초
- [ ] 3G 환경에서도 사용 가능한 수준
- [ ] 이미지 지연 로딩 동작 확인

### 12.4 접근성
- [ ] 모든 탭 가능 요소에 aria-label 또는 명확한 텍스트
- [ ] 상태 변화를 색상 외에 텍스트/아이콘으로도 전달
- [ ] 실외(직사광선) 가독성 확인

---

## 13. 참고 레퍼런스

모바일 웹 UX를 참고할 만한 서비스:

- **카카오맵** 🥇 - 바텀 시트 UX의 표준
- **네이버 지도** - 필터 인터랙션, 상세 페이지 구조
- **배달의민족** - 카드 디자인, 친근한 톤앤매너
- **당근마켓** - 따뜻한 컬러, 한국어 UI 표준
- **요기요** - 빠른 시각 흐름, 가격 강조
- **오늘의집** - 바텀 시트 상세, 이미지 처리
- **Uber Eats** - 모바일 맵 + 리스트 전환

---

## 14. 다음 단계

1. [ ] 팀원에게 이 디자인 시스템 공유 및 방향성 합의
2. [ ] **로고 제작** (Figma 또는 Canva, SVG 권장)
3. [ ] **Figma에서 모바일 와이어프레임 확정**
   - 메인 지도 (Peek / Half / Full 3상태)
   - 식당 상세 (스크롤 전/후)
   - 제보하기 (5단계 플로우)
   - 관리자 대시보드 (태블릿 이상 최적화)
4. [ ] **Tailwind config + globals.css 셋업** (Phase 1에서)
5. [ ] **공통 컴포넌트 제작** 순서:
   - Button → Badge → Card → Input → BottomSheet → FilterBar
6. [ ] 실제 기기에서 수시로 테스트 (배포 전 필수)

---

*작성일: 2026-04-19*
*팡슐랭 디자인 시스템 v1.1 (모바일 우선)*