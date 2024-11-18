// Загрузим звуковые файлы
let tapSound = new Audio('sounds/tap-sound.mp3');
let buttonSound = new Audio('sounds/button-sound.mp3');

// Установим начальную громкость
tapSound.volume = 1;  // Громкость максимальная для тапов
buttonSound.volume = 0.2; // Громкость для кнопки по умолчанию

// Флаг для того, чтобы звук не начинался заново
let isTapSoundPlaying = false;
let tapSoundInterval = null;

let tapCount = 0;
let energy = 0;
let krosh = document.getElementById('krosh');
let particleContainer = document.getElementById('particle-container');
let tapCounterDisplay = document.getElementById('tap-counter');
let kohnchitButton = document.getElementById('kohnchit-btn');

// Переменная для отслеживания времени бездействия
let inactivityTimeout;

// Обработчик клика по Крошу
krosh.addEventListener('click', () => {
  tapCount++;

  // Изменяем громкость звука в зависимости от количества тапов
  tapSound.volume = Math.min(0.5 + (tapCount / 500), 1);  // Устанавливаем громкость от 0.5 до 1

  if (!isTapSoundPlaying) {
    // Если звук не играет, начинаем воспроизведение
    tapSound.currentTime = 0;  // Перематываем звук в начало
    tapSound.play();
    isTapSoundPlaying = true;

    // Запускаем обновление звука
    tapSoundInterval = setInterval(() => {
      // Если звук не завершился, продолжаем проигрывать
      if (tapSound.ended) {
        tapSound.currentTime = 0;
        tapSound.play();
      }
    }, 100); // Проверяем звук каждые 100 мс
  }

  // Обновляем счетчик тапаний
  tapCounterDisplay.textContent = `Тапнуто: ${tapCount}`;

  // Анимация для Кроша при нажатии
  krosh.style.animation = 'krosh-click 0.5s ease-out';

  // Снимаем анимацию после завершения
  setTimeout(() => {
    krosh.style.animation = '';
  }, 500);  // Время анимации Кроша

  // Перезапускаем таймер бездействия (сбрасываем время)
  clearTimeout(inactivityTimeout);

  // Устанавливаем новый таймер для остановки звука
  inactivityTimeout = setTimeout(() => {
    isTapSoundPlaying = false;
    clearInterval(tapSoundInterval); // Останавливаем интервал
    tapSound.pause();
  }, 2000); // Если прошло 2 секунды без кликов, останавливаем звук
});

// Функция для создания частиц вокруг Кроша
function createParticles() {
  // Количество частиц зависит от количества тапаний
  let numParticles = Math.min(Math.floor(tapCount / 10) * 3, 1000);  // Увеличиваем количество частиц в 3 раза на каждые 10 тапов

  // Создаем частицы
  for (let i = 0; i < numParticles; i++) {
    let particle = document.createElement('div');
    particle.classList.add('particle');

    // Случайное направление и скорость
    let angle = Math.random() * 2 * Math.PI;
    let distance = Math.random() * 70 + 30;
    let speed = Math.random() * 3 + 2; // Увеличиваем скорость движения

    let startX = krosh.offsetLeft + krosh.width / 2 + Math.cos(angle) * distance;
    let startY = krosh.offsetTop + krosh.height / 2 + Math.sin(angle) * distance;

    // Добавляем CSS переменные для динамического управления движением
    particle.style.setProperty('--x', `${Math.cos(angle) * speed}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * speed}px`);

    // Устанавливаем начальные координаты
    particle.style.left = `${startX - 15}px`;
    particle.style.top = `${startY - 15}px`;

    // Добавляем частицу в контейнер
    particleContainer.appendChild(particle);

    // Удаляем частицу после завершения анимации
    setTimeout(() => {
      particle.remove();
    }, 1000);  // Длительность анимации всегда 1 секунда
  }
}

// Обработчик клика по кнопке "KOHЧИТЬ"
kohnchitButton.addEventListener('click', () => {
  if (tapCount >= 10) {
    // Если было сделано хотя бы 10 тапаний, запускаем создание частиц
    createParticles();

    // Изменяем громкость звука при нажатии на кнопку в зависимости от количества тапов
    buttonSound.volume = Math.min(0.2 + (tapCount / 1000), 1); // Увеличиваем громкость звука кнопки от 0.2 до 1 в зависимости от тапов

    // Воспроизводим звук при нажатии на кнопку
    buttonSound.currentTime = 0;  // Перематываем звук в начало
    buttonSound.play();

    tapCount = 0;  // Сбрасываем счетчик тапаний после нажатия на кнопку
    tapCounterDisplay.textContent = `Тапнуто: ${tapCount}`;
  }
});
