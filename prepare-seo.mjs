/** Cloudflare Pages: build command `node prepare-seo.mjs`, output `public`.
 * No packages, API calls, Workers or runtime server. SITE_URL overrides automatic pages.dev origin.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const config=JSON.parse(fs.readFileSync(path.join(root,'seo-config.json'),'utf8'));
const explicit=process.env.SITE_URL || config.siteUrl;
let base=explicit;
if(!base && process.env.CF_PAGES_URL){
 const deployment=new URL(process.env.CF_PAGES_URL);
 const labels=deployment.hostname.split('.');
 if(labels.length>=3 && labels.slice(-2).join('.')==='pages.dev') base='https://'+labels.slice(-3).join('.');
 else throw new Error('SITE_URL에 실제 대표 도메인을 입력하세요.');
}
if(!base) throw new Error('실제 사이트 주소가 필요합니다. Cloudflare Pages에서 실행하거나 SITE_URL 환경변수 또는 seo-config.json의 siteUrl을 설정하세요.');
const url=new URL(base);
if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('siteUrl은 경로 없는 전체 사이트 주소여야 합니다.');
base=url.origin;
const out=path.join(root,'public');fs.mkdirSync(out,{recursive:true});
// Only remove this script's generated files; preserve any unrelated local files.
for(const name of fs.readdirSync(out))if(name.endsWith('.html')||['sitemap.xml','rss.xml','robots.txt'].includes(name))fs.rmSync(path.join(out,name));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
const xml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const files=fs.readdirSync(root).filter(x=>x.endsWith('.html')).sort();
if(files.length!==5||!files.includes('index.html'))throw new Error('HTML 5개와 index.html이 필요합니다.');
const entries=[];
const sources=JSON.parse(fs.readFileSync(path.join(root,'image-sources.json'),'utf8'));
const allHtml=files.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const photoMap=[];
function dimensions(buf){
 if(buf.toString('ascii',0,4)!=='RIFF'||buf.toString('ascii',8,12)!=='WEBP')throw new Error('다운로드 파일이 실제 WebP가 아닙니다.');
 let offset=12;
 while(offset+8<=buf.length){
  const type=buf.toString('ascii',offset,offset+4);const len=buf.readUInt32LE(offset+4);const pos=offset+8;
  if(type==='VP8X')return [1+buf.readUIntLE(pos+4,3),1+buf.readUIntLE(pos+7,3)];
  if(type==='VP8L'){const bits=buf.readUInt32LE(pos+1);return [1+(bits&0x3fff),1+((bits>>>14)&0x3fff)];}
  if(type==='VP8 ')return [buf.readUInt16LE(pos+6)&0x3fff,buf.readUInt16LE(pos+8)&0x3fff];
  offset=pos+len+(len%2);
 }
 throw new Error('WebP 크기를 읽을 수 없습니다.');
}
for(const photo of sources){
 if(!allHtml.includes(xml(photo.webp_url)))continue;
 const cached=path.join(root,photo.local_file);let bytes;
 if(fs.existsSync(cached))bytes=fs.readFileSync(cached);
 else{
  const response=await fetch(photo.webp_url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error('사진 다운로드 실패: '+photo.local_file+' HTTP '+response.status);
  bytes=Buffer.from(await response.arrayBuffer());
 }
 const [width,height]=dimensions(bytes);
 if(!width||!height)throw new Error('잘못된 이미지 크기');
 fs.writeFileSync(path.join(out,photo.local_file),bytes);
 photoMap.push({remote:xml(photo.webp_url),local:photo.local_file,width,height});
}

for(const file of files){
 let content=fs.readFileSync(path.join(root,file),'utf8');
 for(const photo of photoMap){
  content=content.replace(/<img\b[^>]*>/g,tag=>tag.includes('src="'+photo.remote+'"')?tag.replace(photo.remote,photo.local).replace(/width="\d+"/,'width="'+photo.width+'"').replace(/height="\d+"/,'height="'+photo.height+'"'):tag);
 }

 // Cloudflare Pages redirects .html paths to extensionless URLs.
 const pageUrl=base+(file==='index.html'?'/':'/'+file.replace(/\.html$/,''));
 const title=decode(content.match(/<title>([\s\S]*?)<\/title>/i)[1]);
 const description=decode(content.match(/<meta name="description" content="([^"]*)"/)[1]);
 content=content.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<meta property="og:url"[^>]*>/g,'').replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g,'');
 const structured={'@context':'https://schema.org','@type':'BeautySalon','@id':base+'/#business','name':config.name,'url':base+'/','telephone':config.phone,'address':{'@type':'PostalAddress','streetAddress':config.address,'addressLocality':'청주시','addressRegion':'충청북도','addressCountry':'KR'},'sameAs':config.sameAs,'openingHoursSpecification':[{'@type':'OpeningHoursSpecification','dayOfWeek':['Monday','Tuesday','Wednesday','Thursday','Friday'],'opens':'10:00','closes':'20:00'},{'@type':'OpeningHoursSpecification','dayOfWeek':'Saturday','opens':'10:00','closes':'17:00'}]};
 content=content.replace('</head>',`<link rel="canonical" href="${xml(pageUrl)}"><meta property="og:url" content="${xml(pageUrl)}"><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script></head>`);
 fs.writeFileSync(path.join(out,file),content);
 entries.push({url:pageUrl,title,description});
}
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+entries.map(x=>`  <url><loc>${xml(x.url)}</loc></url>`).join('\n')+'\n</urlset>\n';
// A site-information feed, not invented blog posts or made-up publication dates.
const rss='<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>'+`<title>${xml(config.name)} · 홈페이지 안내</title><link>${xml(base+'/')}</link><description>브랜드와 관리 프로그램, 방문 안내를 담은 홈페이지 페이지 피드입니다.</description><language>ko-KR</language><atom:link href="${xml(base+'/rss.xml')}" rel="self" type="application/rss+xml"/>`+entries.map(x=>`<item><title>${xml(x.title)}</title><link>${xml(x.url)}</link><guid isPermaLink="true">${xml(x.url)}</guid><description>${xml(x.description)}</description></item>`).join('')+'</channel></rss>\n';
for(const [name,data] of [['sitemap.xml',sitemap],['rss.xml',rss],['robots.txt',`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`]])fs.writeFileSync(path.join(out,name),data);
console.log('완료: public/ — HTML 5개, sitemap.xml, rss.xml, robots.txt, canonical, BeautySalon 구조화 데이터');
