# 더리파인 홈페이지 5종 전체 코드 — 최신 수정본

## 최신 수정: 파비콘·사이트 이름·관리 표현

파비콘 3종을 모든 페이지에 연결했습니다: assets/favicon.ico(16·32·48·64px), assets/favicon-96.png, assets/apple-touch-icon.png(180px). 로고 원본 비율과 색을 유지했습니다. 검색결과 파비콘 노출은 검색엔진 재수집이 필요하며 보장되지 않습니다.

사이트 이름은 1·2번 청주피부관리 / 3번 가경동 피부관리 / 4·5번 청주 에스테틱입니다. 화면 헤더, og:site_name, application-name에 반영하고 배포 빌드에서 WebSite name·alternateName·url을 생성합니다. 업체명은 더리파인 에스테틱으로 유지합니다. 일반적인 지역·업종 키워드는 Google이 사이트 이름으로 선택하지 않을 수 있으며 표시를 강제할 수 없습니다.

윤곽·압출·아쿠아필 명칭은 유지하되 미용 목적의 케어·관리로 설명했습니다. 치료·구조 교정·지방 제거 효과를 광고하지 않습니다. 관련 단어는 의료 시술을 제공하지 않는다는 한계 설명에만 등장합니다. 홈페이지 문구만으로 실제 서비스의 적법성이 확보되는 것은 아닙니다. 실제 사용 도구·기기·제품·관리 행위가 피부미용업 범위에 맞는지 운영자가 확인해야 하며, 본 파일은 법률 검토 완료나 무위반 보증을 의미하지 않습니다. 특히 압출의 실제 방법은 자격 있는 전문가에게 확인하세요.

검사: 25페이지 파비콘 경로와 파일, 아이콘 크기, WebSite 이름, RSS 5항목 및 설정 변경 검사 통과. 배포 결과 검사는 이미지 테스트 응답을 사용했으며 실제 이미지 다운로드·Cloudflare 배포 완료 검사가 아닙니다. 이번 문구 수정 후 25페이지 전체 시각 재검수는 하지 않았습니다.

근거: https://developers.google.com/search/docs/appearance/site-names
https://developers.google.com/search/docs/appearance/favicon-in-search
https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=3&cciNo=1&cnpClsNo=2&csmSeq=1012&popMenu=ov

## 이번 수정

- 사이트별 Home / About / Service / Portfolio / Contact, 총 25페이지 유지.
- 메타 타이틀·설명·H1·서비스를 최신 케어 중심 문구로 통일. 윤곽·아쿠아필·압출 관리명 유지.
- 인물 사진 전부 제거. 용기·크림·타월·화병·꽃·공간 등 7종의 무료 Pexels 사진으로 변경.
- 모든 페이지에 PC 우측 하단 / 모바일 하단 고정 전화·예약 버튼. 전화번호가 끊어지지 않도록 두 줄 구성.
- 예약 링크는 https://map.naver.com/p/entry/place/2037698163 으로 통일.
- sitemap.xml, rss.xml 및 푸터 링크와 RSS 자동 발견 태그 추가.
- 배포 빌드에서 실제 대표 주소 기준 canonical, og:url, BeautySalon 구조화 데이터, 사이트맵, RSS, robots 생성.

## 중요: 이번 ZIP은 빌드 설정 두 칸이 필요합니다

기존에는 HTML 파일만 올리는 구조였지만, 이번에는 실제 배포 주소 반영과 사진 저장을 위해 작은 빌드 스크립트를 포함했습니다. 서버·데이터베이스·유료 API는 사용하지 않습니다. 최종 public/은 HTML·CSS·JS·이미지·XML·TXT만 있는 정적 사이트입니다.

**사이트별 ZIP을 풀고 내용 전체를 각각의 GitHub 저장소 최상단에 올립니다.**

Cloudflare Pages의 해당 프로젝트 빌드 설정을 다음처럼 지정하세요.

| 항목 | 값 |
|---|---|
| 프레임워크 | None |
| 빌드 명령 | `node prepare-seo.mjs` |
| 빌드 출력 디렉터리 | `public` |
| 루트 디렉터리 | 저장소 최상단이면 비워 둠 |

빌드 명령을 비우거나 출력 디렉터리를 저장소 루트로 지정하면 안 됩니다. 루트의 sitemap.xml과 rss.xml은 **배포 준비용 파일**이며 검색엔진 제출용 완성 파일이 아닙니다. 스크립트가 public/에 완성 파일을 생성합니다.

