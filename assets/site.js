document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;

/* Scroll reveals */
const revealTargets = [...document.querySelectorAll('.reveal, .service-card, .space-grid figure, .program, .guide-grid article, .route-list article, .principle-grid article')];
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -7%' });
  revealTargets.forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
} else {
  revealTargets.forEach((element) => element.classList.add('in-view'));
}

/* Tactile micro-interactions */
if (finePointer && !reducedMotion) {
  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate3d(${x * 0.045}px, ${y * 0.065}px, 0)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });

  document.querySelectorAll('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  document.querySelectorAll('[data-tilt]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(1000px) rotateX(${-y * 2.2}deg) rotateY(${x * 3.0}deg) translateZ(0)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

/* Hero scroll progress */
const hero = document.querySelector('.hero-home');
let heroProgress = 0;
let heroVisible = true;
if (hero && !reducedMotion) {
  const updateHeroProgress = () => {
    const rect = hero.getBoundingClientRect();
    heroProgress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
  };
  updateHeroProgress();
  window.addEventListener('scroll', updateHeroProgress, { passive: true });
  window.addEventListener('resize', updateHeroProgress, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }, { threshold: 0 }).observe(hero);
  }
}

/* THREE.JS — layered face-line sculpture, glass core, orbital ribbons and particles */
(function initRefineScene() {
  const mount = document.getElementById('refine-scene');
  if (!mount || !window.THREE || reducedMotion) return;

  try {
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
    camera.position.set(0, 0, 7.7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    const contourGroup = new THREE.Group();
    const ribbonGroup = new THREE.Group();
    const orbitGroup = new THREE.Group();
    const photoStage = new THREE.Group();
    root.add(contourGroup, ribbonGroup, orbitGroup);
    scene.add(photoStage, root);

    scene.add(new THREE.AmbientLight(0x7388ff, 0.95));
    const key = new THREE.PointLight(0xb9c8ff, 12, 12, 2.1);
    key.position.set(2.2, 2.4, 3.8);
    scene.add(key);
    const rim = new THREE.PointLight(0x2d54ff, 9, 11, 2.0);
    rim.position.set(-2.8, -1.5, 2.2);
    scene.add(rim);

    /* Architectural photo plane: local shop image rendered as a subtle living surface. */
    const photoUniforms = {
      uMap: { value: null },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 }
    };
    let photoMesh = null;
    const photoVertex = `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uScroll;
      void main(){
        vUv = uv;
        vec3 p = position;
        float edge = sin(uv.y * 9.0 + uTime * 0.42) * 0.024;
        float pointerWave = (uv.x - 0.5) * uPointer.x * 0.16 + (uv.y - 0.5) * -uPointer.y * 0.11;
        p.z += edge + pointerWave + uScroll * (uv.y - 0.5) * 0.12;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `;
    const photoFragment = `
      varying vec2 vUv;
      uniform sampler2D uMap;
      uniform float uTime;
      uniform vec2 uPointer;
      void main(){
        vec2 uv = vUv;
        uv.x += sin(uv.y * 12.0 + uTime * 0.35) * 0.0025 + uPointer.x * 0.002;
        vec4 tex = texture2D(uMap, uv);
        float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
        vec3 mono = mix(vec3(lum), tex.rgb, 0.34);
        vec3 blueTint = vec3(0.045, 0.075, 0.16);
        vec3 color = mix(mono, blueTint, 0.26);
        color *= 0.78 + 0.22 * smoothstep(0.0, 1.0, vUv.y);
        float leftFade = smoothstep(0.02, 0.13, vUv.x);
        float rightFade = 1.0 - smoothstep(0.88, 0.99, vUv.x);
        float topFade = 1.0 - smoothstep(0.90, 0.995, vUv.y);
        float bottomFade = smoothstep(0.015, 0.10, vUv.y);
        float alpha = leftFade * rightFade * topFade * bottomFade * 0.92;
        gl_FragColor = vec4(color, alpha);
      }
    `;
    new THREE.TextureLoader().load(
      'assets/images/hero-space.webp',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        photoUniforms.uMap.value = texture;
        const geometry = new THREE.PlaneGeometry(2.45, 3.42, 28, 42);
        const material = new THREE.ShaderMaterial({
          uniforms: photoUniforms,
          vertexShader: photoVertex,
          fragmentShader: photoFragment,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        photoMesh = new THREE.Mesh(geometry, material);
        photoMesh.rotation.y = -0.13;
        photoMesh.rotation.z = 0.018;
        photoStage.add(photoMesh);
        document.documentElement.classList.add('webgl-photo-ready');
      },
      undefined,
      () => document.documentElement.classList.add('webgl-photo-failed')
    );

    const mobile = () => window.innerWidth < 820;
    const narrow = () => window.innerWidth < 560;

    /* Face-like contour stack */
    const contourMaterials = [];
    const contourCount = mobile() ? 32 : 48;
    for (let i = 0; i < contourCount; i += 1) {
      const normalized = i / Math.max(1, contourCount - 1);
      const z = (normalized - 0.5) * 2.3;
      const side = normalized * 2 - 1;
      const points = [];
      const steps = 118;

      for (let j = 0; j < steps; j += 1) {
        const t = j / (steps - 1);
        const a = (t - 0.5) * Math.PI * 1.76;
        const cheek = 1 + 0.07 * Math.sin(t * Math.PI * 2.0);
        const taper = 1 - Math.pow(Math.abs(t - 0.5) * 1.55, 2) * 0.22;
        const asym = Math.sin(t * Math.PI * 3.0 + i * 0.13) * 0.025;
        const x = Math.sin(a) * 1.34 * taper * cheek + side * 0.15 + asym;
        const y = Math.cos(a) * 1.93 - 0.06 + Math.sin(t * Math.PI * 2) * 0.065;
        const depth = z + Math.cos(t * Math.PI * 2 + i * 0.09) * 0.12;
        points.push(new THREE.Vector3(x, y, depth));
      }

      const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.42);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(190));
      const centerWeight = 1 - Math.abs(side);
      const material = new THREE.LineBasicMaterial({
        color: i % 6 === 0 ? 0xd4ddff : 0x7894ff,
        transparent: true,
        opacity: 0.075 + centerWeight * 0.17,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      contourMaterials.push(material);
      contourGroup.add(new THREE.Line(geometry, material));
    }

    /* Flowing orbital ribbons: premium, soft, spatial movement */
    const ribbonDefs = [
      { r: 2.18, y: 0.08, tilt: 0.78, color: 0x9fb4ff, opacity: 0.18 },
      { r: 2.48, y: -0.12, tilt: -0.52, color: 0x5f7dff, opacity: 0.13 },
      { r: 2.82, y: 0.22, tilt: 1.08, color: 0xd7e0ff, opacity: 0.08 }
    ];

    ribbonDefs.forEach((def, index) => {
      const curvePoints = [];
      for (let i = 0; i <= 96; i += 1) {
        const t = (i / 96) * Math.PI * 2;
        curvePoints.push(new THREE.Vector3(
          Math.cos(t) * def.r,
          Math.sin(t) * (0.58 + index * 0.04) + def.y,
          Math.sin(t * 2 + index) * 0.16
        ));
      }
      const curve = new THREE.CatmullRomCurve3(curvePoints, true, 'catmullrom', 0.35);
      const geo = new THREE.TubeGeometry(curve, 180, 0.009 + index * 0.003, 5, true);
      const mat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: def.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const tube = new THREE.Mesh(geo, mat);
      tube.rotation.set(def.tilt, 0.22 * index, 0.36 + index * 0.38);
      ribbonGroup.add(tube);
    });

    /* Glass core */
    const coreGeo = new THREE.IcosahedronGeometry(1.36, mobile() ? 3 : 5);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x6f88ff,
      roughness: 0.16,
      metalness: 0.05,
      transmission: 0.62,
      thickness: 0.9,
      transparent: true,
      opacity: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      wireframe: false,
      depthWrite: false
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    root.add(core);

    const wireGeo = new THREE.IcosahedronGeometry(1.52, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa9bbff,
      wireframe: true,
      transparent: true,
      opacity: 0.052,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    root.add(wire);

    /* Particle atmosphere */
    const particleCount = mobile() ? 850 : 1800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const v = Math.random() * 2 - 1;
      const radius = (1.35 + Math.random() * 1.45) * (0.82 + (1 - Math.abs(v)) * 0.18);
      positions[i * 3] = Math.cos(a) * radius;
      positions[i * 3 + 1] = v * 2.35 + Math.sin(a * 2) * 0.08;
      positions[i * 3 + 2] = Math.sin(a) * radius * 0.56 + (Math.random() - 0.5) * 0.28;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd9e1ff,
      size: mobile() ? 0.013 : 0.014,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    root.add(particles);

    /* Precision orbital rings */
    [2.35, 2.72, 3.05].forEach((radius, index) => {
      const geometry = new THREE.TorusGeometry(radius, 0.005, 6, 220);
      const material = new THREE.MeshBasicMaterial({
        color: index === 0 ? 0xaec0ff : 0x5675f2,
        transparent: true,
        opacity: index === 0 ? 0.19 : 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.set(1.05 + index * 0.26, 0.16 + index * 0.34, 0.44 - index * 0.22);
      orbitGroup.add(ring);
    });

    /* Small orbiting nodes */
    const nodeGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xcbd7ff, transparent: true, opacity: 0.72 });
    const nodes = [0, 1, 2].map((index) => {
      const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
      orbitGroup.add(node);
      return { mesh: node, phase: index * 2.1, radius: 2.45 + index * 0.25, speed: 0.22 + index * 0.035 };
    });

    let targetX = 0.08;
    let targetY = 0;
    let pointerX = targetX;
    let pointerY = targetY;
    let dragX = 0;
    let dragY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let pulse = 0;

    const setPointer = (x, y) => {
      const rect = mount.getBoundingClientRect();
      targetX = (x - rect.left) / Math.max(1, rect.width) - 0.5;
      targetY = (y - rect.top) / Math.max(1, rect.height) - 0.5;
    };

    mount.addEventListener('pointermove', (event) => {
      setPointer(event.clientX, event.clientY);
      if (isDragging) {
        dragY += (event.clientX - lastX) * 0.0031;
        dragX += (event.clientY - lastY) * 0.0027;
        lastX = event.clientX;
        lastY = event.clientY;
      }
    });
    mount.addEventListener('pointerdown', (event) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      pulse = 1;
      try { mount.setPointerCapture(event.pointerId); } catch (_) {}
    });
    mount.addEventListener('pointerup', (event) => {
      isDragging = false;
      try { mount.releasePointerCapture(event.pointerId); } catch (_) {}
    });
    mount.addEventListener('pointercancel', () => { isDragging = false; });
    mount.addEventListener('pointerleave', () => {
      if (!isDragging) { targetX = 0.08; targetY = 0; }
    });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile() ? 1.3 : 1.65));
      renderer.setSize(width, height, false);
    };
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mount);
    else window.addEventListener('resize', resize, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!heroVisible && document.visibilityState === 'visible') return;

      const t = clock.getElapsedTime();
      pointerX += (targetX - pointerX) * 0.045;
      pointerY += (targetY - pointerY) * 0.045;
      dragX *= 0.945;
      dragY *= 0.945;
      pulse *= 0.925;

      const isMobile = mobile();
      root.position.x = isMobile ? (narrow() ? 0.72 : 0.95) : 1.52;
      root.position.y = isMobile ? -0.54 : 0.02;
      root.scale.setScalar(isMobile ? (narrow() ? 0.84 : 0.92) : 1.0);

      if (photoMesh) {
        photoStage.visible = !isMobile;
        photoStage.position.set(2.18 + pointerX * 0.08, -0.25 - heroProgress * 0.12, -1.55);
        photoStage.rotation.y = pointerX * 0.035;
        photoStage.rotation.x = -pointerY * 0.025;
        photoUniforms.uTime.value = t;
        photoUniforms.uPointer.value.set(pointerX, pointerY);
        photoUniforms.uScroll.value = heroProgress;
      }

      root.rotation.y = 0.24 + t * 0.035 + pointerX * 0.42 + dragY + heroProgress * 0.52;
      root.rotation.x = 0.04 + pointerY * 0.17 + dragX - heroProgress * 0.16;
      root.rotation.z = Math.sin(t * 0.16) * 0.018;

      contourGroup.rotation.z = Math.sin(t * 0.18) * 0.032;
      contourGroup.scale.setScalar(1 + pulse * 0.025);
      contourMaterials.forEach((material, index) => {
        const n = index / Math.max(1, contourMaterials.length - 1);
        const center = 1 - Math.abs(n * 2 - 1);
        material.opacity = (0.07 + center * 0.16) * (1 + pulse * 0.5);
      });

      ribbonGroup.rotation.y = -t * 0.02 + pointerX * 0.1;
      ribbonGroup.rotation.z = t * 0.012;
      orbitGroup.rotation.y = t * 0.026 + heroProgress * 0.12;
      orbitGroup.rotation.z = -t * 0.014;
      particles.rotation.y = -t * 0.016 - heroProgress * 0.1;
      particles.rotation.x = Math.sin(t * 0.12) * 0.025;
      core.rotation.y = t * 0.06;
      core.rotation.x = t * 0.032;
      wire.rotation.y = -t * 0.035;
      wire.rotation.z = t * 0.022;

      nodes.forEach((node, index) => {
        const a = t * node.speed + node.phase;
        node.mesh.position.set(
          Math.cos(a) * node.radius,
          Math.sin(a * 1.12) * (0.72 + index * 0.05),
          Math.sin(a) * node.radius * 0.42
        );
      });

      camera.position.x = pointerX * 0.17;
      camera.position.y = -pointerY * 0.08;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    render();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') clock.stop();
      else clock.start();
    });

    window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
  } catch (error) {
    mount.classList.add('three-failed');
    console.warn('The Refine WebGL scene could not initialize.', error);
  }
})();
