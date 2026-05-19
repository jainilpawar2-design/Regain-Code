const dataKey = "regainCodeTimerData";

const defaultData = {
    profileName: "Coder",
    totalSeconds: 0,
    sessions: [],
    streak: { current: 0, best: 0, lastDate: null },
};

const timerDisplay = document.getElementById("timerDisplay");
const timerSub = document.getElementById("timerSub");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("resetBtn");
const logBtn = document.getElementById("logBtn");
const totalTime = document.getElementById("totalTime");
const streak = document.getElementById("streak");
const bestStresk = document.getElementById("bestStreak");
const profileNameInput = document.getElementById("profileName");
const historyList = document.getElementById("historyList");

let data = loadData();
let timerInterval = null;
let startTimestamp = null;
let elapsedSeconds = 0;

function loadData() {
    const raw = localStorage.getItem(dataKey);
    if (!raw) return structuredClone(defaultData);
    try {
        const parsed = JSON.parse(raw);
        return {
             ...structuredClone(defaultData),
              ...parsed,
              streak: {
                ...structuredClone(defaultData.streak),
                ...(parsed.streak || {}),
              },
              sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
            };
        } catch (error) {
            return structuredClone(defaultData);
    }
}

function saveData() {
    localStorage.setItem(dataKey, JSON.stringify(data));
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hrs, mins, secs].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatShort(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
}

function dataKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function isYesterday(date) {
    const  prev = new Date(`${previousKey}T00:00:00`);
    const today = new Date(`${todayKey}T00:00:00` );
    return today - prev === 86400000;
}

function render () {
    timerDisplay.textContent = formatTime(elapsedSeconds);
}

function renderStats() {
    totalTime.textContent = formatShort(data.totalSeconds);
    streak.textContent = `${data.streak.current} days` ;
    bestStresk.textContent = `${data.streak.best} days` ;
    profileNameInput.value = data.profileName || "";
}

function renderHistory() {
    const recent = [...data.sessions]
    .sort((a, b) => new Date(b.end) - new Date(a.end))
    .slice(0, 10);

    historyList.innerHTML = recent.length
    ? recent
    .map((session) => {
        const date = new Date(session.end);
        return `<div class="history-item"><span>${date.toLocaleString()}</span><strong>${formatShort(session.duration)}</strong></div>`;
    })
    .join("")
    : "<div class=\"history-item\">No sessions logged yet.</div>";
}

function updateStreak(endDate) {
    const todayKey = dataKey(endDate);
    const lastKey = data.streak.lastDate;

    if (!lastKey) {
        data.streak.current = 1;
    } else if (lastKey === todayKey) {
        data.streak.current = data.streak.current || 1;
    } else if (isYesterday(lastKey, todayKey)) {
        data.streak.current = (data.streak.current || 0) + 1;
    } else {
        data.streak.current = 1;
    }

    data.streak.best = Math.max(data.streak.best || 0, data.streak.current);
    data.streak.lastDate = todayKey;
}

function startTimer() {
    if (timerInterval) return;
    startTimestamp = Date.now() - elapsedSeconds * 1000;
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
        render();
    }, 1000);
    timerSub.textContent = "Session running.";
}

function pauseTimer() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
    timerSub.textContent = "Paused.";
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedSeconds = 0;
    startTimestamp = null;
    render();
    timerSub.textContent = "Ready to start.";
}

function logSession() {
    if (elapsedSeconds <= 0) {
        timerSub.textContent = "Nothing to log yet.";
        return;
    }

    const end = new Date();
    const duration = elapsedSeconds;
    const start = new Date(end.getTime() - duration * 1000);

    data.sessions.push({
        id: `${Date.now()}`,
        start: start.toISOString(),
        end: endtoISOString(),
        duration,
    });

    data.totalSeconds += duration;
    updateStreak(end);
    saveData();
    resetTimer();
    renderStats();
    renderHistory();
}

profileNameInput.addEventListener("input", (event) => {
    data.profileName = event.target.value.trim() || "Coder";
    saveData();
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
logBtn.addEventListener("click", logSession);
resetBtn.addEventListener("click", resetTimer);

render();
renderStats();
renderHistory();
