// ========== СИСТЕМА ТЕМ С ВЫДВИЖНЫМ МЕНЮ ==========

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // темная тема по умолчанию
        this.themes = ['dark', 'blue', 'purple', 'green', 'red', 'gold'];
        this.isSettingsOpen = false;
        this.init();
    }

    init() {
        // Загружаем сохраненную тему
        const savedTheme = localStorage.getItem('selected-theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Инициализируем кнопку настроек и выдвижное меню
        this.initSettingsButton();
        this.initSettingsPanel();
    }

    initSettingsButton() {
        const settingsBtn = document.getElementById('settingsBtn');
        if (!settingsBtn) {
            console.log('Кнопка настроек не найдена, повторяем попытку...');
            setTimeout(() => this.initSettingsButton(), 200);
            return;
        }

        // Добавляем обработчики для кнопки настроек
        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSettings();
        });

        settingsBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleSettings();
        }, { passive: false });

        console.log('Кнопка настроек инициализирована');
    }

    initSettingsPanel() {
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsContent = settingsPanel?.querySelector('.settings-content');
        
        if (!settingsPanel || !settingsContent) {
            console.log('Панель настроек не найдена, повторяем попытку...');
            setTimeout(() => this.initSettingsPanel(), 200);
            return;
        }

        // Создаем сетку тем
        const themeGrid = document.createElement('div');
        themeGrid.className = 'settings-theme-grid';
        
        // Создаем кнопки для каждой темы
        this.themes.forEach(theme => {
            const themeBtn = document.createElement('div');
            themeBtn.className = 'settings-theme-btn';
            themeBtn.setAttribute('data-theme', theme);
            themeBtn.setAttribute('title', this.getThemeName(theme));
            themeBtn.setAttribute('role', 'button');
            themeBtn.setAttribute('tabindex', '0');
            
            // Добавляем название темы
            const themeName = document.createElement('span');
            themeName.className = 'theme-name';
            themeName.textContent = this.getThemeShortName(theme);
            themeBtn.appendChild(themeName);
            
            // Добавляем обработчики событий
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Переключаем тему на:', theme);
                this.setTheme(theme);
                this.addClickFeedback(themeBtn);
            });
            
            themeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Touch: переключаем тему на:', theme);
                this.setTheme(theme);
                this.addClickFeedback(themeBtn);
            }, { passive: false });
            
            themeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.setTheme(theme);
                    this.addClickFeedback(themeBtn);
                }
            });
            
            themeGrid.appendChild(themeBtn);
        });
        
        settingsContent.appendChild(themeGrid);
        
        // Устанавливаем начальную активную кнопку
        this.updateActiveButton();
        
        // Добавляем обработчик для закрытия панели при клике вне её
        document.addEventListener('click', (e) => {
            if (this.isSettingsOpen && 
                !settingsPanel.contains(e.target) && 
                !document.getElementById('settingsBtn').contains(e.target)) {
                this.closeSettings();
            }
        });

        console.log('Панель настроек инициализирована');
    }

    toggleSettings() {
        if (this.isSettingsOpen) {
            this.closeSettings();
        } else {
            this.openSettings();
        }
    }

    openSettings() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (!settingsBtn || !settingsPanel) return;

        this.isSettingsOpen = true;
        settingsBtn.classList.add('active');
        settingsPanel.classList.add('active');
        
        // Добавляем вибрацию и тактильную обратную связь
        this.addClickFeedback(settingsBtn);
        
        console.log('Меню настроек открыто');
    }

    closeSettings() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (!settingsBtn || !settingsPanel) return;

        this.isSettingsOpen = false;
        settingsBtn.classList.remove('active');
        settingsPanel.classList.remove('active');
        
        console.log('Меню настроек закрыто');
    }

    setTheme(themeName) {
        if (!this.themes.includes(themeName)) return;
        
        this.currentTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('selected-theme', themeName);
        
        // Обновляем активную кнопку
        this.updateActiveButton();
        
        // Диспатчим событие смены темы
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName }
        }));
        
        console.log(`Тема изменена на: ${themeName}`);
    }

    updateActiveButton() {
        const themeButtons = document.querySelectorAll('.settings-theme-btn');
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === this.currentTheme) {
                btn.classList.add('active');
            }
        });
    }

    getThemeName(theme) {
        const names = {
            dark: 'Темная тема',
            blue: 'Синяя тема',
            purple: 'Фиолетовая тема',
            green: 'Зеленая тема',
            red: 'Красная тема',
            gold: 'Золотая тема'
        };
        return names[theme] || theme;
    }

    getThemeShortName(theme) {
        const names = {
            dark: 'Dark',
            blue: 'Blue',
            purple: 'Purple',
            green: 'Green',
            red: 'Red',
            gold: 'Gold'
        };
        return names[theme] || theme;
    }

    getNextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        return this.themes[nextIndex];
    }

    getPreviousTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const prevIndex = currentIndex === 0 ? this.themes.length - 1 : currentIndex - 1;
        return this.themes[prevIndex];
    }

    // Переключение на следующую тему (для быстрого доступа)
    nextTheme() {
        this.setTheme(this.getNextTheme());
    }

    // Переключение на предыдущую тему
    previousTheme() {
        this.setTheme(this.getPreviousTheme());
    }

    // Добавляем тактильную обратную связь для мобильных
    addClickFeedback(element) {
        // Вибрация для мобильных устройств
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Визуальная обратная связь
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 100);
        
        // Тактильная обратная связь для Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
}

