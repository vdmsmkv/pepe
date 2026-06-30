document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    initTelegramWebApp();
    
    // Определяем устройство
    detectDeviceType();
    
    // Показываем раздел Games по умолчанию
    showGamesSection();
    showSlides(slideIndex);
    
    // Улучшенная функция создания звезд
    createEnhancedStars();
    
    // Добавление эффекта нажатия на все кнопки
    addButtonClickEffects();

    // Система тем будет инициализирована в themes.js

    // Инициализация языка и селектора языка
    try {
        const savedLang = localStorage.getItem('language') || 'ru';
        document.documentElement.setAttribute('lang', savedLang);
        const langSelect = document.getElementById('languageSelector');
        if (langSelect) {
            langSelect.value = savedLang;
            langSelect.addEventListener('change', (e) => {
                const newLang = e.target.value;
                localStorage.setItem('language', newLang);
                document.documentElement.setAttribute('lang', newLang);
                changeLanguage(newLang);
            });
        }
        changeLanguage(savedLang);
    } catch (e) {
        console.warn('Language init warning:', e);
    }
});

// Инициализация Telegram Web App
function initTelegramWebApp() {
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // Раскрываем приложение на весь экран
            tg.expand();
            
            // Устанавливаем цвета темы
            tg.setHeaderColor('#000000');
            tg.setBackgroundColor('#111111');
            
            // Получаем данные пользователя
            const user = tg.initDataUnsafe?.user;
            
            if (user) {
                updateUserProfile(user);
            } else {
                // Если данные пользователя недоступны, показываем заглушку
                updateUserProfile({
                    first_name: 'Telegram',
                    last_name: 'User',
                    id: 'WebApp',
                    photo_url: null
                });
            }
            
            // Показываем, что WebApp готов
            tg.ready();
            
        } else {
            // Если Telegram WebApp API недоступен
            console.log('Telegram WebApp API не найден');
            updateUserProfile({
                first_name: 'Веб',
                last_name: 'Пользователь',
                id: 'demo',
                photo_url: null
            });
        }
    } catch (error) {
        console.error('Ошибка инициализации Telegram WebApp:', error);
        updateUserProfile({
            first_name: 'Пользователь',
            last_name: '',
            id: 'unknown',
            photo_url: null
        });
    }
}

// Обновление профиля пользователя
function updateUserProfile(user) {
    const userNameElement = document.getElementById('userName');
    const userIdElement = document.getElementById('userId');
    const userAvatarElement = document.getElementById('userAvatar');
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (userNameElement) {
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
        userNameElement.textContent = fullName || 'Пользователь';
    }
    
    if (userIdElement) {
        userIdElement.textContent = `ID: ${user.id}`;
    }
    
    if (userAvatarElement && user.photo_url) {
        userAvatarElement.src = user.photo_url;
        userAvatarElement.onerror = function() {
            // Если фото не загрузилось, используем улучшенную заглушку
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Ccircle cx='35' cy='35' r='30' fill='%234A90E2'/%3E%3Ctext x='35' y='42' font-family='Arial' font-size='28' fill='white' text-anchor='middle'%3E👤%3C/text%3E%3C/svg%3E";
        };
    }
    
    // Обновляем статус пользователя
    if (statusIndicator && statusText) {
        // Если пользователь из Telegram, показываем как онлайн
        if (user.id && user.id !== 'demo' && user.id !== 'unknown') {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'Online';
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Оффлайн';
        }
    }
}

// Показать раздел игр
function showGamesSection() {
    const gamesSection = document.getElementById('Games');
    if (gamesSection) {
        gamesSection.classList.add('active');
        gamesSection.style.display = 'flex';
    }
}

