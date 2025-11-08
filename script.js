const audio = document.getElementById("backgroundMusic");
const button = document.getElementById("musicToggle");
const icon = button.querySelector(".music-icon");

audio.volume = 0.1;
audio
  .play()
  .then(() => {
    icon.src = "img/play.png";
    button.title = "Выключить музыку";
  })
  .catch(() => {
    console.log("Автовоспроизведение заблокировано");
  });

button.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    icon.src = "img/plat.png";
    button.title = "Выключить музыку";
  } else {
    audio.pause();
    icon.src = "img/stop.png";
    button.title = "Включить музыку";
  }
});

audio.addEventListener("play", () => {
  icon.src = "img/play.png";
  button.title = "Выключить музыку";
});

audio.addEventListener("pause", () => {
  icon.src = "img/stop.png";
  button.title = "Включить музыку";
});

GitHubCalendar(".calendar-container", "hhhakky", {
  responsive: true,
  tooltips: true,
  global_stats: false,
});

class SnowflakeManager {
  constructor({
    poolSize = 60,
    spawnInterval = 200,
    minSize = 10,
    maxSize = 30,
    minDuration = 8,
    maxDuration = 16,
  } = {}) {
    this.poolSize = poolSize;
    this.spawnInterval = spawnInterval;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
    this.snowflakes = [];
    this.container = document.body;
    this.isRunning = false;
    this.symbol = "❄️";
    this.init();
  }

  init() {
    this.createSnowflakePool();
    this.start();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
      else this.start();
    });
  }

  createSnowflakePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.textContent = this.symbol;
      snowflake.style.display = "none";
      this.container.appendChild(snowflake);
      this.snowflakes.push({
        element: snowflake,
        inUse: false,
        lastUsed: 0,
      });
    }
  }

  getAvailableSnowflake() {
    const now = Date.now();
    return this.snowflakes.find(
      (snowflake) => !snowflake.inUse && now - snowflake.lastUsed > 100,
    );
  }

  createSnowflake() {
    const snowflakeData = this.getAvailableSnowflake();
    if (!snowflakeData) return;

    const snowflake = snowflakeData.element;
    const size = Math.random() * (this.maxSize - this.minSize) + this.minSize;
    const duration =
      Math.random() * (this.maxDuration - this.minDuration) + this.minDuration;

    snowflake.style.fontSize = size + "px";
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.animationDuration = duration + "s";
    snowflake.style.display = "block";

    if (size <= 12) {
      snowflake.style.filter =
        "blur(1.5px) drop-shadow(0 0 3px rgba(255,255,255,0.4))";
      snowflake.style.opacity = "0.7";
    } else {
      snowflake.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.6))";
      snowflake.style.opacity = "0.9";
    }

    snowflake.style.animation = "none";
    void snowflake.offsetWidth;
    snowflake.style.animation = `fall ${duration}s linear forwards`;

    snowflakeData.inUse = true;
    snowflakeData.lastUsed = Date.now();

    setTimeout(() => {
      snowflake.style.display = "none";
      snowflakeData.inUse = false;
    }, duration * 1000);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(
      () => this.createSnowflake(),
      this.spawnInterval,
    );
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SnowflakeManager({
    poolSize: 80,
    spawnInterval: 300,
    minSize: 10,
    maxSize: 30,
    minDuration: 8,
    maxDuration: 16,
  });
});

(async function () {
  const username = "hhhakky";
  const container = document.querySelector(".projec .body");
  container.innerHTML = "Загрузка...";

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=1`,
    );
    if (!res.ok) throw new Error(res.status);
    const [repo] = await res.json();

    container.innerHTML = `
            <div class="repo-card">
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                <div class="repo-desc">${repo.description || "Без описания"}</div>
                <div class="repo-meta">
                    ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 🕒 ${new Date(repo.updated_at).toLocaleDateString()}
                </div>
            </div>
        `;
  } catch (e) {
    console.error(e);
    container.innerHTML = "Не удалось загрузить репозиторий 😢";
  }
})();
