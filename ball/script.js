


const startButton = document.getElementById("startButton");
const bettingPanel = document.getElementById("bettingPanel");
const confirmButton = document.getElementById("confirmButton");
const betDisplay = document.getElementById("betDisplay");
const ball = document.getElementById("ball");
const betInput = document.getElementById("betAmount");
const currencyInputs = document.querySelectorAll("input[name='currency']");
const ballContainer = document.querySelector(".ball-container");
const restartButton = document.getElementById("restartButton");
const otherCurrencyToggle = document.getElementById("otherCurrencyToggle");
const otherCurrencyGroup = document.getElementById("otherCurrencyGroup");
const customCurrencyInput = document.getElementById("customCurrency");
const panelClose = document.getElementById("panelClose");

let betAmount = 0;
let selectedCurrency = "";
let otherCurrencyActive = false;
let inflateIntervalId = null;
let inflateSoundRef = null;

// Start game
startButton.addEventListener("click", () => {
  bettingPanel.style.display = "flex";
  setTimeout(() => {
    bettingPanel.classList.add("visible");
  }, 10);
  startButton.style.display = "none";
});

// Check confirm button state
function updateConfirmButtonState() {
  const customCurrencyValid = otherCurrencyActive && customCurrencyInput && customCurrencyInput.value.trim().length > 0;
  const isCurrencySelected = Array.from(currencyInputs).some(input => input.checked) || customCurrencyValid;
  const isAmountValid = parseFloat(betInput.value) > 0;
  confirmButton.disabled = !(isCurrencySelected && isAmountValid);
}

// Amount input handler
betInput.addEventListener("input", updateConfirmButtonState);

// Currency selection handler
currencyInputs.forEach(input => {
  input.addEventListener("change", updateConfirmButtonState);
});

// Toggle other currency input
otherCurrencyToggle.addEventListener('click', () => {
  otherCurrencyActive = !otherCurrencyActive;
  otherCurrencyGroup.style.display = otherCurrencyActive ? 'block' : 'none';
  if (otherCurrencyActive) {
    currencyInputs.forEach(inp => inp.checked = false);
  }
  updateConfirmButtonState();
});

// Update state on custom currency typing
if (customCurrencyInput) {
  customCurrencyInput.addEventListener('input', updateConfirmButtonState);
}

// Confirm bet
confirmButton.addEventListener("click", () => {
  betAmount = parseFloat(betInput.value) || 0;

  // Если выбран режим "иная/другая валюта"
  if (otherCurrencyActive) {
    selectedCurrency = (customCurrencyInput.value || '').trim();

    // Показываем исходную сумму и запускаем анимацию как обычно
    betDisplay.innerHTML = formatCurrencySignal(selectedCurrency, betAmount);
    betDisplay.style.opacity = 1;

    bettingPanel.classList.remove("visible");
    bettingPanel.classList.add("hiding");
    restartButton.style.display = "block";
    setTimeout(() => {
      bettingPanel.style.display = "none";
      bettingPanel.classList.remove("hiding");
    }, 400);
    window.scrollTo(0, 0);

    ball.classList.add('inflating');
    animateBallAndBet();
    return;
  }

  // Обычный режим (₽/$/₹)
  const checked = document.querySelector("input[name='currency']:checked");
  selectedCurrency = checked ? checked.value : selectedCurrency;

  betDisplay.innerHTML = formatCurrencySignal(selectedCurrency, betAmount);
  betDisplay.style.opacity = 1;

  bettingPanel.classList.remove("visible");
  bettingPanel.classList.add("hiding");
  restartButton.style.display = "block";

  setTimeout(() => {
    bettingPanel.style.display = "none";
    bettingPanel.classList.remove("hiding");
  }, 400);

  window.scrollTo(0, 0);

  // Добавляем класс для анимации надувания
  ball.classList.add('inflating');
  
  animateBallAndBet();
});

// Generate random multiplier with weights
function getRandomMultiplier() {
  const ranges = [
    { min: 2.0, max: 3.0, weight: 0.4 },
    { min: 3.0, max: 3.5, weight: 0.3 },
    { min: 3.5, max: 4.0, weight: 0.2 },
    { min: 4.0, max: 5.0, weight: 0.1 },
  ];

  const totalWeight = ranges.reduce((sum, range) => sum + range.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { min, max, weight } of ranges) {
    if (random < weight) {
      return Math.random() * (max - min) + min;
    }
    random -= weight;
  }
}

