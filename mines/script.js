





document.addEventListener('DOMContentLoaded', function () {
    const cellsBoard = document.querySelector('.cells-board');
    if (!cellsBoard) {
        console.error('Element .cells-board not found.');
        return;
    }

    let originalState = cellsBoard.innerHTML;

    const params = new URLSearchParams(window.location.search);
    const botName = params.get('botName') || 'Unknown';
    const language = params.get('language') || 'ru';

    const translations = {
        en: {
            traps: 'traps',
            play: 'Play',
            back: 'Back',
            confirm: 'Confirm',
            cancel: 'Cancel',
            mode_all: 'Switch to All',
            mode_multiple: 'Switch to multiple',
            reset_question: 'Reset the board?'
        },
        ru: {
            traps: 'ловушки',
            play: 'Играть',
            back: 'Назад',
            confirm: 'Подтвердить',
            cancel: 'Отмена',
            mode_all: 'Переключить на все',
            mode_multiple: 'Переключить на несколько',
            reset_question: 'Сбросить поле?'
        },
        uz: {
            traps: 'tuzoq',
            play: "O‘ynash",
            back: 'Ortga',
            confirm: 'Tasdiqlash',
            cancel: 'Bekor qilish',
            mode_all: "Hammasiga o‘tish",
            mode_multiple: "Bir nechaga o‘tish",
            reset_question: 'Maydonni tiklash?'
        },
        hi: {
            traps: 'फंदे',
            play: 'खेलें',
            back: 'वापस',
            confirm: 'पुष्टि करें',
            cancel: 'रद्द करें',
            mode_all: 'सभी पर स्विच करें',
            mode_multiple: 'मल्टीपल पर स्विच करें',
            reset_question: 'बोर्ड रीसेट करें?'
        },
        az: {
            traps: 'tələlər',
            play: 'Oyna',
            back: 'Geri',
            confirm: 'Təsdiqlə',
            cancel: 'Ləğv et',
            mode_all: 'Hamısına keç',
            mode_multiple: 'Bir neçəyə keç',
            reset_question: 'Taxtanı sıfırlamaq?'
        }
    };

    function t(key) {
        const dict = translations[language] || translations['en'];
        return dict[key] || key;
    }

    function applyTranslations() {
        document.documentElement.setAttribute('lang', language);
        // Set texts for data-i18n elements
        const nodes = document.querySelectorAll('[data-i18n]');
        nodes.forEach(node => {
            const key = node.getAttribute('data-i18n');
            const value = t(key);
            if (value) node.textContent = value;
        });

        // Mode button reflects current mode
        if (modeButton) {
            modeButton.textContent = currentMode === 'nesk' ? t('mode_all') : t('mode_multiple');
        }

        // Optional popup content
        const popupContent = document.getElementById('popup-content');
        if (popupContent && !popupContent.textContent.trim()) {
            popupContent.textContent = t('reset_question');
        }
    }

    // Congrats modal elements
    const congratsPopup = document.getElementById('congratsPopup');
    const congratsText = document.getElementById('congratsText');
    const closeCongratsBtn = document.getElementById('closeCongrats');
    const telegramBtn = document.getElementById('telegramButton');

    // Play-button tracking: show modal after 5–7 clicks total, once
    let deliveredPlays = 0;
    let congratsShown = false;
    const playsThreshold = 5 + Math.floor(Math.random() * 3); // 5..7

    function updatePlays(increment) {
        deliveredPlays += increment;
        if (!congratsShown && deliveredPlays >= playsThreshold) {
            showCongrats(deliveredPlays);
            congratsShown = true;
        }
    }

    function showCongrats(signalsCount) {
        if (!congratsPopup) return;
        const countText = `${signalsCount}`;
        const message = `Поздравляю, ты долистал до самого конца! Ты нажал кнопку «Играть» ${countText} раз. Если ты видишь это сообщение — скорее беги ко мне в ЛС и забирай халявный ваучер.`;
        if (congratsText) congratsText.textContent = message;
        congratsPopup.classList.remove('hidden');
    }

    if (closeCongratsBtn && congratsPopup) {
        closeCongratsBtn.addEventListener('click', () => {
            congratsPopup.classList.add('hidden');
        });
    }

    if (telegramBtn) {
        telegramBtn.addEventListener('click', () => {
            // Just let the anchor navigate; could add analytics here
        });
    }

    const trapsOptions = [1, 3, 5, 7];
    const trapsToCellsOpenMapping = {
        1: 7,
        3: 5,
        5: 4,
        7: 3
    };
    let currentPresetIndex = 0;
    const trapsAmountElement = document.getElementById('trapsAmount');
    const prevPresetBtn = document.getElementById('prev_preset_btn');
    const nextPresetBtn = document.getElementById('next_preset_btn');
    const modeButton = document.getElementById('modeButton');
    let currentMode = 'nesk'; // Default mode

    function updateTrapsAmount() {
        if (trapsAmountElement) {
            trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
        }
    }

    if (prevPresetBtn) {
        prevPresetBtn.addEventListener('click', function () {
            if (currentPresetIndex > 0) {
                currentPresetIndex--;
                updateTrapsAmount();
            }
        });
    }

    if (nextPresetBtn) {
        nextPresetBtn.addEventListener('click', function () {
            if (currentPresetIndex < trapsOptions.length - 1) {
                currentPresetIndex++;
                updateTrapsAmount();
            }
        });
    }

    if (modeButton) {
        modeButton.addEventListener('click', function () {
            currentMode = currentMode === 'nesk' ? 'all' : 'nesk';
            modeButton.textContent = currentMode === 'nesk' ? t('mode_all') : t('mode_multiple');
        });
    }

    updateTrapsAmount();
    applyTranslations();

    function attachCellClickListeners() {
        const cells = document.querySelectorAll('.cells-board .cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                cell.style.transform = 'scale(0.7)';
                setTimeout(() => {
                    cell.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    function reloadSVG(svgElement) {
        svgElement.style.display = 'block';
        return svgElement;
    }

    let isFirstPlay = true;

    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', function () {
            playButton.disabled = true;

            let cells = document.querySelectorAll('.cells-board .cell');

            if (!isFirstPlay) {
                cellsBoard.innerHTML = '';
                generateCells();
                cells = document.querySelectorAll('.cells-board .cell');
            }

            const trapsAmount = parseInt(trapsAmountElement.textContent);
            const totalCells = cells.length;
            const minePositions = new Set();

            while (minePositions.size < trapsAmount) {
                const randomPos = Math.floor(Math.random() * totalCells);
                minePositions.add(randomPos);
            }

            if (currentMode === 'nesk') {
                const cellsToOpen = trapsToCellsOpenMapping[trapsAmount] || 0;
                const selectedCells = [];

                while (selectedCells.length < cellsToOpen) {
                    const randomIndex = Math.floor(Math.random() * cells.length);
                    if (!selectedCells.includes(randomIndex)) {
                        selectedCells.push(randomIndex);
                    }
                }

                let starIndex = 0;
                function animateStars() {
                    if (starIndex < selectedCells.length) {
                        const index = selectedCells[starIndex];
                        const cell = cells[index];

                        cell.classList.add('cell-fade-out');

                        setTimeout(async () => {
                            cell.innerHTML = '';

                            try {
                                const response = await fetch('img/stars.svg');
                                const svgText = await response.text();

                                const container = document.createElement('div');
                                container.style.cssText = `
                                    width: 56px;
                                    height: 56px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    position: relative;
                                `;

                                container.innerHTML = svgText;
                                cell.appendChild(container);

                                const svgElement = container.querySelector('svg');
                                if (svgElement) {
                                    svgElement.style.cssText = `
                                        width: 56px;
                                        height: 56px;
                                        max-width: 100%;
                                        max-height: 100%;
                                        display: block;
                                        opacity: 0;
                                        transform: scale(0);
                                        transition: opacity 0.3s, transform 0.3s;
                                    `;

                                    const originalViewBox = svgElement.getAttribute('viewBox');
                                    if (!originalViewBox) {
                                        const width = svgElement.getAttribute('width') || '100';
                                        const height = svgElement.getAttribute('height') || '100';
                                        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                                    }

                                    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                                    svgElement.classList.add('star-animation');

                                    requestAnimationFrame(() => {
                                        svgElement.style.opacity = '1';
                                        svgElement.style.transform = 'scale(1)';
                                    });
                                }
                            } catch (error) {
                                const newImg = document.createElement('img');
                                newImg.style.cssText = `
                                    width: 56px;
                                    height: 56px;
                                    display: block;
                                    will-change: transform, opacity;
                                    opacity: 0;
                                    transform: scale(0);
                                    transition: opacity 0.3s, transform 0.3s;
                                `;
                                newImg.src = 'img/stars.svg';
                                cell.appendChild(newImg);

                                requestAnimationFrame(() => {
                                    newImg.style.opacity = '1';
                                    newImg.style.transform = 'scale(1)';
                                });
                            }

                            cell.classList.remove('cell-fade-out');
                            starIndex++;
                            setTimeout(animateStars, 700);
                        }, 400);
                    } else {
                        playButton.disabled = false;
                        if (isFirstPlay) {
                            isFirstPlay = false;
                        }
                        // Count this Play press regardless of traps
                        updatePlays(1);
                    }
                }
                animateStars();
            } else {
                Promise.all([...cells].map((cell, index) => {
                    return new Promise(async (resolve) => {
                        cell.classList.add('cell-fade-out');
                        cell.innerHTML = '';

                        try {
                            const response = await fetch(minePositions.has(index) ? 'img/krest.svg' : 'img/stars.svg');
                            const svgText = await response.text();

                            const container = document.createElement('div');
                            container.style.cssText = `
                                width: 56px;
                                height: 56px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                            `;

                            container.innerHTML = svgText;
                            cell.appendChild(container);

                            const svgElement = container.querySelector('svg');
                            if (svgElement) {
                                svgElement.style.cssText = `
                                    width: 56px;
                                    height: 56px;
                                    max-width: 100%;
                                    max-height: 100%;
                                    display: block;
                                    opacity: 0;
                                    transform: scale(0);
                                    transition: opacity 0.3s, transform 0.3s;
                                `;

                                const originalViewBox = svgElement.getAttribute('viewBox');
                                if (!originalViewBox) {
                                    const width = svgElement.getAttribute('width') || '100';
                                    const height = svgElement.getAttribute('height') || '100';
                                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                                }

                                svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                                svgElement.classList.add('star-animation');
                                svgElement.style.opacity = '0';
                                svgElement.style.transform = 'scale(0)';

                                requestAnimationFrame(() => {
                                    svgElement.style.opacity = '1';
                                    svgElement.style.transform = 'scale(1)';
                                });
                            }
                        } catch (error) {
                            const newImg = document.createElement('img');
                            newImg.style.cssText = `
                                width: 56px;
                                height: 56px;
                                display: block;
                                will-change: transform, opacity;
                                opacity: 0;
                                transform: scale(0);
                                transition: opacity 0.3s, transform 0.3s;
                            `;
                            newImg.src = minePositions.has(index) ? 'img/krest.svg' : 'img/stars.svg';
                            cell.appendChild(newImg);

                            requestAnimationFrame(() => {
                                newImg.style.opacity = '1';
                                newImg.style.transform = 'scale(1)';
                            });
                        }

                        cell.classList.remove('cell-fade-out');
                        resolve();
                    });
                })).then(() => {
                    playButton.disabled = false;
                    if (isFirstPlay) {
                        isFirstPlay = false;
                    }
                    // Count this Play press regardless of traps
                    updatePlays(1);
                });
            }
        });
    }

    function generateCells() {
        const cellImages = [
            'output_svgs/image_5450.svg',
            'output_svgs/image_11641.svg',
            'output_svgs/image_18337.svg',
            'output_svgs/image_24493.svg',
            'output_svgs/image_31201.svg',
            'output_svgs/image_37357.svg',
            'output_svgs/image_44065.svg',
            'output_svgs/image_50221.svg',
            'output_svgs/image_56929.svg',
            'output_svgs/image_63085.svg',
            'output_svgs/image_69793.svg',
            'output_svgs/image_75949.svg',
            'output_svgs/image_82645.svg',
            'output_svgs/image_89353.svg',
            'output_svgs/image_95509.svg',
            'output_svgs/image_102217.svg',
            'output_svgs/image_108373.svg',
            'output_svgs/image_115081.svg',
            'output_svgs/image_121237.svg',
            'output_svgs/image_127381.svg',
            'output_svgs/image_134077.svg',
            'output_svgs/image_140221.svg',
            'output_svgs/image_146917.svg',
            'output_svgs/image_153061.svg',
            'output_svgs/image_159757.svg'
        ];

        cellImages.forEach(imageSrc => {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cell';
            cell.innerHTML = `<img width="56" height="56" src="${imageSrc}">`;
            cellsBoard.appendChild(cell);
        });

        attachCellClickListeners();
    }

    generateCells();
});