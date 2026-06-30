const stripeContainer = document.getElementById('stripe-container');
const stripeCount = 5; // Количество полос
const stripeSpacing = 20; // Расстояние между полосами (% от высоты экрана)

// Создаем полосы
for (let i = 0; i < stripeCount; i++) {
    const stripe = document.createElement('div');
    stripe.classList.add('stripe');
    stripe.style.animationDelay = `${i * (stripeSpacing / 100) * 2}s`;
    stripeContainer.appendChild(stripe);
}

// Логика смены GIF
const idleGif = document.getElementById('idleGif');
const actionGif = document.getElementById('actionGif');
const startButton = document.getElementById('startButton');
let gifPlaying = false;
const gifs = ['left.gif', 'right.gif']; // Массив с путями к гифкам

// Добавляем функцию создания облаков
function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';

    // Случайные размеры для разнообразия
    const size = 60 + Math.random() * 40;
    cloud.style.width = size + 'px';
    cloud.style.height = size/2 + 'px';

    // Случайная позиция по вертикали
    cloud.style.top = Math.random() * 60 + '%';

    // Случайная продолжительность анимации
    const duration = 15 + Math.random() * 10;
    cloud.style.animationDuration = duration + 's';

    document.getElementById('cloudContainer').appendChild(cloud);

    // Удаляем облако после завершения анимации
    setTimeout(() => {
        cloud.remove();
    }, duration * 1000);
}

// Создаем новые облака с интервалом
setInterval(createCloud, 3000);

// Создаем начальные облака
for(let i = 0; i < 5; i++) {
    createCloud();
}

// Панель иксов и курица-спрайт + трек заливки
const xPanel = document.getElementById('xPanel');
const multipliers = [1.92, 3.84, 7.68, 15.36, 30.72];
let xSegments = [];
let chickenSprite;
let xTrack, xFill;
const skyMessage = document.getElementById('skyMessage');

if (xPanel) {
    // Создаем трек и заливку (сплошная линия)
    xTrack = document.createElement('div');
    xTrack.className = 'x-track';
    xPanel.appendChild(xTrack);

    xFill = document.createElement('div');
    xFill.className = 'x-fill';
    xPanel.appendChild(xFill);

    // Создаем сегменты иксов (ярлыки)
    multipliers.forEach(m => {
        const seg = document.createElement('div');
        seg.className = 'x-segment';
        seg.textContent = `×${m}`;
        xPanel.appendChild(seg);
        xSegments.push(seg);
    });

    // Добавляем курицу-спрайт
    chickenSprite = document.createElement('img');
    chickenSprite.className = 'chicken-sprite';
    chickenSprite.src = '1.png';
    xPanel.appendChild(chickenSprite);
}

function moveChickenTo(index) {
    if (!xPanel || !chickenSprite) return;
    const seg = xSegments[index];
    if (!seg) return;
    const left = seg.offsetLeft + seg.offsetWidth / 2 - chickenSprite.offsetWidth / 2;
    chickenSprite.style.left = left + 'px';
    xSegments.forEach((s, i) => s.classList.toggle('active', i <= index));
}

const frameImages = ['1.png', '2.png', '3.png'];
let frameTimer = null, frameIdx = 0;
function startRunAnimation() {
    if (!chickenSprite) return;
    if (frameTimer) return; // уже бегаем
    frameIdx = 0;
    chickenSprite.src = frameImages[frameIdx];
    frameTimer = setInterval(() => {
        frameIdx = (frameIdx + 1) % frameImages.length;
        chickenSprite.src = frameImages[frameIdx];
    }, 120);
}

function setFillToStep(index) {
    if (!xTrack || !xFill) return;
    const trackWidth = xTrack.getBoundingClientRect().width;
    const ratio = (index + 1) / multipliers.length;
    const targetWidth = Math.max(0, Math.min(trackWidth, trackWidth * ratio));
    xFill.style.width = `${targetWidth}px`;
}

let currentStep = -1;
let cooldown = false;
let cooldownInterval = null;

function showSkyMessage(text) {
    if (!skyMessage) return;
    skyMessage.textContent = text;
    skyMessage.style.opacity = '1';
}
function hideSkyMessage() {
    if (!skyMessage) return;
    skyMessage.style.opacity = '0';
    skyMessage.textContent = '';
}

function onSignal() {
    if (cooldown) return; // игнор во время КД
    currentStep++;
    if (currentStep < multipliers.length) {
        moveChickenTo(currentStep);
        setFillToStep(currentStep);
        if (currentStep === multipliers.length - 1) {
            // Достигли 30.72x — запускаем КД с таймером в небе
            startCooldown(10);
        }
    }
}

// Упрощенный обработчик клика кнопки без истории игр
function setStartButtonDisabled(disabled) {
    if (!startButton) return;
    startButton.disabled = disabled;
    startButton.classList.toggle('disabled', disabled);
}

startButton.addEventListener('click', () => {
    if (gifPlaying || cooldown) return; // не даем нажать во время гифки или КД
    gifPlaying = true;
    setStartButtonDisabled(true);

    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    const bust = Date.now();
    const gifUrl = `${randomGif}?v=${bust}`;

    // Показ экшн-гифки только после загрузки, чтобы не было прыжка на последний кадр
    actionGif.style.display = 'none';
    actionGif.src = gifUrl;

    const showAction = () => {
        actionGif.style.display = 'block';
        if (idleGif) idleGif.style.display = 'none';

        // После завершения гифки возвращаемся к основной и запускаем сигнал
        setTimeout(() => {
            actionGif.style.display = 'none';
            if (idleGif) idleGif.style.display = 'block';

            gifPlaying = false;
            onSignal();
            // если не КД, снова разрешаем кнопку
            setStartButtonDisabled(cooldown);
        }, 4050);
    };

    if (actionGif.complete) {
        showAction();
    } else {
        const onLoad = () => {
            actionGif.removeEventListener('load', onLoad);
            showAction();
        };
        actionGif.addEventListener('load', onLoad);
    }
});

// Курицу запускаем в постоянный бег сразу
startRunAnimation();

function startCooldown(seconds = 10) {
    // включаем режим КД и показываем таймер
    cooldown = true;
    setStartButtonDisabled(true);
    let remaining = seconds;
    showSkyMessage(`КД: ${remaining}с`);

    // плавно возвращаем курицу к началу
    moveChickenTo(0);

    if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
    }
    cooldownInterval = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
            showSkyMessage(`КД: ${remaining}с`);
        } else {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
            // сброс прогресса
            xSegments.forEach(s => s.classList.remove('active'));
            if (xFill) xFill.style.width = '0px';
            currentStep = -1;
            cooldown = false;
            hideSkyMessage();
            setStartButtonDisabled(false);
        }
    }, 1000);
}