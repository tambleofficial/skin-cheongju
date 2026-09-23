# THE RE:FINE — V5 Interactive Brand Renewal

정식 런칭용 더리파인 에스테틱 리뉴얼 버전입니다.

## 이번 리뉴얼 방향

- 경쟁사 페이지의 **인터랙션 원리만 참고**하고 레이아웃·색감·카피·그래픽은 더리파인 브랜드 기준으로 새로 설계했습니다.
- 브랜드 컬러: Deep Navy / Refine Cobalt / Warm Ivory
- 서체: Wanted Sans Variable CDN + 시스템 산세리프 폴백
- 명조·필기체·이탤릭 사용 없음

## 핵심 인터랙션

1. Hero Three.js
   - 얼굴선을 추상화한 다층 contour sculpture
   - orbital ribbon / particle atmosphere / glass core
   - pointer movement / drag / scroll 반응
   - 실제 매장 사진 3장 자동 크로스페이드

2. Kinetic typography
   - PERSONAL / CURATION / RE:FINE 대형 타이포가 스크롤 위치에 따라 서로 다른 속도로 이동

3. Curated Care Index
   - 프로그램 행 hover 시 실제 매장 이미지가 커서를 따라다니는 preview
   - 모바일에서는 hover UI를 제거하고 링크 중심으로 단순화

4. Process Morph Lab
   - 두 번째 Three.js scene
   - ANALYZE → SEQUENCE → REFINE 단계에 맞춰 3D particle form이 실시간 morph
   - 스크롤에 따라 단계 자동 활성화

5. Spatial Gallery
   - drag / swipe 가능한 실제 공간 이미지 rail
   - 모바일 scroll-snap 대응

6. Responsive system
   - 900px / 560px 기준 별도 모바일 레이아웃
   - 하단 전화/예약 quick action
   - viewport safe-area 대응
   - `word-break: keep-all` 기반 한글 단어 분리 방지
   - `prefers-reduced-motion` 대응

## 배포

압축을 풀었을 때 아래 파일이 웹 루트에 위치하면 됩니다.

- index.html
- about.html
- service.html
- portfolio.html
- contact.html
- blog.html
- assets/

Three.js는 jsDelivr CDN을 사용합니다. CDN을 사용할 수 없는 환경에서도 기본 레이아웃과 실제 매장 사진은 그대로 노출되도록 fallback 처리되어 있습니다.

## 검증

- JavaScript `node --check` 통과
- CSS `tinycss2` parse error 0
- CSS 중괄호 pair 검증 완료
- HTML 로컬 asset/link 누락 0
- 중복 id 검사 완료

## SEO

기존 청주 가경동 피부관리 중심 title / description / schema / sitemap 구조를 유지했습니다.
정식 도메인 연결 시 canonical, og:url, sitemap.xml 내 `skin-cheongju.pages.dev` 주소를 실제 도메인으로 변경하세요.
