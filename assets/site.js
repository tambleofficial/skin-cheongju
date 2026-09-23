(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  /* header + menu */
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }

  /* reveal */
  const revealTargets = [...document.querySelectorAll('.reveal, .program, .principle-grid article, .gallery-shell figure, .route-list article, .guide-grid article')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7%' });
    revealTargets.forEach((el) => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* magnetic controls */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.magnetic, .btn').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.055;
        const y = (e.clientY - r.top - r.height / 2) * 0.075;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* hero image cycle */
  const heroShots = [...document.querySelectorAll('.hero-shot')];
  const heroCounter = document.querySelector('.hero-slider-ui .current');
  if (heroShots.length > 1 && !reducedMotion) {
    let index = 0;
    window.setInterval(() => {
      heroShots[index].classList.remove('is-active');
      index = (index + 1) % heroShots.length;
      heroShots[index].classList.add('is-active');
      if (heroCounter) heroCounter.textContent = String(index + 1).padStart(2, '0');
    }, 4800);
  }

  /* kinetic typography */
  const kinetic = [...document.querySelectorAll('[data-kinetic]')];
  if (kinetic.length && !reducedMotion) {
    let ticking = false;
    const updateKinetic = () => {
      const vh = window.innerHeight || 1;
      kinetic.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        const progress = (vh - r.top) / (vh + r.height);
        const speed = parseFloat(el.dataset.kinetic || '0');
        el.style.transform = `translate3d(${(progress - 0.5) * speed * 520}px,0,0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateKinetic);
      }
    }, { passive: true });
    updateKinetic();
  }

  /* cursor-follow care preview */
  const careList = document.querySelector('[data-care-list]');
  const carePreview = document.querySelector('[data-care-preview]');
  if (careList && carePreview && finePointer && !reducedMotion) {
    const img = carePreview.querySelector('img');
    const label = carePreview.querySelector('span');
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty;
    const animatePreview = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      carePreview.style.left = `${x}px`;
      carePreview.style.top = `${y}px`;
      requestAnimationFrame(animatePreview);
    };
    animatePreview();
    careList.addEventListener('pointermove', (e) => {
      const side = e.clientX > window.innerWidth - 340 ? -150 : 150;
      tx = clamp(e.clientX + side, 145, window.innerWidth - 145);
      ty = clamp(e.clientY, 175, window.innerHeight - 175);
    });
    careList.querySelectorAll('.care-row').forEach((row) => {
      row.addEventListener('pointerenter', () => {
        if (img && row.dataset.preview) img.src = row.dataset.preview;
        if (label) label.textContent = row.dataset.label || '';
        carePreview.classList.add('is-visible');
      });
      row.addEventListener('pointerleave', () => carePreview.classList.remove('is-visible'));
    });
  }

  /* process step activation */
  const processSteps = [...document.querySelectorAll('[data-process-step]')];
  let processActive = 0;
  if (processSteps.length) {
    const setProcessStep = (idx) => {
      processActive = idx;
      processSteps.forEach((step, i) => step.classList.toggle('is-active', i === idx));
      document.dispatchEvent(new CustomEvent('refine:process-step', { detail: { index: idx } }));
    };
    if ('IntersectionObserver' in window) {
      const po = new IntersectionObserver((entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setProcessStep(Number(visible.target.dataset.processStep || 0));
      }, { threshold: [0.35, 0.55, 0.7], rootMargin: '-15% 0px -25%' });
      processSteps.forEach((s) => po.observe(s));
    } else {
      processSteps.forEach((step, i) => step.addEventListener('mouseenter', () => setProcessStep(i)));
    }
  }

  /* image parallax */
  const parallaxImage = document.querySelector('[data-parallax-image] img');
  if (parallaxImage && !reducedMotion) {
    let ticking = false;
    const update = () => {
      const section = parallaxImage.closest('[data-parallax-image]');
      const r = section.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1);
      parallaxImage.style.setProperty('--py', `${(p - 0.5) * -72}px`);
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* drag rail */
  const rail = document.querySelector('[data-drag-rail]');
  if (rail) {
    let down = false, startX = 0, startScroll = 0, moved = false;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startScroll = rail.scrollLeft;
      rail.classList.add('dragging');
      try { rail.setPointerCapture(e.pointerId); } catch (_) {}
    });
    rail.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startScroll - dx;
    });
    const end = (e) => {
      down = false; rail.classList.remove('dragging');
      try { rail.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    rail.addEventListener('pointerup', end);
    rail.addEventListener('pointercancel', end);
    rail.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
  }

  /* THREE — hero sculpture */
  function initHeroScene() {
    const mount = document.getElementById('refine-scene');
    if (!mount || !window.THREE || reducedMotion) return;
    const THREE = window.THREE;
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 8.1);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1.35 : 1.7));
      if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      const root = new THREE.Group();
      const contourGroup = new THREE.Group();
      const ribbonGroup = new THREE.Group();
      const orbitGroup = new THREE.Group();
      root.add(contourGroup, ribbonGroup, orbitGroup);
      scene.add(root);

      const count = window.innerWidth < 900 ? 28 : 46;
      const contourMaterials = [];
      for (let i = 0; i < count; i += 1) {
        const side = (i / (count - 1)) * 2 - 1;
        const points = [];
        for (let j = 0; j < 112; j += 1) {
          const t = j / 111;
          const a = (t - 0.5) * Math.PI * 1.82;
          const taper = 1 - Math.pow(Math.abs(t - 0.5) * 1.48, 2) * 0.24;
          const jaw = 1 - 0.11 * Math.max(0, (t - 0.56) * 2.1);
          const x = Math.sin(a) * 1.35 * taper * jaw + side * 0.16 + Math.sin(t * Math.PI * 3 + i * 0.11) * 0.02;
          const y = Math.cos(a) * 1.98 - 0.08 + Math.sin(t * Math.PI * 2) * 0.06;
          const z = side * 1.16 + Math.cos(t * Math.PI * 2 + i * 0.08) * 0.11;
          points.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.44);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(178));
        const mat = new THREE.LineBasicMaterial({
          color: i % 7 === 0 ? 0xd7e0ff : 0x7894ff,
          transparent: true,
          opacity: 0.065 + (1 - Math.abs(side)) * 0.18,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        contourMaterials.push(mat);
        contourGroup.add(new THREE.Line(geo, mat));
      }

      const ribbonData = [
        [2.25, 0.010, 0xa8b9ff, 0.18, [0.88, 0.16, 0.36]],
        [2.58, 0.008, 0x5e7cff, 0.13, [-0.58, 0.24, 0.74]],
        [2.92, 0.006, 0xdbe3ff, 0.08, [1.18, -0.1, 1.05]]
      ];
      ribbonData.forEach((def, idx) => {
        const pts = [];
        for (let i = 0; i <= 120; i += 1) {
          const a = (i / 120) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * def[0], Math.sin(a) * (0.56 + idx * 0.03), Math.sin(a * 2 + idx) * 0.16));
        }
        const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.38);
        const geo = new THREE.TubeGeometry(curve, 210, def[1], 5, true);
        const mat = new THREE.MeshBasicMaterial({ color: def[2], transparent: true, opacity: def[3], blending: THREE.AdditiveBlending, depthWrite: false });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(...def[4]);
        ribbonGroup.add(mesh);
      });

      const coreGeo = new THREE.IcosahedronGeometry(1.42, window.innerWidth < 900 ? 3 : 5);
      const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x5d79ee, transparent: true, opacity: 0.12, roughness: 0.16, metalness: 0.05, transmission: 0.6, thickness: 0.8, clearcoat: 1, clearcoatRoughness: 0.2, depthWrite: false });
      const core = new THREE.Mesh(coreGeo, coreMat); root.add(core);
      const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.56, 2), new THREE.MeshBasicMaterial({ color: 0xa9bbff, wireframe: true, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false }));
      root.add(wire);

      const particleCount = window.innerWidth < 900 ? 780 : 1650;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const v = Math.random() * 2 - 1;
        const r = 1.35 + Math.random() * 1.65;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = v * 2.45;
        positions[i * 3 + 2] = Math.sin(a) * r * 0.58 + (Math.random() - 0.5) * 0.25;
      }
      const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xdbe4ff, size: 0.013, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending, depthWrite: false }));
      root.add(particles);

      [2.35, 2.72, 3.12].forEach((radius, idx) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0048, 6, 220), new THREE.MeshBasicMaterial({ color: idx ? 0x5675f2 : 0xb8c7ff, transparent: true, opacity: idx ? 0.08 : 0.17, blending: THREE.AdditiveBlending, depthWrite: false }));
        ring.rotation.set(1.05 + idx * 0.27, 0.16 + idx * 0.33, 0.48 - idx * 0.25);
        orbitGroup.add(ring);
      });

      const nodeGeo = new THREE.SphereGeometry(0.034, 10, 10);
      const nodes = [0, 1, 2, 3].map((i) => {
        const mesh = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0xcbd7ff, transparent: true, opacity: 0.68 }));
        orbitGroup.add(mesh); return { mesh, phase: i * 1.55, radius: 2.42 + i * 0.16, speed: 0.18 + i * 0.025 };
      });

      scene.add(new THREE.AmbientLight(0x6680ff, 0.8));
      const light = new THREE.PointLight(0xc4d1ff, 8, 14, 2); light.position.set(2.6, 2.2, 4.2); scene.add(light);
      const rim = new THREE.PointLight(0x2b53e3, 7, 12, 2); rim.position.set(-2.8, -1.5, 2.4); scene.add(rim);

      let targetX = 0.12, targetY = 0, px = targetX, py = targetY, dragX = 0, dragY = 0, dragging = false, lx = 0, ly = 0, pulse = 0;
      let heroProgress = 0;
      const hero = document.getElementById('hero');
      const updateScroll = () => {
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        heroProgress = clamp(-r.top / Math.max(1, r.height), 0, 1);
      };
      updateScroll(); window.addEventListener('scroll', updateScroll, { passive: true });

      mount.addEventListener('pointermove', (e) => {
        const r = mount.getBoundingClientRect();
        targetX = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
        targetY = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
        if (dragging) { dragY += (e.clientX - lx) * 0.0036; dragX += (e.clientY - ly) * 0.0032; lx = e.clientX; ly = e.clientY; }
      });
      mount.addEventListener('pointerdown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; pulse = 1; try { mount.setPointerCapture(e.pointerId); } catch (_) {} });
      mount.addEventListener('pointerup', (e) => { dragging = false; try { mount.releasePointerCapture(e.pointerId); } catch (_) {} });
      mount.addEventListener('pointercancel', () => { dragging = false; });

      const resize = () => {
        const w = Math.max(1, mount.clientWidth), h = Math.max(1, mount.clientHeight);
        camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1.35 : 1.7));
      };
      resize();
      const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
      if (ro) ro.observe(mount); else window.addEventListener('resize', resize, { passive: true });

      const clock = new THREE.Clock();
      const render = () => {
        const t = clock.getElapsedTime();
        px += (targetX - px) * 0.035; py += (targetY - py) * 0.035; dragX *= 0.94; dragY *= 0.94; pulse *= 0.92;
        const mobile = window.innerWidth < 900;
        root.position.x = mobile ? 0.92 : 2.05;
        root.position.y = mobile ? -0.32 : 0.02;
        root.scale.setScalar(mobile ? 0.83 : 1);
        root.rotation.y = 0.28 + t * 0.028 + px * 0.42 + dragY + heroProgress * 0.5;
        root.rotation.x = 0.03 + py * 0.17 + dragX - heroProgress * 0.17;
        contourGroup.rotation.z = Math.sin(t * 0.18) * 0.032;
        contourGroup.scale.setScalar(1 + pulse * 0.028);
        ribbonGroup.rotation.y = -t * 0.024 + heroProgress * 0.28;
        orbitGroup.rotation.y = t * 0.02 + px * 0.13;
        orbitGroup.rotation.z = -t * 0.012;
        core.rotation.x = t * 0.035; core.rotation.y = t * 0.055; wire.rotation.y = -t * 0.035; particles.rotation.y = -t * 0.015;
        contourMaterials.forEach((m, i) => { const side = (i / Math.max(1, count - 1)) * 2 - 1; m.opacity = (0.065 + (1 - Math.abs(side)) * 0.18) * (1 + pulse * 0.5); });
        nodes.forEach((n) => { const a = t * n.speed + n.phase; n.mesh.position.set(Math.cos(a) * n.radius, Math.sin(a * 1.3) * 0.9, Math.sin(a) * n.radius * 0.55); });
        camera.position.x = px * 0.18; camera.position.y = -py * 0.1;
        renderer.render(scene, camera); requestAnimationFrame(render);
      };
      render();
    } catch (err) {
      mount.classList.add('three-failed');
    }
  }

  /* THREE — process morph lab */
  function initProcessScene() {
    const mount = document.getElementById('process-scene');
    if (!mount || !window.THREE || reducedMotion) return;
    const THREE = window.THREE;
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50); camera.position.set(0, 0, 7.4);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1.25 : 1.6)); mount.appendChild(renderer.domElement);

      const group = new THREE.Group(); scene.add(group);
      const count = window.innerWidth < 900 ? 650 : 1100;
      const positions = new Float32Array(count * 3);
      const targets = [new Float32Array(count * 3), new Float32Array(count * 3), new Float32Array(count * 3)];
      const frac = (x) => x - Math.floor(x);
      const rand = (i, k) => frac(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453);
      for (let i = 0; i < count; i += 1) {
        const u = i / count;
        const a = u * Math.PI * 2 * 18;
        const v = rand(i, 1) * 2 - 1;
        const phi = rand(i, 2) * Math.PI * 2;
        const rr = Math.sqrt(1 - v * v);
        targets[0][i*3] = rr * Math.cos(phi) * 1.7;
        targets[0][i*3+1] = v * 2.05;
        targets[0][i*3+2] = rr * Math.sin(phi) * 1.1;
        const spiralR = 0.65 + (i % 11) * 0.065;
        targets[1][i*3] = Math.cos(a * 0.22) * spiralR;
        targets[1][i*3+1] = (u - 0.5) * 4.2;
        targets[1][i*3+2] = Math.sin(a * 0.22) * spiralR + Math.sin(a) * 0.08;
        const t = (i % 110) / 109;
        const layer = Math.floor(i / 110) / Math.max(1, Math.ceil(count/110)-1) * 2 - 1;
        const ang = (t - 0.5) * Math.PI * 1.84;
        const taper = 1 - Math.pow(Math.abs(t - 0.5) * 1.5, 2) * 0.25;
        targets[2][i*3] = Math.sin(ang) * 1.42 * taper + layer * 0.12;
        targets[2][i*3+1] = Math.cos(ang) * 2.0 - 0.08;
        targets[2][i*3+2] = layer * 1.05 + Math.cos(t * Math.PI * 2 + layer) * 0.08;
        positions[i*3] = targets[0][i*3]; positions[i*3+1] = targets[0][i*3+1]; positions[i*3+2] = targets[0][i*3+2];
      }
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0x2446c8, size: window.innerWidth < 900 ? 0.022 : 0.018, transparent: true, opacity: 0.74, depthWrite: false });
      const points = new THREE.Points(geometry, material); group.add(points);

      const ringGroup = new THREE.Group(); group.add(ringGroup);
      [1.9, 2.35, 2.8].forEach((r, i) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 6, 180), new THREE.MeshBasicMaterial({ color: i === 0 ? 0x2446c8 : 0x8399e8, transparent: true, opacity: i === 0 ? 0.24 : 0.12, depthWrite: false }));
        ring.rotation.set(1 + i * .25, .15 + i * .3, .42 - i * .2); ringGroup.add(ring);
      });
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 3), new THREE.MeshBasicMaterial({ color: 0x6f87e9, wireframe: true, transparent: true, opacity: 0.09 })); group.add(core);

      let active = processActive || 0, targetX = 0, targetY = 0, px = 0, py = 0;
      document.addEventListener('refine:process-step', (e) => { active = clamp(Number(e.detail?.index || 0), 0, 2); });
      mount.addEventListener('pointermove', (e) => { const r = mount.getBoundingClientRect(); targetX = (e.clientX-r.left)/Math.max(1,r.width)-.5; targetY = (e.clientY-r.top)/Math.max(1,r.height)-.5; });

      const resize = () => { const w=Math.max(1,mount.clientWidth), h=Math.max(1,mount.clientHeight); camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h,false); renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<900?1.25:1.6)); };
      resize(); if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mount); else window.addEventListener('resize', resize, {passive:true});

      const clock = new THREE.Clock();
      const render = () => {
        const t = clock.getElapsedTime(); px += (targetX-px)*.04; py += (targetY-py)*.04;
        const arr = geometry.attributes.position.array; const target = targets[active];
        for (let i=0;i<arr.length;i++) arr[i] += (target[i]-arr[i]) * 0.045;
        geometry.attributes.position.needsUpdate = true;
        group.rotation.y = t*.04 + px*.28; group.rotation.x = py*.12 + (active-1)*.05;
        ringGroup.rotation.y = -t*.025; ringGroup.rotation.z = t*.012 + active*.16;
        core.rotation.x = t*.04; core.rotation.y = -t*.055; core.scale.setScalar(1 + active*.08);
        material.color.setHex(active===0?0x2446c8:active===1?0x4967ee:0x183aaf);
        renderer.render(scene,camera); requestAnimationFrame(render);
      };
      render();
    } catch (err) { mount.classList.add('three-failed'); }
  }

  const bootThree = () => {
    const needsThree = document.getElementById('refine-scene') || document.getElementById('process-scene');
    if (!needsThree) return;
    if (window.THREE) { initHeroScene(); initProcessScene(); }
    else {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (window.THREE) { window.clearInterval(timer); initHeroScene(); initProcessScene(); }
        else if (tries > 24) window.clearInterval(timer);
      }, 250);
    }
  };
  bootThree();
})();