// Animate ball and bet
function animateBallAndBet() {
  let scale = 1;
  let currentBet = betAmount;
  const multiplier = getRandomMultiplier();
  const maxScale = 1.8;
  const maxTextScale = 1.6;
  const speed = 100 / multiplier; // Скорость анимации зависит от множителя
  let isExploding = false;
  let acceleration = 0.01; // Начальное ускорение
  
  // Добавляем звук надувания
  const inflateSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-balloon-foil-squeak-2811.mp3');
  inflateSound.volume = 0.3;
  inflateSound.loop = true;
  inflateSound.play().catch(error => {
    console.log('Автовоспроизведение звука заблокировано браузером:', error);
  });
  inflateSoundRef = inflateSound;

  inflateIntervalId = setInterval(() => {
    if (scale >= maxScale && !isExploding) {
      isExploding = true;
      // Останавливаем звук надувания
      inflateSound.pause();
      // Удаляем класс анимации надувания перед взрывом
      ball.classList.remove('inflating');
      // Взрыв шарика
      explodeBalloon(multiplier);
      clearInterval(inflateIntervalId);
      inflateIntervalId = null;
    } else if (!isExploding) {
      // Увеличиваем ускорение по мере надувания для эффекта напряжения
      acceleration = acceleration * 1.03;
      scale += 0.02 + acceleration;
      currentBet = betAmount * (scale / maxScale) * multiplier;

      const newSize = 200 * scale;
      ballContainer.style.width = `${newSize}px`;
      ballContainer.style.height = `${newSize}px`;

      ball.style.transform = `scale(${scale})`;
      ball.style.transition = "transform 0.1s ease-in-out";
      
      // Добавляем эффект дрожания при приближении к максимальному размеру
      if (scale > maxScale * 0.8) {
        const shake = (scale / maxScale) * 2 - 1.6; // Начинаем дрожание на 80% от максимального размера
        if (shake > 0) {
          const randomX = (Math.random() - 0.5) * shake;
          const randomY = (Math.random() - 0.5) * shake;
          ball.style.transform = `scale(${scale}) translate(${randomX}px, ${randomY}px)`;
        }
      }

      betDisplay.style.transform = `translate(-50%, -50%) scale(${Math.min(scale, maxTextScale)})`;
      betDisplay.style.fontSize = `${13 + (5 * Math.min(scale, maxTextScale))}px`;
      betDisplay.innerHTML = formatCurrencySignal(selectedCurrency, currentBet);
    }
  }, speed);
}

// Функция для анимации взрыва шарика
function explodeBalloon(multiplier) {
  // Создаем элементы для анимации взрыва
  const explosionContainer = document.createElement('div');
  explosionContainer.className = 'explosion-container';
  ballContainer.appendChild(explosionContainer);
  
  // Воспроизводим звук взрыва
  playExplosionSound();
  
  // Создаем частицы взрыва (увеличиваем количество для более впечатляющего эффекта)
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'explosion-particle';
    
    // Случайное положение и направление для частиц
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150; // Увеличиваем максимальную дистанцию
    const duration = 0.5 + Math.random() * 1.0; // Увеличиваем вариацию длительности
    
    // Случайный размер для частиц
    const size = 5 + Math.random() * 20;
    
    particle.style.backgroundColor = getRandomColor();
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animation = `explode ${duration}s ease-out forwards`;
    particle.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    
    // Устанавливаем конечную позицию через CSS переменные
    particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
    
    explosionContainer.appendChild(particle);
  }
  
  // Добавляем круговую волну взрыва
  const shockwave = document.createElement('div');
  shockwave.className = 'shockwave';
  explosionContainer.appendChild(shockwave);
  
  // Скрываем шарик
  ball.style.opacity = '0';
  ball.style.transition = 'opacity 0.2s ease-out';
  
  // Вычисляем и показываем сумму выигрыша вместо множителя
  const winAmount = betAmount * multiplier;
  
  // Показываем сумму выигрыша вместо множителя X
  setTimeout(() => {
    // Для "иной валюты" показываем рандомный сигнал, для обычной — выигрыш
    if (otherCurrencyActive) {
      const signalValue = getRandomSignal();
      betDisplay.innerHTML = formatCurrencySignal(selectedCurrency, signalValue);
    } else {
      betDisplay.innerHTML = formatCurrencySignal(selectedCurrency, winAmount);
    }
    betDisplay.style.fontSize = '36px';
    betDisplay.style.color = '#FFD700'; // Золотой цвет для выигрыша
    betDisplay.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
    betDisplay.classList.add('win-amount'); // Добавляем класс для анимации пульсации
  }, 200);
}

