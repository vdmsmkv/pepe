import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';

// i18n
const params = new URLSearchParams(window.location.search);
const lang = params.get('language') || (function(){
  try { return localStorage.getItem('language') || (document.documentElement.getAttribute('lang') || 'ru'); }
  catch(e){ return 'ru'; }
})();
const translations = {
  en: { flip: 'Flip the Coin', exit: 'Back to menu', heads: 'HEADS!', tails: 'TAILS!', series_label: 'Series', nextThrowIn: 'Next throw in:', breakNextSeriesIn: 'Break, next series in:', sec: 'sec' },
  ru: { flip: 'Подбросить монету', exit: 'Выйти в меню', heads: 'ОРЕЛ!', tails: 'РЕШКА!', series_label: 'Серия', nextThrowIn: 'Следующий бросок через:', breakNextSeriesIn: 'Перерыв, следующая серия через:', sec: 'сек' },
  uz: { flip: 'Tanga uloqtirish', exit: 'Menyuga qaytish', heads: 'GERB!', tails: 'RAQAM!', series_label: 'Seriya', nextThrowIn: "Keyingi tashlash:", breakNextSeriesIn: 'Tanaffus, keyingi seriya:', sec: 'soniya' },
  hi: { flip: 'सिक्का उछालें', exit: 'मेनू पर वापस', heads: 'हेड्स!', tails: 'टेल्स!', series_label: 'सीरीज़', nextThrowIn: 'अगला थ्रो:', breakNextSeriesIn: 'ब्रेक, अगली सीरीज़:', sec: 'सेक' },
  az: { flip: 'Sikkəni at', exit: 'Menyuya qayıt', heads: 'TURA!', tails: 'YAZI!', series_label: 'Seriya', nextThrowIn: 'Növbəti atış:', breakNextSeriesIn: 'Fasilə, növbəti seriya:', sec: 'san' }
};
function t(key) { const dict = translations[lang] || translations.en; return dict[key] || key; }
document.documentElement.setAttribute('lang', lang);
try { localStorage.setItem('language', lang); } catch(e){}
document.querySelectorAll('[data-i18n]').forEach(node => { const key = node.getAttribute('data-i18n'); node.textContent = t(key); });

// Three.js setup
let scene, camera, renderer, coin;
let coinMaterial = null;
let glassGlowContainer = null;
let isFlipping = false;
const FLIP_DURATION = 1500; // длительность вращения

const container = document.getElementById('coin-container');
scene = new THREE.Scene();
const aspect = container.clientWidth / container.clientHeight;
camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffddaa, 3, 10);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);
camera.position.z = 5;

// Liquid Glass glow container behind the coin
if (window.Container) {
  try {
    glassGlowContainer = new Container({ type: 'circle', tintOpacity: 0.28 });
    const el = glassGlowContainer.element;
    el.classList.add('glow-layer');
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.zIndex = '0';
    container.prepend(el); // place behind canvas
  } catch (e) { /* graceful fallback if library not loaded */ }
}

// Buttons press effect
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const b = btn;
    setTimeout(() => {
      b.classList.add('reset-animation');
      setTimeout(() => b.classList.remove('reset-animation'), 200);
    }, 200);
  });
});

// Load coin model (OBJ)
const loader = new OBJLoader();
loader.load('monetka.obj', (obj) => {
  // Apply gold material to all meshes
  coinMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD700,       // золотой
    metalness: 0.9,
    roughness: 0.25,
  });

  obj.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry && !child.geometry.attributes.normal) {
        child.geometry.computeVertexNormals();
      }
      child.material = coinMaterial;
    }
  });

  coin = obj;
  scene.add(coin);
  coin.rotation.set(0, 0, 0);
  coin.position.set(0, 0, 0);
  coin.scale.set(1.75, 1.75, 1.75);
  animate();

  // initial glow color (gold)
  setGlowColor(0xFFD700);
});

function animate(){ requestAnimationFrame(animate); renderer.render(scene, camera); }

function setGlowColor(hex){
  const c = new THREE.Color(hex);
  const r = Math.round(c.r * 255), g = Math.round(c.g * 255), b = Math.round(c.b * 255);
  const rgba = (a) => `rgba(${r}, ${g}, ${b}, ${a})`;
  const gradient = `radial-gradient(60% 60% at 50% 50%, ${rgba(0.30)} 0%, ${rgba(0.18)} 45%, ${rgba(0.06)} 70%, transparent 100%)`;
  if (glassGlowContainer && glassGlowContainer.element) {
    glassGlowContainer.element.style.background = gradient;
  } else {
    // Fallback: create a basic glow div if library not available
    let fallback = container.querySelector('.glow-layer');
    if (!fallback){
      fallback = document.createElement('div');
      fallback.className = 'glow-layer';
      container.prepend(fallback);
    }
    fallback.style.background = gradient;
  }
}