무료 pages.dev 주소를 쓰면 Cloudflare가 제공한 CF_PAGES_URL에서 프로젝트의 고정 주소를 구합니다. 매 배포마다 바뀌는 해시 주소는 대표 주소로 사용하지 않습니다. 커스텀 도메인을 사용할 때는 `seo-config.json`의 `siteUrl` 또는 Cloudflare 환경변수 `SITE_URL`에 실제 대표 주소를 넣으세요. 사용자 설정 주소가 자동 감지보다 우선합니다. http(s)와 도메인만 입력하며 하위 경로는 지원하지 않습니다.

프로젝트마다 별도 저장소·Pages 프로젝트를 사용하세요. 전체 ZIP의 dist/ 안에는 5개 사이트별 폴더가 있습니다. dist 전체를 하나의 사이트로 업로드하는 방식이 아닙니다.

## 사이트맵·RSS 확인

빌드 성공 후 해당 사이트 주소 뒤에 `/sitemap.xml`, `/rss.xml`, `/robots.txt`를 붙여 확인하세요. 홈페이지 푸터의 사이트맵·RSS 링크로도 열 수 있습니다.

사이트맵에는 실제 페이지 5개의 절대 주소가 들어갑니다. Cloudflare Pages의 HTML 주소 정리 방식에 맞춰 index.html은 `/`, 서브페이지는 `.html`을 제외한 주소로 canonical과 사이트맵·RSS를 통일합니다. 내부 HTML 파일 연결은 원래 파일명을 유지합니다.

RSS는 블로그 글 피드가 아니라 **현재 홈페이지 5페이지의 안내 피드**입니다. 가짜 게시글·발행일·후기는 만들지 않았습니다. 본문·제목 수정 후 다시 빌드하면 피드 설명도 갱신됩니다. 검색엔진의 색인이나 순위를 보장하는 기능은 아닙니다.

## 메인 페이지 메타 타이틀

1. 청주피부관리 | 맞춤 앰플·피부 컨디션 케어 | 더리파인
2. 청주피부관리 | 모공·아쿠아필·여드름 압출 관리 | 더리파인
3. 가경동 피부관리 | 청주터미널 프라이빗 에스테틱 | 더리파인
4. 청주 에스테틱 | 윤곽·이중턱·얼굴 탄력 피부관리 | 더리파인
5. 청주 에스테틱 | 웨딩·신부·데콜테 피부관리 | 더리파인

메타 설명·본문은 최신 요청에 맞춰 미용 목적의 케어와 관리를 중심으로 함께 수정했습니다.

## 사진 상태와 사용 조건

7종의 사진이 브라우저에서 표시되는 것과 인물이 없는 내용을 확인했습니다. 다른 브랜드명이 크게 보이는 사진은 제외했습니다. **현재 작업 환경에서는 사진 원본을 로컬 파일로 다운로드하지 못했습니다.** 따라서 ZIP에는 로고 파일과 사진 출처·다운로드 설정이 포함되어 있으며, 새 사진의 로컬 WebP 파일은 Cloudflare 빌드에서 확보합니다.

스크립트는 HTTPS로 사진을 다운로드하고 실제 WebP 시그니처와 크기를 확인한 뒤 public/assets/images/에 저장합니다. HTML 경로와 이미지 width/height도 실제 파일에 맞춰 바꿉니다. 다운로드 또는 형식 확인에 실패하면 깨진 사진을 배포하지 않고 빌드를 실패 처리합니다. **실제 Cloudflare에서 이 다운로드가 성공하는지는 아직 확인하지 못했습니다.**

빌드 전 루트 HTML 미리보기는 외부 이미지 주소로 표시됩니다. public/ 생성이 성공한 뒤에는 사진도 로컬 정적 파일로 제공됩니다. 사진을 브랜드의 실제 사용 제품·매장으로 표시하지 않았습니다. 이미지별 정확한 출처와 Pexels 라이선스는 image-sources.json에 있습니다.

## 전화번호·링크·업체 정보 수정

전체 ZIP → source/site-config.json → common에서 수정합니다.

- phone: 연결용 숫자 `050713148454`
- phoneDisplay: 표시용 `0507-1314-8454`
- name / intro / address / hours: 업체명·소개·주소·영업시간
- links → place: 네이버 플레이스. 플로팅 예약 버튼에 사용.
- links → reservation: 본문 예약 버튼. 현재 같은 플레이스 주소.
- links → instagram / kakao / map / other: 기타 링크. 빈 값은 숨김.