// Определение типа устройства
function detectDeviceType() {
    const deviceText = document.getElementById('deviceText');
    const deviceIcon = document.querySelector('.device-icon');
    
    if (!deviceText || !deviceIcon) return;
    
    const userAgent = navigator.userAgent;
    let deviceType = '';
    let icon = '';
    
    if (/Android/i.test(userAgent)) {
        deviceType = 'Android';
        icon = '🤖';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        if (/iPad/i.test(userAgent)) {
            deviceType = 'iPad';
            icon = '📱';
        } else {
            deviceType = 'iPhone';
            icon = '📱';
        }
    } else if (/Windows/i.test(userAgent)) {
        if (/Windows Phone/i.test(userAgent)) {
            deviceType = 'WinPhone';
            icon = '📱';
        } else {
            deviceType = 'Windows';
            icon = '💻';
        }
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
        deviceType = 'Mac';
        icon = '💻';
    } else if (/Linux/i.test(userAgent)) {
        deviceType = 'Linux';
        icon = '💻';
    } else {
        deviceType = 'Unknown';
        icon = '❓';
    }
    
    // Дополнительно проверяем размер экрана
    const screenWidth = window.innerWidth;
    if (screenWidth < 768 && !deviceType.includes('Phone') && !deviceType.includes('Android') && !deviceType.includes('iPhone')) {
        deviceType += ' Mobile';
    } else if (screenWidth >= 1200) {
        deviceType += ' Desktop';
    }
    
    deviceText.textContent = deviceType;
    deviceIcon.textContent = icon;
}

// Обновляем информацию об устройстве при изменении размера окна
window.addEventListener('resize', function() {
    detectDeviceType();
});

// Функция создания плавающих фигур убрана

// Создание пузырей
// Функция создания пузырей убрана

// Функции тем убраны