// Глобальная инициализация менеджера тем
let themeManager;

// Инициализируем после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ждем немного чтобы все элементы загрузились
    setTimeout(() => {
        themeManager = new ThemeManager();
    }, 100);
    
    // Добавляем горячие клавиши для смены тем (опционально)
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Shift + T для переключения темы
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (themeManager) themeManager.nextTheme();
        }
        
        // Escape для закрытия настроек
        if (e.key === 'Escape' && themeManager && themeManager.isSettingsOpen) {
            e.preventDefault();
            themeManager.closeSettings();
        }
    });
});

// Экспортируем для использования в других скриптах
window.ThemeManager = ThemeManager; 

// ========== МЕНЕДЖЕР ЯЗЫКА С ВЫДВИЖНОЙ ПАНЕЛЬЮ ==========
class LanguageManager {
    constructor() {
        this.languages = [
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'uz', name: 'Oʻzbek', flag: '🇺🇿' },
            { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' }
        ];
        this.currentLang = localStorage.getItem('language') || 'ru';
        this.isPanelOpen = false;
        this.init();
    }

    init() {
        this.initLanguageButton();
        this.initLanguagePanel();
        this.applyCurrentLanguage();
    }

    initLanguageButton() {
        const btn = document.getElementById('languageBtn');
        const flagEl = document.getElementById('languageFlag');
        const textEl = document.getElementById('languageText');

        if (!btn || !flagEl || !textEl) {
            setTimeout(() => this.initLanguageButton(), 200);
            return;
        }

        const langData = this.languages.find(l => l.code === this.currentLang) || this.languages[0];
        flagEl.textContent = langData.flag;
        textEl.textContent = langData.name;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.togglePanel();
            this.addClickFeedback(btn);
        });

        document.addEventListener('click', (e) => {
            const panel = document.getElementById('languagePanel');
            if (this.isPanelOpen && panel && !panel.contains(e.target) && !btn.contains(e.target)) {
                this.closePanel();
            }
        });
    }

    initLanguagePanel() {
        const panel = document.getElementById('languagePanel');
        const grid = document.getElementById('settingsLangGrid');
        if (!panel || !grid) {
            setTimeout(() => this.initLanguagePanel(), 200);
            return;
        }

        // навесим слушатели на кнопки языков
        grid.querySelectorAll('.settings-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
                this.addClickFeedback(btn);
            });
        });

        this.updateActiveLang();
    }

    togglePanel() {
        if (this.isPanelOpen) this.closePanel(); else this.openPanel();
    }

    openPanel() {
        const panel = document.getElementById('languagePanel');
        const btn = document.getElementById('languageBtn');
        if (!panel || !btn) return;
        // Если открыта панель тем — закроем её, чтобы не было наложения
        try {
            if (typeof themeManager !== 'undefined' && themeManager && themeManager.isSettingsOpen) {
                themeManager.closeSettings();
            }
        } catch(_) {}
        this.isPanelOpen = true;
        panel.classList.add('active');
        btn.classList.add('active');
    }

    closePanel() {
        const panel = document.getElementById('languagePanel');
        const btn = document.getElementById('languageBtn');
        if (!panel || !btn) return;
        this.isPanelOpen = false;
        panel.classList.remove('active');
        btn.classList.remove('active');
    }

    setLanguage(lang) {
        const info = this.languages.find(l => l.code === lang);
        if (!info) return;
        this.currentLang = info.code;
        localStorage.setItem('language', this.currentLang);
        document.documentElement.setAttribute('lang', this.currentLang);

        // Обновим плашку
        const flagEl = document.getElementById('languageFlag');
        const textEl = document.getElementById('languageText');
        if (flagEl) flagEl.textContent = info.flag;
        if (textEl) textEl.textContent = info.name;

        // Обновим активную кнопку
        this.updateActiveLang();

        // Сообщим об изменении языка и применим переводы
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
        if (typeof window.changeLanguage === 'function') {
            try { window.changeLanguage(this.currentLang); } catch (e) { console.warn('changeLanguage error', e); }
        }
    }

    applyCurrentLanguage() {
        if (typeof window.changeLanguage === 'function') {
            try { window.changeLanguage(this.currentLang); } catch (e) { console.warn('changeLanguage error', e); }
        }
    }

    updateActiveLang() {
        const grid = document.getElementById('settingsLangGrid');
        if (!grid) return;
        grid.querySelectorAll('.settings-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLang);
        });
    }

    addClickFeedback(element) {
        if (navigator.vibrate) navigator.vibrate(40);
        element.style.transform = 'scale(0.95)';
        setTimeout(() => { element.style.transform = ''; }, 100);
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
}

let languageManager;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        languageManager = new LanguageManager();
    }, 120);
});

window.LanguageManager = LanguageManager;