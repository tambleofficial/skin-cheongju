document.documentElement.classList.add('js');

const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
}
const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);onScroll();addEventListener('scroll',onScroll,{passive:true});

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=[...document.querySelectorAll('.reveal, .service-card, .space-grid figure, .program, .guide-grid article, .route-list article')];
if('IntersectionObserver' in window&&!reduced){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -6%'});
  reveals.forEach(el=>{el.classList.add('reveal');io.observe(el)});
}else reveals.forEach(el=>el.classList.add('in-view'));

// Magnetic buttons, card spotlights, and tactile image tilt.
if(matchMedia('(pointer:fine)').matches&&!reduced){
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.055}px,${(e.clientY-r.top-r.height/2)*.08}px)`});
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });
  document.querySelectorAll('[data-spotlight]').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)}));
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*2.7}deg) rotateY(${x*3.5}deg) translateZ(0)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
}

// Home hero depth: copy and photo move at different rates while the WebGL form rotates.
const hero=document.querySelector('.hero-home');
const heroPhoto=document.querySelector('.hero-photo');
let heroProgress=0;
if(hero&&!reduced){
  const updateHero=()=>{const r=hero.getBoundingClientRect();heroProgress=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height)));if(heroPhoto)heroPhoto.style.setProperty('--scroll',heroProgress)};
  updateHero();addEventListener('scroll',updateHero,{passive:true});addEventListener('resize',updateHero,{passive:true});
}

// THREE.JS: interactive contour sculpture. Pointer movement steers it; drag adds inertia; scrolling opens the form.
(function initThree(){
  const mount=document.getElementById('refine-scene');
  if(!mount||!window.THREE||reduced)return;
  try{
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(38,Math.max(1,mount.clientWidth)/Math.max(1,mount.clientHeight),.1,100);
    camera.position.set(0,0,7.3);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    renderer.setSize(mount.clientWidth,mount.clientHeight);
    renderer.setClearColor(0x000000,0);
    mount.appendChild(renderer.domElement);

    const group=new THREE.Group();scene.add(group);
    const contourGroup=new THREE.Group();group.add(contourGroup);
    const haloGroup=new THREE.Group();group.add(haloGroup);

    // Layered face-line contours: each spline is a slightly different vertical section of the same volume.
    const contourMaterials=[];
    for(let i=0;i<30;i++){
      const z=(i-14.5)*.085;
      const side=(i-14.5)/14.5;
      const pts=[];
      const steps=112;
      for(let j=0;j<steps;j++){
        const t=j/(steps-1);
        const a=(t-.5)*Math.PI*1.72;
        const taper=1-Math.pow(Math.abs(t-.5)*1.58,2)*.23;
        const x=Math.sin(a)*1.32*taper + side*.18 + Math.sin(t*Math.PI*3+i*.11)*.025;
        const y=Math.cos(a)*1.92 - .06 + Math.sin(t*Math.PI*2)*.07;
        const depth=z + Math.cos(t*Math.PI*2+i*.08)*.11;
        pts.push(new THREE.Vector3(x,y,depth));
      }
      const curve=new THREE.CatmullRomCurve3(pts,false,'catmullrom',.42);
      const geo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(180));
      const mat=new THREE.LineBasicMaterial({color:i%4===0?0xbfd0ff:0x7894ff,transparent:true,opacity:.11+(1-Math.abs(side))*.18,depthWrite:false,blending:THREE.AdditiveBlending});
      contourMaterials.push(mat);
      contourGroup.add(new THREE.Line(geo,mat));
    }

    // Fine luminous particles describing the same silhouette.
    const count=1550;const positions=new Float32Array(count*3);const sizes=new Float32Array(count);
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2;
      const v=Math.random()*2-1;
      const r=1.24*(.88+.2*Math.cos(v*Math.PI*.5))*(.93+Math.random()*.13);
      positions[i*3]=Math.sin(a)*r*.84;
      positions[i*3+1]=v*1.82 + Math.sin(a*2)*.05;
      positions[i*3+2]=Math.cos(a)*r*.56 + (Math.random()-.5)*.12;
      sizes[i]=Math.random();
    }
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));pGeo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
    const pMat=new THREE.PointsMaterial({color:0xd7e1ff,size:.012,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending});
    const particles=new THREE.Points(pGeo,pMat);group.add(particles);

    // Halos give the form a precise, designed orbital motion rather than a generic sphere.
    [[2.35,.006,.28],[2.72,.004,.18],[3.08,.003,.12]].forEach(([radius,tube,opacity],i)=>{
      const geo=new THREE.TorusGeometry(radius,tube,6,220);
      const mat=new THREE.MeshBasicMaterial({color:i===0?0x9fb4ff:0x5675f2,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending});
      const ring=new THREE.Mesh(geo,mat);ring.rotation.set(1.08+i*.31,.18+i*.37,.48-i*.26);haloGroup.add(ring);
    });

    // Core glow shell.
    const coreGeo=new THREE.IcosahedronGeometry(1.42,5);
    const coreMat=new THREE.MeshBasicMaterial({color:0x526fe9,wireframe:true,transparent:true,opacity:.035,depthWrite:false,blending:THREE.AdditiveBlending});
    const core=new THREE.Mesh(coreGeo,coreMat);group.add(core);

    let targetX=.12,targetY=0,mx=targetX,my=targetY,dragX=0,dragY=0,isDown=false,lastX=0,lastY=0,pulse=0;
    const setPointer=(x,y)=>{const r=mount.getBoundingClientRect();targetX=((x-r.left)/Math.max(1,r.width)-.5);targetY=((y-r.top)/Math.max(1,r.height)-.5)};
    mount.addEventListener('pointermove',e=>{setPointer(e.clientX,e.clientY);if(isDown){dragY+=(e.clientX-lastX)*.0034;dragX+=(e.clientY-lastY)*.003;lastX=e.clientX;lastY=e.clientY}});
    mount.addEventListener('pointerdown',e=>{isDown=true;lastX=e.clientX;lastY=e.clientY;pulse=1;try{mount.setPointerCapture(e.pointerId)}catch(_){}});
    mount.addEventListener('pointerup',e=>{isDown=false;try{mount.releasePointerCapture(e.pointerId)}catch(_){}});
    mount.addEventListener('pointercancel',()=>isDown=false);

    const clock=new THREE.Clock();
    function render(){
      const t=clock.getElapsedTime();mx+=(targetX-mx)*.035;my+=(targetY-my)*.035;dragX*=.94;dragY*=.94;pulse*=.93;
      const mobile=innerWidth<820;
      group.position.x=mobile?.52:1.55;group.position.y=mobile?-.22:.05;
      const open=heroProgress||0;
      group.rotation.y=.26+t*.035+mx*.35+dragY+open*.42;
      group.rotation.x=.03+my*.15+dragX-open*.16;
      contourGroup.rotation.z=Math.sin(t*.18)*.035;
      contourGroup.scale.setScalar(1+pulse*.028);
      particles.rotation.y=-t*.018-open*.12;
      haloGroup.rotation.y=t*.025+mx*.12;
      haloGroup.rotation.z=-t*.012;
      core.rotation.y=t*.05;core.rotation.x=t*.025;
      contourMaterials.forEach((m,i)=>{m.opacity=(.105+(1-Math.abs((i-14.5)/14.5))*.17)*(1+pulse*.55)});
      camera.position.x=mx*.16;camera.position.y=-my*.08;
      renderer.render(scene,camera);requestAnimationFrame(render);
    }render();

    const resize=()=>{const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(w,h)};
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(mount);else addEventListener('resize',resize,{passive:true});
  }catch(err){mount.classList.add('three-failed')}
})();