const translations = {
    en: {
        gamePickerTitle: "GAME PICKER",
        detectButton: "Detect device",
        startButton: "Start",
        game1Title: "Mines",
        game1Button: "Open",
        game2Title: "Mines Spibe",
        game2Button: "Open",
        game3Title: "Bombucks",
        game3Button: "Open",
        game4Title: "Brawl Pirates",
        game4Button: "Open",
        game5Title: "Royal Mines",
        game5Button: "Open",
        game6Title: "Penalty Shoot",
        game6Button: "Open",
        game7Title: "Football X",
        game7Button: "Open",
        game8Title: "Penalty Shoot",
        game8Button: "Open",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Open",
        game10Button: "Open",
        game11Button: "Open",
        game12Button: "Open",
        game13Button: "Open",
        telegramButton: "Go to telegram (RU)",
        telegramButton2: "Go to telegram (EN)"
    },
    ru: {
        gamePickerTitle: "ВЫБОР ИГР",
        detectButton: "Определить устройство",
        startButton: "Начать",
        game1Title: "Mines",
        game1Button: "Открыть",
        game2Title: "Mines Spibe",
        game2Button: "Открыть",
        game3Title: "Bombucks",
        game3Button: "Открыть",
        game4Title: "Brawl Pirates",
        game4Button: "Открыть",
        game5Title: "Royal Mines",
        game5Button: "Открыть",
        game6Title: "Penalty Shoot",
        game6Button: "Открыть",
        game7Title: "Football X",
        game7Button: "Открыть",
        game8Title: "Penalty Shoot",
        game8Button: "Открыть",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Открыть",
        game10Button: "Открыть",
        game11Button: "Открыть",
        game12Button: "Открыть",
        game13Button: "Открыть",
        telegramButton: "Перейти в телеграм (RU)",
        telegramButton2: "Перейти в телеграм (EN)"
    },
    hi: {
        gamePickerTitle: "गेम पिकर",
        detectButton: "डिवाइस का पता लगाएं",
        startButton: "शुरू करें",
        game1Title: "Mines",
        game1Button: "खोलें",
        game2Title: "Mines Spibe",
        game2Button: "खोलें",
        game3Title: "Bombucks",
        game3Button: "खोलें",
        game4Title: "Brawl Pirates",
        game4Button: "खोलें",
        game5Title: "Royal Mines",
        game5Button: "खोलें",
        game6Title: "Penalty Shoot",
        game6Button: "खोलें",
        game7Title: "Football X",
        game7Button: "खोलें",
        game8Title: "Penalty Shoot",
        game8Button: "खोलें",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "खोलें",
        game10Button: "खोलें",
        game11Button: "खोलें",
        game12Button: "खोलें",
        game13Button: "खोलें",
        telegramButton: "टेलीग्राम पर जाएं (RU)",
        telegramButton2: "टेलीग्राम पर जाएं (EN)"
    },
    br: {
        gamePickerTitle: "SELETOR DE JOGOS",
        detectButton: "Detectar dispositivo",
        startButton: "Iniciar",
        game1Title: "Mines",
        game1Button: "Abrir",
        game2Title: "Mines Spibe",
        game2Button: "Abrir",
        game3Title: "Bombucks",
        game3Button: "Abrir",
        game4Title: "Brawl Pirates",
        game4Button: "Abrir",
        game5Title: "Royal Mines",
        game5Button: "Abrir",
        game6Title: "Penalty Shoot",
        game6Button: "Abrir",
        game7Title: "Football X",
        game7Button: "Abrir",
        game8Title: "Penalty Shoot",
        game8Button: "Abrir",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Abrir",
        game10Button: "Abrir",
        game11Button: "Abrir",
        game12Button: "Abrir",
        game13Button: "Abrir",
        telegramButton: "Ir para o Telegram (RU)",
        telegramButton2: "Ir para o Telegram (EN)"
    },
    es: {
        gamePickerTitle: "SELECCIONADOR DE JUEGOS",
        detectButton: "Detectar dispositivo",
        startButton: "Iniciar",
        game1Title: "Mines",
        game1Button: "Abrir",
        game2Title: "Mines Spibe",
        game2Button: "Abrir",
        game3Title: "Bombucks",
        game3Button: "Abrir",
        game4Title: "Brawl Pirates",
        game4Button: "Abrir",
        game5Title: "Royal Mines",
        game5Button: "Abrir",
        game6Title: "Penalty Shoot",
        game6Button: "Abrir",
        game7Title: "Football X",
        game7Button: "Abrir",
        game8Title: "Penalty Shoot",
        game8Button: "Abrir",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Abrir",
        game10Button: "Abrir",
        game11Button: "Abrir",
        game12Button: "Abrir",
        game13Button: "Abrir",
        telegramButton: "Ir a Telegram (RU)",
        telegramButton2: "Ir a Telegram (EN)"
    },
    uz: {
        gamePickerTitle: "O'YIN TANLOVCHI",
        detectButton: "Qurilmani aniqlash",
        startButton: "Boshlash",
        game1Title: "Mines",
        game1Button: "Ochish",
        game2Title: "Mines Spibe",
        game2Button: "Ochish",
        game3Title: "Bombucks",
        game3Button: "Ochish",
        game4Title: "Brawl Pirates",
        game4Button: "Ochish",
        game5Title: "Royal Mines",
        game5Button: "Ochish",
        game6Title: "Penalty Shoot",
        game6Button: "Ochish",
        game7Title: "Football X",
        game7Button: "Ochish",
        game8Title: "Penalty Shoot",
        game8Button: "Ochish",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Ochish",
        game10Button: "Ochish",
        game11Button: "Ochish",
        game12Button: "Ochish",
        game13Button: "Ochish",
        telegramButton: "Telegramga o'tish (RU)",
        telegramButton2: "Telegramga o'tish (EN)"
    },
    az: {
        gamePickerTitle: "OYUN SEÇİCİ",
        detectButton: "Cihazı aşkar et",
        startButton: "Başla",
        game1Title: "Mines",
        game1Button: "Aç",
        game2Title: "Mines Spibe",
        game2Button: "Aç",
        game3Title: "Bombucks",
        game3Button: "Aç",
        game4Title: "Brawl Pirates",
        game4Button: "Aç",
        game5Title: "Royal Mines",
        game5Button: "Aç",
        game6Title: "Penalty Shoot",
        game6Button: "Aç",
        game7Title: "Football X",
        game7Button: "Aç",
        game8Title: "Penalty Shoot",
        game8Button: "Aç",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Aç",
        game10Button: "Aç",
        game11Button: "Aç",
        game12Button: "Aç",
        game13Button: "Aç",
        telegramButton: "Teleqrama keç (RU)",
        telegramButton2: "Teleqrama keç (EN)"
    },
    tr: {
        gamePickerTitle: "OYUN SEÇİCİ",
        detectButton: "Cihazı tespit et",
        startButton: "Başlat",
        game1Title: "Mines",
        game1Button: "Aç",
        game2Title: "Mines Spibe",
        game2Button: "Aç",
        game3Title: "Bombucks",
        game3Button: "Aç",
        game4Title: "Brawl Pirates",
        game4Button: "Aç",
        game5Title: "Royal Mines",
        game5Button: "Aç",
        game6Title: "Penalty Shoot",
        game6Button: "Aç",
        game7Title: "Football X",
        game7Button: "Aç",
        game8Title: "Penalty Shoot",
        game8Button: "Aç",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Aç",
        game10Button: "Aç",
        game11Button: "Aç",
        game12Button: "Aç",
        game13Button: "Aç",
        telegramButton: "Telegrame git (RU)",
        telegramButton2: "Telegrame git (EN)"
    },
    pt: {
        gamePickerTitle: "ESCOLHEDOR DE JOGOS",
        detectButton: "Detectar dispositivo",
        startButton: "Iniciar",
        game1Title: "Mines",
        game1Button: "Abrir",
        game2Title: "Mines Spibe",
        game2Button: "Abrir",
        game3Title: "Bombucks",
        game3Button: "Abrir",
        game4Title: "Brawl Pirates",
        game4Button: "Abrir",
        game5Title: "Royal Mines",
        game5Button: "Abrir",
        game6Title: "Penalty Shoot",
        game6Button: "Abrir",
        game7Title: "Football X",
        game7Button: "Abrir",
        game8Title: "Penalty Shoot",
        game8Button: "Abrir",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "Abrir",
        game10Button: "Abrir",
        game11Button: "Abrir",
        game12Button: "Abrir",
        game13Button: "Abrir",
        telegramButton: "Ir para o Telegram (RU)",
        telegramButton2: "Ir para o Telegram (EN)"
    },
    ar: {
        gamePickerTitle: "مُختار الألعاب",
        detectButton: "اكتشاف الجهاز",
        startButton: "ابدأ",
        game1Title: "Mines",
        game1Button: "فتح",
        game2Title: "Mines Spibe",
        game2Button: "فتح",
        game3Title: "Bombucks",
        game3Button: "فتح",
        game4Title: "Brawl Pirates",
        game4Button: "فتح",
        game5Title: "Royal Mines",
        game5Button: "فتح",
        game6Title: "Penalty Shoot",
        game6Button: "فتح",
        game7Title: "Football X",
        game7Button: "فتح",
        game8Title: "Penalty Shoot",
        game8Button: "فتح",
        game9Title: "Football X",
        game10Title: "CoinFlip",
        game9Button: "فتح",
        game10Button: "فتح",
        game11Button: "فتح",
        game12Button: "فتح",
        game13Button: "فتح",
        telegramButton: "اذهب إلى Telegram (RU)",
        telegramButton2: "اذهب إلى Telegram (EN)"
    }
};


