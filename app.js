const dataKey = "regainCodeTimerData";

const badges = [
    { 
        id: "first_session",
        title: "First Commit",
        desc: "Log your first coding session.",
        isUnlocked: (data) => data.sessions.length >= 1,
    },
    {
        id: "one_hour",
        title:"One-Hour Flow",
        desc: "Reach 1 hour total coding time.",
        isUnlocked: (data) => data.totalSeconds >= 3600,
    },
    {
        id: "three_hours",
        title: "Deep Focus",
        desc: "Reach 3 hour total coding timer.",
        isUnlocked: (data) => data.totalSeconds >= 10800,
    },
    {
        id: "ten_sessions",
        title: "Te Logs",
        desc: "Complete 10 coding sessions.",
        isUnlocked: (data) => data.sessions.length >= 10,
    },
    {
        id: "long_session",
        title: "Long Haul",
        desc: "Log a session longer than 2 hours.",
        isUnlocked: (data) => data.streak.some((s) => s.duration >= 7200),
    },
    {
        id: "streak_3",
        title: "Streak 3",
        desc: "Code 3 days in a row.",
        isUnlocked: (data) => data.streak.best >= 3,
    },
    {
        id: "streak_7",
        title: "Streak 7",
        desc: " Code 7 days in a row",
        isUnlocked: (data) => data.streak.best >= 7,
    },
];

const defaultData = {
    profileName: "Coder",
    totalSeconds: 0,
    sessions: [],
    streak: {
        current: 0,
        best: 0,
        lastDate: null,
},
};

const timerDisplay = document.getElementById("timerDisplay");
const timerSub = document.getElementById("timerSub");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const logBtn = document.getElementById("logBtn");
const resetBtn = document.getElementById("resetBtn");
const totalTime = document.getElementById("totalTime");
const streak = document.getElementById("streak");
const bestStresk = document.getElementById("bestStreak");
const profileNameInput = document.getElementById("profileName");
const historyList = document.getElementById("historyList");
const  profilePill = document.getElementById("profilePill");
const badgeGrid = document.getElementById("badgeGrid");
const topSessions = document.getElementById("topSessions");
const topDays = document.getElementById("topDays");
const netStatus = document.getElementById("netStatus");

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
    return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
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

function isYesterday(prevKey, todayKey) {
    const  prev = new Date(`${previousKey}T00:00:00`);
    const today = new Date(`${todayKey}T00:00:00` );
    return today - prev === 86400000;
}

function updateNetStatus() {
    if (navigator.onLine) {
        netStatus.textContent = "Online and ready offline";
    } else {
        netStatus.textContent = "Using offline mode";
    }
}

function updateTimerDisplay() {
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
    .join(""):

    if (!recent.length) {
    historyList.innerHTML = "<div class=\"history-item\">No sessions logged yet.</div>";
}
}

function renderProfile() {
    profilePill.textContent = data.profileName || "Coder";
    profileNameInput.value = data.profileName || "";
}

function renderBadges () {
    badgeGrid.innerHTML ="";
    badges.forEach(badge) => {
        const unlocked = badge.isUnlocked(data);
        const div = document.createElement("div");
        div.className = `badge ${unlocked ? "" : "locked"}`.trim();
        div.innerHTML = `
        <div class="badge-title">${badge.title}</div>
        <div class="badge-desc">${badge.desc}</div>
        `;
        badge.Grid.appendChild(div);
    });
}

function renderLeaderboard () {
    const top = [...data.sessions]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

    topSessions.innerHTML = top
    .map((session) => {
        const date = new Date(session.end);
        return `<li>${formatShort(session.duration)} on ${date.toLocaleDateString()}</LI>`;
    })
    .join("");

    if (!top.length) {
        topSessions.innerHTML = "<li>No sessions yet.</li>";
    }

    const totalByDay = data.sessions.reduce((acc, session) => {
        const key = dateKey(new Date(session.end));
        acc[key] = (acc[key] || 0) + session.duration;
        return acc;
    }, {});

    const dayEntries = Object.entries(totalByDay)
    .map(([key, total]) => ({key, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

    topDays.innerHTML = dayEntries
    .map((entry) => `<li>${formatShort(entry.total)} on ${entry.key}</li>`)
    .join("");

    if (!dayEntries.length) {
        topDays.innerHTML = "<li>No days yet.</li>";
    }
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

function resetTimer() {
    clearInterval(timerInterval)
    timerInterval = null;
    timerSub.textContent = "Paused. Resume when ready.";
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

function renderProfile() {
    profilePill.textContent = data.profileName || "Coder";
    profileNameInput.value = data.profileName || "";
}

function renderAll() {
    renderProfile();
    renderStats();
    renderBadges();
    renderLeaderboard();
    renderHistory();
}

profileNameInput.addEventListener("input", (event) => {
    data.profileName = event.target.value.trim() || "Coder";
    saveData();
    renderProfile();
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
logBtn.addEventListener("click", logSession);
resetBtn.addEventListener("click", resetTimer);

window.addEventListener("online", updateNetStatus);
window.addEventListener("offline", updateNetStatus);

updateNetStatus();
updateTimerDisplay();
renderAll();
