# THE RE:FINE — Editorial Renewal

## GitHub + Cloudflare Pages 배포
1. 압축 해제 후 index.html과 assets 폴더 등이 GitHub 저장소 최상위에 위치하도록 업로드합니다. ZIP 파일 자체를 업로드하는 방식이 아닙니다.
2. Cloudflare Pages에서 해당 GitHub 저장소를 연결합니다.
3. 설정: Framework preset = None / Build command = node prepare-seo.mjs / Build output directory = public / Root directory = 공란.
4. 배포 URL을 확인합니다. 이후 GitHub push 시 다시 배포됩니다.
별도 npm 설치, API 키, 환경변수는 필요 없습니다. 기존 node prepare-seo.mjs / public 설정과 호환됩니다.
공식 안내: https://developers.cloudflare.com/pages/get-started/git-integration/
https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## 페이지
메인 index.html
기존 세부페이지 5개 유지: about.html, service.html, portfolio.html, contact.html, blog.html
404, 사이트맵, RSS, 네이버 인증 파일 유지. 중복 미리보기 index-local.html / test.html 제외.

## 변경 사항
메인 HTML 및 메인 전용 assets/home.css, assets/home.js 새로 제작.
네이비·코발트 유지, 메인 아이보리를 쿨 화이트(#F7F9FF)·블루 그레이(#EAF0FC)로 변경. 기존 매장 사진 유지.
아치형 히어로, 비대칭 소개, 프로그램 아코디언과 이미지 연동, 공간 갤러리, 예약 안내.
메인 Three.js 의존성을 제거하고 선택·드래그·스크롤 인터랙션 적용.
키보드 탐색, 모바일 스와이프, 동작 줄이기 설정 지원.
세부페이지 5개와 기존 공통 CSS/JS 원본 유지.

## 수정 위치
문구/연락처: 각 HTML. 메인 디자인: assets/home.css. 상호작용: assets/home.js.
사진: assets/images. 프로그램 사진: index.html의 details data-image 속성.
프로그램 링크: service.html#face / #skin / #decollete.

## 도메인
원본 https://skin-cheongju.pages.dev 유지.
다른 도메인 사용 시 HTML canonical/OG/JSON-LD, sitemap.xml, robots.txt, rss.xml, seo-config.json의 해당 주소를 변경하세요.
prepare-seo.mjs는 정적 파일 복사 전용이며 도메인을 자동 치환하지 않습니다.

## 디자인 출처
경쟁사 HTML은 콘텐츠 구획과 탐색 방식 참고에만 사용.
경쟁사 코드·문구·로고·사진은 배포본에 포함하지 않았습니다.
메인 배치 및 CSS/JS는 새로 작성했습니다.
기존 사진 및 폰트 출처는 PHOTO-CREDITS.txt, image-sources.json, assets/style.css 참고.

## 검증
- JavaScript 구문 검사 통과, 브라우저 실행 오류 없음.
- 320 / 390 / 768 / 1024 / 1440px 가로 넘침 없음.
- 모바일 메뉴 열기 및 Escape 닫기 확인.
- 프로그램 선택 후 사진 전환 확인.
- 로컬 파일·링크·앵커 누락 및 중복 ID 없음.
- 기존 세부페이지 5개 및 공통 CSS/JS 원본 바이트 동일.
- prepare-seo.mjs 빌드 완료 확인.
- preview 폴더에 PC·모바일 첫 화면 미리보기 포함 (빌드 산출물에서는 제외).
- 서체는 원본 Wanted Sans CDN 설정 유지. 검증 환경에서는 동일 폰트 파일을 내려받아 표시 확인.

## V6.1 색상 수정
메인 배경·헤더·갤러리·모바일 메뉴·전화 버튼의 아이보리 색상만 브랜드 계열의 쿨 화이트와 블루 그레이로 변경했습니다. HTML·JS·세부페이지·배치·인터랙션은 V6과 동일합니다.