function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error('Translations not found for language:', lang);
        return;
    }
    const t = translations[lang];
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    setText('game-picker-title', t.gamePickerTitle);
    setText('detect-button', t.detectButton);
    setText('start-button', t.startButton);

    // Переводим только кнопки "Open" и прочие элементы, но не названия игр
    setText('game1-button', t.game1Button);
    // Индексы соответствуют карточкам на главной странице
    setText('game2-button', t.game2Button);
    setText('game3-button', t.game3Button);
    setText('game4-button', t.game4Button);
    setText('game5-button', t.game5Button);
    setText('game6-button', t.game6Button);
    setText('game7-button', t.game7Button);
    setText('game8-button', t.game8Button ?? t.game7Button);
    setText('game9-button', t.game9Button ?? t.game7Button);
    setText('game10-button', t.game10Button);
    setText('game11-button', t.game11Button);
    setText('game12-button', t.game12Button);
    setText('game13-button', t.game13Button ?? t.game12Button);

    // Обновляем текст для кнопок Telegram
    setText('telegram-button', t.telegramButton);
    setText('telegram-button2', t.telegramButton2);
    // Пасхальное сообщение: локализуем отдельным словарём
    const easterEggTranslations = {
        en: 'Congrats, you reached the very end! If you see this message — DM me and grab a free voucher.',
        ru: 'Поздравляю, ты долистал до самого конца! Если ты видишь это сообщение — скорее беги ко мне в ЛС и забирай халявный ваучер.',
        uz: 'Tabriklayman, oxirigacha yetib kelding! Bu xabarni ko‘rsang — menga shaxsiy yoz va bepul vaucher ol.',
        hi: 'बधाई हो, आप बिल्कुल अंत तक पहुँच गए! अगर आप यह संदेश देख रहे हैं — मुझे डीएम करें और मुफ्त वाउचर लें।',
        az: 'Təbriklər, sona qədər çatdın! Bu mesajı görürsənsə — mənə DM yaz və pulsuz vauçeri götür.',
        br: 'Parabéns, você chegou até o fim! Se você vê esta mensagem — me chame no DM e pegue um voucher grátis.',
        es: '¡Felicidades, llegaste hasta el final! Si ves este mensaje — mándame un DM y consigue un voucher gratis.',
        tr: 'Tebrikler, en sona kadar geldin! Bu mesajı görüyorsan — bana DM at ve ücretsiz kuponu kap.',
        pt: 'Parabéns, você chegou ao fim! Se você vê esta mensagem — mande-me uma mensagem e pegue um voucher grátis.',
        ar: 'مبروك، لقد وصلت للنهاية! إذا ترى هذه الرسالة — راسلني لتحصل على قسيمة مجانية.'
    };
    if (easterEggTranslations[lang]) {
        setText('easterEgg', easterEggTranslations[lang]);
    }

    // Значки Hot/New остаются едиными по языкам
    const hotText = { en: 'Hot', ru: 'Hot', uz: 'Hot', hi: 'Hot', az: 'Hot' };
    const newText = { en: 'New', ru: 'New', uz: 'New', hi: 'New', az: 'New' };
    document.querySelectorAll('.game-badge, .game-badge-hot').forEach(b => b.innerText = hotText[lang]);
    document.querySelectorAll('.game-badge.new, .game-badge-new').forEach(b => b.innerText = newText[lang]);
}