// Функция для воспроизведения звука взрыва
function playExplosionSound() {
  const audio = new Audio();
  audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-explosion-impact-1682.mp3';
  audio.volume = 0.5;
  audio.play().catch(error => {
    console.log('Автовоспроизведение звука заблокировано браузером:', error);
  });
}

// Функция для генерации случайного цвета для частиц
function getRandomColor() {
  const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Restart button handler
restartButton.addEventListener("click", () => {
  bettingPanel.style.display = "none";
  startButton.style.display = "block";
  restartButton.style.display = "none";
  betDisplay.style.opacity = 0;
  betDisplay.style.color = "#fff";
  betDisplay.style.textShadow = "0 2px 4px rgba(0, 0, 0, 0.4)";
  betDisplay.style.fontSize = "22px";
  betDisplay.style.transform = "translate(-50%, -50%) scale(1)";
  betDisplay.classList.remove('win-amount'); // Удаляем класс анимации при перезапуске
  
  // Сбрасываем шарик
  ball.style.transform = "scale(1)";
  ball.style.transition = "none";
  ball.style.opacity = "1";
  ball.classList.remove('inflating'); // Удаляем класс анимации надувания

  // Останавливаем анимацию/звук если еще играют
  if (inflateIntervalId) {
    clearInterval(inflateIntervalId);
    inflateIntervalId = null;
  }
  if (inflateSoundRef) {
    try { inflateSoundRef.pause(); } catch (e) {}
    inflateSoundRef = null;
  }
  
  // Удаляем контейнер с частицами взрыва, если он существует
  const explosionContainer = document.querySelector('.explosion-container');
  if (explosionContainer) {
    explosionContainer.remove();
  }
  
  // Сбрасываем размер контейнера шарика
  ballContainer.style.width = "280px";
  ballContainer.style.height = "200px";

  // Сброс состояния "иная/другая валюта"
  otherCurrencyActive = false;
  if (otherCurrencyGroup) otherCurrencyGroup.style.display = 'none';
  if (customCurrencyInput) customCurrencyInput.value = '';
  currencyInputs.forEach(inp => inp.checked = false);
  betInput.value = '';
  updateConfirmButtonState();
});

// Создаем звезды на фоне
function createStars() {
  const starsContainer = document.getElementById('stars');
  const numberOfStars = 50;
  
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Случайное положение
    const x = Math.random() * 100;
    const y = Math.random() * 60; // Только в верхней части экрана
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    
    // Случайный размер
    const size = 1 + Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Случайная задержка анимации
    const delay = Math.random() * 5;
    star.style.animationDelay = `${delay}s`;
    
    // Случайная длительность анимации
    const duration = 3 + Math.random() * 4;
    star.style.animationDuration = `${duration}s`;
    
    starsContainer.appendChild(star);
  }
}

// Вызываем функцию создания звезд при загрузке страницы
window.addEventListener('load', createStars); 

// Закрытие панели по кнопке
panelClose.addEventListener('click', () => {
  bettingPanel.classList.remove('visible');
  bettingPanel.style.display = 'none';
  startButton.style.display = 'block';
});

// Закрытие панели по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    bettingPanel.classList.remove('visible');
    bettingPanel.style.display = 'none';
    startButton.style.display = 'block';
  }
});

// Генерация случайного сигнала (для других валют)
function getRandomSignal() {
  const min = 100;
  const max = 999;
  const integer = Math.floor(Math.random() * (max - min + 1)) + min;
  const cents = Math.floor(Math.random() * 100);
  return integer + cents / 100; // два знака после точки
}

// Единый форматтер отображения валюты/значения
function formatCurrencySignal(label, value) {
  const sanitizedLabel = String(label || '').trim();
  const numeric = typeof value === 'number' ? value.toFixed(2) : String(value);

  // Если метка содержит '#', это суффикс
  if (/#/.test(sanitizedLabel)) {
    return `${numeric}#`;
  }
  // Алфавитные метки (Dollar, Rupee, Ruble) — префикс со пробелом
  if (/[A-Za-zА-Яа-я]/.test(sanitizedLabel)) {
    return `${sanitizedLabel} ${numeric}`;
  }
  // Символьные валюты — префикс без пробела
  if (/^[₽$₹€£¥]/.test(sanitizedLabel)) {
    return `${sanitizedLabel}${numeric}`;
  }
  // По умолчанию — префикс без пробела
  return `${sanitizedLabel}${numeric}`;
}