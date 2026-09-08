# 03-private — 빌드 없는 정적 홈페이지

Cloudflare: Framework None / Build command 비우기 / Build output directory / / Root directory 비우기.
기존 Build command의 node prepare-seo.mjs와 출력 폴더 public 설정을 반드시 지웁니다.
기존 저장소의 prepare-seo.mjs, seo-config.json, image-sources.json 및 예전 public 폴더(있다면)는 새 구성에서 사용하지 않습니다. 네이버 확인 파일은 삭제하지 않습니다.

홈페이지 폴더 내부 파일과 assets 폴더를 저장소 최상단에 올립니다. README.md와 BLOG-POST-TEMPLATE.txt는 운영 참고 자료이며 웹사이트 실행에 필요하지 않습니다.

## 블로그 추가·수정

1. 제공된 BLOG-POST-TEMPLATE.txt를 복사해 원하는 영문 파일명의 .html로 저장합니다.
2. 글 제목, 글 요약, 본문, POST-SLUG를 실제 값으로 수정합니다. title, description, canonical, OG, BlogPosting의 제목·요약·URL을 동일하게 맞춥니다. 날짜를 넣을 경우 실제 작성·수정 날짜만 사용합니다.
3. GitHub에 blog/파일명.html로 올립니다. 다른 폴더 또는 최상단도 가능하며 링크·canonical·스키마 URL을 실제 경로에 맞춥니다.
4. blog.html의 post-list 안에 제목 링크와 요약을 추가합니다.
5. sitemap.xml에 새 URL을 추가하고 rss.xml에도 새 글 item을 추가합니다. Cloudflare의 .html 없는 대표 URL에 맞춥니다.
6. 기존 글 수정은 동일 경로에 덮어씁니다. 글 삭제·파일명 변경 시 목록, sitemap, RSS의 관련 주소도 변경합니다.

HTML 개수나 수정 횟수를 검사하는 코드는 없습니다. Cloudflare 플랫폼 자체의 파일 수·용량·배포 한도는 적용됩니다.
목록·사이트맵·RSS를 자동 생성하는 스크립트는 없습니다. 위 XML 변경은 배포 성공 여부와 무관합니다.
네이버 확인 HTML은 받은 이름·내용 그대로 최상단에 추가하면 됩니다. sitemap/RSS에는 넣지 않습니다.
사진은 기존 Pexels 외부 URL을 유지합니다. 배포 중 이미지 다운로드는 실행하지 않습니다.
적용된 대표 주소: https://skin-cheongju.pages.dev
다른 도메인에 배포하려면 HTML의 canonical·OG·JSON-LD와 sitemap.xml·rss.xml·robots.txt의 대표 주소를 함께 변경해야 합니다.

## 새 글 XML 예시

sitemap.xml의 </urlset> 바로 앞:
```xml
<url><loc>https://skin-cheongju.pages.dev/blog/새-파일명</loc></url>
```

rss.xml의 </channel> 바로 앞:
```xml
<item><title>글 제목</title><link>https://skin-cheongju.pages.dev/blog/새-파일명</link><guid isPermaLink="true">https://skin-cheongju.pages.dev/blog/새-파일명</guid><description>글 요약</description></item>
```
XML 텍스트에 & 기호를 쓰면 &amp;로 작성합니다.

기존 GitHub 파일에 덮어쓰는 것만으로 예전 파일이 삭제되지는 않습니다. prepare-seo.mjs 등 이전 전용 파일은 별도로 삭제하세요. 네이버 인증 HTML과 직접 추가한 글은 보존하세요.

새 게시글의 SEO는 각 글의 제목·설명·본문과 구조화 데이터를 실제 내용에 맞춰 작성해야 합니다. HTML 수를 제한하는 프로그램은 없지만 호스팅 서비스의 자체 한도는 적용됩니다.