// Создаем звезды с улучшенным эффектом
function createEnhancedStars() {
  const stars = document.getElementById('stars');
  if (!stars) { return; }
  const count = 320; // количество звезд
  
  // Очистим контейнер звезд для обновления
  stars.innerHTML = '';

  for(let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Рандомное положение
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Рандомный размер и прозрачность
    const size = Math.random() * 3 + 0.5;
    const opacity = Math.random() * 0.8 + 0.2;
    
    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.opacity = opacity;
    
    // Рандомная задержка мерцания и длительность
    star.style.animationDelay = Math.random() * 5 + 's';
    star.style.animationDuration = Math.random() * 3 + 2 + 's';
    
    // Небольшая вариация цвета для некоторых звезд
    if (Math.random() > 0.8) {
      const hue = Math.floor(Math.random() * 60);
      star.style.backgroundColor = `hsl(${hue}, 100%, 90%)`;
      star.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 100%, 80%)`;
    } else {
      star.style.boxShadow = `0 0 ${size}px rgba(255, 255, 255, 0.8)`;
    }
    
    stars.appendChild(star);
  }
}

// Добавление эффектов при нажатии на кнопки
function addButtonClickEffects() {
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Создаем эффект волны от нажатия
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      // Позиционируем эффект на месте клика
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Удаляем элемент после анимации
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

var slideIndex = 1;

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");
    var dots = document.getElementsByClassName("dot");
    var slidesContainer = document.querySelector(".slides");

    // Если слайдер не инициализирован на странице — аккуратно выходим
    if (!slidesContainer || slides.length === 0 || dots.length === 0) {
        return;
    }

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slidesContainer.style.transform = `translateX(${-(slideIndex - 1) * 100 / slides.length}%)`;
    dots[slideIndex - 1].className += " active";
}



function animate() {
    if (typeof ctx !== 'undefined' && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            if (particlesArray[i].size <= 0.3) {
                particlesArray.splice(i, 1);
                i--;
                particlesArray.push(new Particle());
            }
        }
        requestAnimationFrame(animate);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.1;
            }
            draw() {
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        function init() {
            for (let i = 0; i < 100; i++) {
                particlesArray.push(new Particle());
            }
        }

        init();
        animate();
    }
    
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const phrases = [];
        let phraseIndex = 0;
        let letterIndex = 0;
        let currentPhrase = [];
        let isDeleting = false;
        let delay = 60;
        
        function type() {
            if (isDeleting && currentPhrase.length === 0) {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                letterIndex = 0;
                isDeleting = false;
                if (phraseIndex === 0) {
                    setTimeout(type, 2000);
                    return;
                }
            } else if (!isDeleting && currentPhrase.length === phrases[phraseIndex].length) {
                isDeleting = true;
                delay = 2500;
            }

            if (isDeleting) {
                currentPhrase.pop();
                delay = 30;
            } else {
                currentPhrase.push(phrases[phraseIndex][letterIndex++]);
                delay = 120;
            }

            typingText.textContent = currentPhrase.join('');
            typingText.style.opacity = isDeleting ? 0.5 : 1;
            setTimeout(type, delay);
        }
        
        setTimeout(type, 2000);
    }
});

if (typeof $ !== 'undefined') {
    $(document).ready(function () {
        for (i = 0; i < 5; i++) {
            $(".list li").clone().appendTo(".list");
        }
        $('.button').click(function () {
            $('.window').css({
                right: "0"
            });
            $('.list li').css({
                border: '4px solid transparent'
            });
            function selfRandom(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var x = selfRandom(50, 100);
            $('.list li:eq('+x+')').css({
                border: '4px solid #00ba00'
            });

            var itemWidth = 100;
            var itemMargin = 8;
            $('.window').animate({
                right: ((x * itemWidth) + (x * itemMargin) - 119)
            }, 10000);
        });
    });
}

function detectDevice() {
    var ua = navigator.userAgent;
    var deviceType;
    var deviceModel = "";

    if (/android/i.test(ua)) {
        deviceType = "Android";
        var match = ua.match(/Android.*?; (\w+)\s(\w+)\s/);
        deviceModel = match ? match[1] + " " + match[2] : "";
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        deviceType = "iOS";
        if (/iPhone/i.test(ua)) {
            deviceModel = "iPhone";
        } else if (/iPad/i.test(ua)) {
            deviceModel = "iPad";
        } else if (/iPod/i.test(ua)) {
            deviceModel = "iPod";
        }
    } else {
        deviceType = "Desktop";
    }

    var output = deviceModel ? deviceType + " (" + deviceModel + ")" : deviceType;
    var deviceOutput = document.getElementById("device-output");
    deviceOutput.classList.remove("visible");
    setTimeout(function() {
        deviceOutput.textContent = output;
        deviceOutput.classList.add("visible");
    }, 10);
}

function triggerHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}

function startGame() {
    console.log(document.getElementById("device-output").textContent);
    if (document.getElementById("device-output").textContent.trim() === "Device not detected") {
        showModal();
    } else {
        const now = new Date().getTime();
        const lastGameTime = localStorage.getItem('lastGameTime');
        if (lastGameTime && now - lastGameTime < 60000) {
            showMiniModal();
            return;
        }
        var randomNumber = Math.floor(Math.random() * 5) + 1;
        var probability = Math.floor(Math.random() * 12) + 85;
        localStorage.setItem('lastGameTime', now);
        localStorage.setItem('lastGameImage', randomNumber);
        localStorage.setItem('lastProbability', probability);

        var imgContainer = document.querySelector('.image-container');
        var oldImage = imgContainer.querySelector('img');
        oldImage.style.display = 'none';

        var loaderDiv = document.createElement('div');
        loaderDiv.className = 'loader';
        imgContainer.appendChild(loaderDiv);

        setTimeout(function() {
            loaderDiv.remove();
            oldImage.style.display = 'block';
            oldImage.src = randomNumber + '.png';
            oldImage.style.marginLeft = "25px";
        }, 3000);
    }
}



function getGameName(imageNumber) {
    switch (imageNumber) {
        case '1':
            return 'Mines';
        case '2':
            return 'Royal Mines';
        case '3':
            return 'Brawl Pirates';
        case '4':
            return 'Bombucks';
        case '5':
            return 'LuckyJet';
        case '6':
            return 'Aviator';
        default:
            return '';
    }
}

function closeMiniModal() {
    var miniModal = document.getElementById('miniModal');
    miniModal.style.display = 'none';
}


function showModal() {
    var modal = document.getElementById("modal");
    modal.style.display = 'block';
    requestAnimationFrame(() => {
        modal.classList.add("show");
    });
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500); // 500ms - время вашей CSS transition
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function openGame(game) {
    triggerHapticFeedback();
    var ua = navigator.userAgent;
    var isIOS = /iPhone|iPad|iPod/i.test(ua);

    var links = {
        mines: {
            ios: 'mines/index.html',
            other: 'mines/index.html'
        },
        spribe: {
            ios: 'minesind/index.html',
            other: 'minesind/index.html'
        },
        royalMines: {
            ios: 'royal/index.html',
            other: 'royal/index.html'
        },
        brawlPirates: {
            ios: 'brawlpir/index.html',
            other: 'brawlpir/index.html'
        },
        penalty: {
            ios: 'penalty/index.html',
            other: 'penalty/index.html'
        },
        bomBucks: {
            ios: 'bombucks/index.html',
            other: 'bombucks/index.html'
        },
        lucky: {
            ios: 'jet/index.html',
            other: 'jet/index.html'
        },
        aviator: {
            ios: 'avi/index.html',
            other: 'avi/index.html'
        },
        footballX: {
            ios: 'footx/index.html',
            other: 'footx/index.html'
        },
        coin: {
            ios: 'monetka/index.html',
            other: 'monetka/index.html'
        },
        minesnew: {
            ios: 'minesnew/Mines.html',
            other: 'minesnew/Mines.html'
        },
        queen: {
            ios: 'queen/index.html',
            other: 'queen/index.html'
        },
        chick: {
            ios: 'chick/index.html',
            other: 'chick/index.html'
        },
        avia: {
            ios: 'aviamast/index.html',
            other: 'aviamast/index.html'
        },
        ball: {
            ios: 'ball/index.html',
            other: 'ball/index.html'
        },
        ba: {
            ios: 'ba/index.html',
            other: 'ba/index.html'
        },
        ho: {
            ios: 'ho/index.html',
            other: 'ho/index.html'
        },
        mineisland: {
            ios: 'mineisland/index.html',
            other: 'mineisland/index.html'
        },
        timb: {
            ios: 'timb/index.html',
            other: 'timb/index.html'
        },
        chickroad: {
            ios: 'chickroad/index.html',
            other: 'chickroad/index.html'
        }
    };
    var url = isIOS ? links[game].ios : links[game].other;
    try {
        const lang = localStorage.getItem('language') || 'ru';
        if (url.indexOf('?') === -1) {
            url += `?language=${encodeURIComponent(lang)}`;
        } else {
            url += `&language=${encodeURIComponent(lang)}`;
        }
    } catch (e) {
        // no-op if localStorage unavailable
    }
    window.location.href = url;
}