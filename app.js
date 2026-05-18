const timerDisplay = document.getElementById("timerDisplay");
const timerSub = document.getElementById("timerSub");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("resetBtn");

let timerInterval = null;
let startTimestamp = null;
let elapsedSeconds = 0;

function formatTimer(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return [hrs, mins, secs].map((value) => String(value).padStart(2, "0")).join(":");
}

function render () {
    timerDisplay.textContent = formatTime(elapsedSeconds);
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

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

render();