대표 정보 수정 후 source/에서 `python build.py`를 실행하면 5개 사이트와 모든 관련 페이지에 반영됩니다. Python 3만 필요하며 추가 패키지는 필요 없습니다.

## 사진 교체

source/site-config.json → sites → 해당 id → images에서 home / about / gallery0~2를 수정합니다.

현재 path는 외부 원본 다운로드 URL이며 빌드에서 로컬로 바뀝니다. 직접 보유한 WebP를 넣으려면 source/assets/images/에 저장한 뒤 path를 `assets/images/사진명.webp`로 변경하세요. alt와 position, 실제 width/height도 입력합니다. position의 `50% 30%`처럼 두 번째 비율을 낮추면 위쪽을 더 보여줍니다. 파일 확장자만 바꾸지 말고 실제 WebP를 사용하세요.

같은 경로의 사진을 교체하면 그 파일을 사용하는 페이지가 함께 바뀝니다. 다른 사이트·용도만 바꾸려면 새 이름으로 저장하고 해당 설정만 변경하세요.

## 로고·디자인 수정

로고: source/assets/images/logo.webp 교체 또는 common.logo 경로 수정. 원본 비율을 유지합니다.

source/style.css의 :root:

- --brand: 주조색 #1e3fc2
- --ink / --muted: 본문·설명 색
- --paper / --soft: 배경
- --font / --serif: 시스템 글꼴
- --button-radius: 버튼 모양

.v1~.v5 규칙은 사이트별 배치입니다. 파일 끝의 v2 규칙은 지속 문의 버튼과 모바일 보완입니다. 사진 원본 색이나 로고 색은 바꾸지 않았습니다.

## 페이지 이름·본문·SEO 수정

source/site-config.json의 common.menu에서 label과 file을 수정합니다. key는 그대로 두고 index.html은 유지합니다. 파일명은 영문 소문자·숫자·하이픈과 .html만 사용하세요. 빌드하면 메뉴와 내부 링크가 함께 변경됩니다. 저장소에서는 옛 HTML도 삭제해 주세요.

sites의 meta / hero / heroDescription / services / story 등을 수정하면 사이트별 본문이 바뀝니다. 공통 FAQ와 방문 동선 등은 source/build.py의 해당 함수에서 수정합니다.

## 다시 배포

1. source 설정·템플릿을 수정합니다.
2. source에서 `python build.py`를 실행합니다.
3. dist/ 안 해당 사이트 폴더 내용을 GitHub 저장소에 반영합니다.
4. Cloudflare가 `node prepare-seo.mjs`로 public/을 새로 만듭니다.
5. 빌드 성공 후 실제 화면과 sitemap.xml·rss.xml을 확인합니다.

로컬에서 최종 public/을 만들려면 해당 사이트 폴더의 seo-config.json에 실제 siteUrl을 입력한 뒤 `node prepare-seo.mjs`를 실행합니다. 이 작업에는 사진 다운로드를 위한 네트워크가 필요합니다.

## 검수한 범위

- 25개 HTML, 5페이지씩 구성, index.html, 고유 title/H1, 내부 링크, 플로팅 연락처·플레이스 URL, 빈 링크 숨김, 새 탭 보안 속성 검사.
- 중앙 설정의 전화번호·서비스 파일명을 임시 변경해 모든 페이지에 반영되는지 검사 후 복원.
- 테스트용 주소와 명시적인 이미지 테스트 응답으로 5개 사이트의 사이트맵/RSS 5항목, canonical, 구조화 데이터, WebP 검사·로컬 경로 치환 절차 검사. 실제 다운로드 성공 검사가 아닙니다.
- 1번 사이트의 모바일 프레임(콘텐츠 폭 360px)에서 가로 넘침 없음 및 메뉴 동작 확인. 전화번호 줄바꿈 문제를 확인해 번호를 한 줄로 유지하도록 수정.
- 4번 사이트 PC 화면에서 플로팅 버튼과 레이아웃 확인.
- 7종의 교체 사진 내용을 브라우저에서 확인.
- 25페이지 전체에 대한 PC·모바일 실기기 검수, 실제 전화 연결·예약 완료, Cloudflare 실제 배포는 수행하지 않았습니다.

## 참고 문서

- 절대 URL 사이트맵: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Cloudflare 빌드 설정·CF_PAGES_URL: https://developers.cloudflare.com/pages/configuration/build-configuration/
- 사진 라이선스: https://www.pexels.com/license/