function animateCoinColor(targetHex, duration = 700){
  if (!coinMaterial) return;
  const startColor = coinMaterial.color.clone();
  const endColor = new THREE.Color(targetHex);
  const startTime = performance.now();
  function tick(now){
    const t = Math.min((now - startTime) / duration, 1);
    const current = startColor.clone().lerp(endColor, t);
    // apply to all meshes
    coin.traverse(child => { if (child.isMesh) child.material.color.copy(current); });
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateLightColor(targetHex, duration = 700){
  const start = pointLight.color.clone();
  const end = new THREE.Color(targetHex);
  const startTime = performance.now();
  function tick(now){
    const t = Math.min((now - startTime) / duration, 1);
    const cur = start.clone().lerp(end, t);
    pointLight.color.copy(cur);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

async function flipCoin(){
  if (isFlipping || !coin) return;
  isFlipping = true;
  const resultEl = document.getElementById('result');
  resultEl.textContent = '';

  const isHeads = Math.random() < 0.5;
  const finalRotation = isHeads ? Math.PI * 8 : Math.PI * 9; // количество оборотов
  const startTime = Date.now();
  const startRotation = coin.rotation.y;
  const liftHeight = 0.9; // мягкий подлёт (в единицах сцены)

  // Прячем подсветку на время полёта (плавно через CSS transition)
  (function hideGlow(){
    const glowEl = glassGlowContainer?.element || container.querySelector('.glow-layer');
    if (glowEl) glowEl.style.opacity = '0';
  })();

  function step(){
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / FLIP_DURATION, 1);
    // Плавный поворот без подпрыгивания (easeInOut)
    const eased = 0.5 - Math.cos(Math.PI * progress) / 2;
    // Лёгкий подлёт по синусоиде: вверх в середине, вниз к концу
    coin.position.y = Math.sin(Math.PI * progress) * liftHeight;
    coin.rotation.y = startRotation + (finalRotation * eased);

    if (progress < 1){
      requestAnimationFrame(step);
    } else {
      coin.rotation.y = startRotation + finalRotation;
      resultEl.textContent = isHeads ? t('heads') : t('tails');
      // Визуальные изменения после приземления
      const GOLD = 0xFFD700;
      const SILVER = 0xC0C0C0;
      const target = isHeads ? GOLD : SILVER;
      animateCoinColor(target, 750);
      setGlowColor(target);
      animateLightColor(target, 750);
      // Возвращаем подсветку (плавно)
      const glowEl = glassGlowContainer?.element || container.querySelector('.glow-layer');
      if (glowEl) glowEl.style.opacity = '0.9';
      isFlipping = false;
    }
  }
  step();
}

window.flipCoin = flipCoin;

// Resize handler
window.addEventListener('resize', () => {
  const w = container.clientWidth; const h = container.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
});

// Game modes
let currentMode = 'single';
let seriesCount = 0;
let isCooldown = false;
let cooldownTimer = null;

// Multipliers UI helpers
const multipliersBar = document.getElementById('multipliersBar');
const multiplierItems = Array.from(multipliersBar?.querySelectorAll('.multiplier-item') || []);

function updateMultipliersGlow(){
  if (!multiplierItems.length) return;
  multiplierItems.forEach((el, idx) => {
    el.classList.toggle('active', idx < seriesCount);
  });
}

function setMultipliersVisible(show){
  if (multipliersBar) multipliersBar.classList.toggle('show', show);
}

function setNeutralState(on){
  if (multipliersBar) multipliersBar.classList.toggle('neutral', on);
  const glowEl = glassGlowContainer?.element || container.querySelector('.glow-layer');
  if (glowEl) glowEl.style.opacity = on ? '0.5' : '0.9';
  if (on) {
    // Neutral grey glow background
    setGlowColor(0x9aa1ad);
  }
}

function startCooldown(duration, messageKey){
  isCooldown = true;
  const info = document.getElementById('cooldownInfo');
  info.style.display = 'block';
  let timeLeft = duration;
  info.textContent = t(messageKey);

  // When series ends, clear glows and set neutral UI state
  if (currentMode === 'series' && messageKey === 'breakNextSeriesIn'){
    multiplierItems.forEach(el => el.classList.remove('active'));
    setNeutralState(true);
  }

  cooldownTimer = setInterval(()=>{
    timeLeft--;
    info.textContent = `${t(messageKey)} ${timeLeft} ${t('sec')}`;
    if (timeLeft <= 0){
      clearInterval(cooldownTimer);
      info.style.display = 'none';
      isCooldown = false;
      if (currentMode === 'series'){
        seriesCount = 0;
        document.getElementById('seriesCount').textContent = '0';
        const toggle = document.getElementById('seriesToggle');
        if (toggle) toggle.checked = true; // keep series on
        // restore from neutral and update bar
        setNeutralState(false);
        setMultipliersVisible(true);
        updateMultipliersGlow();
      }
    }
  }, 1000);
}

function toggleSeries(isOn){
  if (isCooldown){
    document.getElementById('seriesToggle').checked = currentMode === 'series';
    return;
  }
  currentMode = isOn ? 'series' : 'single';
  document.getElementById('seriesInfo').style.display = isOn ? 'block' : 'none';
  setMultipliersVisible(isOn);
  if (!isOn){ seriesCount = 0; document.getElementById('seriesCount').textContent = '0'; }
  updateMultipliersGlow();
  if (!isOn) setNeutralState(false);
}

window.toggleSeries = toggleSeries;

// Override flipCoin for modes
const originalFlipCoin = flipCoin;
window.flipCoin = function(){
  if (isCooldown || isFlipping) return;
  if (currentMode === 'series' && seriesCount >= 7) return;

  originalFlipCoin();

  if (currentMode === 'single'){
    setTimeout(()=>{ if (!isCooldown) startCooldown(5, 'nextThrowIn'); }, FLIP_DURATION);
  } else {
    seriesCount++;
    document.getElementById('seriesCount').textContent = seriesCount;
    updateMultipliersGlow();
    if (seriesCount >= 7){
      setTimeout(()=>{ startCooldown(10, 'breakNextSeriesIn'); }, FLIP_DURATION);
    }
  }
};