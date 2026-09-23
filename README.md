# 더리파인 V4 — Three.js / 모바일 최적화 리디자인

이번 버전은 이전 CSS 패치 누적 방식을 버리고 `assets/style.css`를 처음부터 하나의 스타일 시스템으로 다시 작성했습니다.

## 핵심 수정
- CSS 전면 재작성: 중복 미디어쿼리/상충 규칙 제거
- 모바일 820px / 560px 브레이크포인트 전용 레이아웃 재설계
- `word-break: keep-all`, 균형형 타이포, 모바일 전용 줄바꿈으로 한글 글자 중간 분리 최소화
- 홈 마퀴를 동일 그룹 2개가 이어지는 실제 무한 루프 구조로 변경
- Three.js 히어로 강화
  - 32~48겹 페이스 라인 컨투어
  - 3개의 3D orbital ribbon
  - 반투명 glass core + wireframe shell
  - 데스크톱 1,800 / 모바일 850 particle field
  - orbiting nodes
  - 마우스/드래그/스크롤 반응
  - 실제 더리파인 공간 사진을 Three.js shader plane으로 렌더링해 미세 왜곡/깊이감 적용
- 모바일에서는 고비용 요소를 줄이고 HTML 실제 공간 사진을 fallback으로 유지
- WebGL 또는 Three.js 로드 실패 시에도 기본 UI/사진이 정상 노출되는 구조
- iPhone safe-area를 위한 `viewport-fit=cover` 적용

## 배포
ZIP의 내용물을 웹 루트에 그대로 업로드하세요. `index.html`과 `assets/`가 같은 레벨이어야 합니다.

Three.js와 Wanted Sans는 CDN을 사용합니다. 배포 환경에서 외부 CDN 차단 정책이 있다면 해당 리소스만 별도 호스팅해야 합니다.
