# THE RE:FINE V7 — 메인 + 세부페이지 7개

## 배포
압축을 해제하고 index.html, assets 등이 GitHub 저장소 최상위에 위치하도록 업로드합니다.
Cloudflare Pages: Framework preset = None / Build command = node prepare-seo.mjs / Build output directory = public / Root directory = 공란.
추가 npm 설치·API 키·환경변수는 필요 없습니다. 이후 GitHub push 시 다시 배포됩니다.
https://developers.cloudflare.com/pages/get-started/git-integration/

## 메뉴와 주소
Home / → index.html
About /about → about.html (브랜드 소개)
Service /service → service.html (프로그램)
Portfolio /portfolio → portfolio.html (관리 사례)
Space /space → space.html (매장 공간)
Guide /guide → guide.html (관리 가이드)
Blog /blog → blog.html (브랜드·공간·방문 이야기)
Contact /contact → contact.html (예약·위치)
Cloudflare Pages의 확장자 없는 주소와 로컬 HTML 링크 모두 사용 가능합니다.

## V7 변경
기존 portfolio.html의 공간 소개를 space.html로 이동.
기존 blog.html의 관리 가이드를 guide.html로 이동.
portfolio.html에는 독립적인 관리 사례 페이지 추가. 실제 고객 사례가 제공되지 않아 준비 중 상태로 구성했으며, 매장 사진을 고객 사례로 표시하지 않았습니다.
blog.html에는 브랜드·공간·첫 방문 안내 글 3개 추가. 글 카드를 누르면 같은 페이지의 해당 본문으로 이동합니다.
전 페이지 헤더·푸터·내부 링크·현재 메뉴 표시·canonical·OG·JSON-LD·사이트맵·RSS 수정.
기존 /portfolio 및 /blog는 새 독립 페이지 주소로 사용하므로 리디렉션하지 않습니다.
메인 레이아웃과 인터랙션, 쿨 화이트·블루 그레이·코발트·네이비 유지.

## 편집
공통 색상과 기존 세부페이지: assets/style.css
메인 디자인: assets/home.css / 메인 동작: assets/home.js
확장 메뉴와 새 페이지 스타일: assets/pages-extension.css
공통 동작: assets/site.js
관리 사례: portfolio.html의 pf-records 영역에 실제 공개 가능한 사례 추가.
블로그: blog.html의 journal-index 목록과 journal-articles 본문을 함께 추가하고 rss.xml에도 반영.
정적 사이트이므로 관리자 화면이나 자동 글 발행 기능은 포함하지 않습니다.

## 도메인 및 자료
원본 https://skin-cheongju.pages.dev 유지.
다른 도메인 사용 시 HTML canonical/OG/JSON-LD, sitemap.xml, robots.txt, rss.xml, seo-config.json의 주소를 변경하세요.
prepare-seo.mjs는 정적 파일 복사 전용으로 도메인을 자동 치환하지 않습니다.
기존 매장 사진·로고 재사용. 경쟁사 코드·사진·문구를 포함하지 않습니다.
Wanted Sans CDN 설정 유지. 원본 사진 출처: PHOTO-CREDITS.txt 및 image-sources.json.
