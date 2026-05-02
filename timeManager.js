const realTimeClock = document.getElementById('realTimeClock');
const timerDisplay = document.getElementById('timerDisplay');
const tasksListEl = document.getElementById('tasksList');
const progressContainer = document.getElementById('progressContainer');
const totalTimeInput = document.getElementById('totalTime');
const taskNameInput = document.getElementById('taskName');

let totalMinutes = Number(totalTimeInput?.value) || 60;
let totalSeconds = totalMinutes * 60;
let remainingSeconds = totalSeconds;
let tasks = [];
let timerInterval = null;
let timerRunning = false;

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs]
        .map(value => String(value).padStart(2, '0'))
        .join(':');
}

function updateRealTimeClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    realTimeClock.textContent = `${hours}:${minutes}:${seconds}`;
}

function renderTasks() {
    if (!tasksListEl) return;

    if (tasks.length === 0) {
        tasksListEl.innerHTML = '<p class="emptyMessage">No tasks added yet. Add a task to see your time distribution.</p>';
        progressContainer.innerHTML = '<p class="emptyMessage">No progress bars yet. Add tasks and set your total time.</p>';
        return;
    }

    tasksListEl.innerHTML = tasks
        .map(task => `
            <div class="taskItem">
                <div class="taskDetails">
                    <span class="taskName">${task.name}</span>
                    <span class="taskDuration">${task.displayDuration}</span>
                </div>
                <button type="button" class="btn smallBtn" onclick="removeTask(${task.id})">Remove</button>
            </div>
        `)
        .join('');

    updateProgress();
}

function updateProgress() {
    if (!progressContainer) return;

    if (tasks.length === 0) {
        progressContainer.innerHTML = '<p class="emptyMessage">No tasks yet.</p>';
        return;
    }

    const total = tasks.reduce((sum, task) => sum + task.seconds, 0) || totalSeconds;
    const progressHtml = tasks
        .map(task => {
            const percent = total > 0 ? Math.round((task.seconds / total) * 100) : 0;
            return `
                <div class="progressBarWrapper">
                    <div class="progressBarLabel">${task.name} — ${task.displayDuration} (${percent}%)</div>
                    <div class="progressBarTrack">
                        <div class="progressBarFill" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        })
        .join('');

    progressContainer.innerHTML = progressHtml;
}

function updateTimerDisplay() {
    if (!timerDisplay) return;
    timerDisplay.textContent = formatTime(remainingSeconds);
}

function setTotalTimeMinutes(value) {
    totalMinutes = Math.max(1, Math.floor(value));
    totalSeconds = totalMinutes * 60;
    remainingSeconds = totalSeconds;
    if (totalTimeInput) {
        totalTimeInput.value = totalMinutes;
    }
    updateTimerDisplay();
    recalculateTaskTimes();
    renderTasks();
}

function recalculateTaskTimes() {
    if (tasks.length === 0) return;

    const baseSeconds = Math.floor(totalSeconds / tasks.length);
    const remainder = totalSeconds - baseSeconds * tasks.length;

    tasks = tasks.map((task, index) => {
        const seconds = baseSeconds + (index < remainder ? 1 : 0);
        return {
            ...task,
            seconds,
            displayDuration: formatTaskDuration(seconds),
        };
    });
}

function formatTaskDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs === 0 ? `${mins} min` : `${mins}m ${secs}s`;
}

function initializeTasks() {
    const rawValue = Number(totalTimeInput?.value);
    if (!rawValue || rawValue < 1) {
        alert('Please enter a valid total time in minutes.');
        return;
    }

    setTotalTimeMinutes(rawValue);
    renderTasks();
}

function addTask() {
    const name = taskNameInput?.value.trim();
    if (!name) {
        alert('Please enter a task name.');
        return;
    }

    const newTask = {
        id: Date.now(),
        name,
        seconds: 0,
        displayDuration: '0 min',
    };
    tasks.push(newTask);
    taskNameInput.value = '';
    recalculateTaskTimes();
    renderTasks();
}

function removeTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    recalculateTaskTimes();
    renderTasks();
}

function startTimer() {
    if (timerRunning) return;

    timerRunning = true;
    timerInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            resetTimer();
            alert('Your timer has finished!');
            return;
        }
        remainingSeconds -= 1;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
}

window.initializeTasks = initializeTasks;
window.addTask = addTask;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.removeTask = removeTask;


const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menuToggle');
let touchStartY = 0;
let touchActive = false;

function toggleMenu() {
    if (!nav || !menuToggle) return;
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    nav.querySelector('.navLinks')?.setAttribute('aria-hidden', String(!isOpen));
}

function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.querySelector('.navLinks')?.setAttribute('aria-hidden', 'true');
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

if (nav) {
    nav.addEventListener('touchstart', event => {
        if (event.touches.length !== 1) return;
        touchStartY = event.touches[0].clientY;
        touchActive = true;
    });

    nav.addEventListener('touchmove', event => {
        if (!touchActive || event.touches.length !== 1) return;
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - touchStartY;
        if (deltaY > 60 && !nav.classList.contains('open')) {
            toggleMenu();
            touchActive = false;
        }
        if (deltaY < -60 && nav.classList.contains('open')) {
            closeMenu();
            touchActive = false;
        }
    });

    nav.addEventListener('touchend', () => {
        touchActive = false;
    });
}

document.addEventListener('click', event => {
    if (!nav?.contains(event.target) && nav?.classList.contains('open')) {
        closeMenu();
    }
});

nav?.querySelectorAll('.navLink, .btn').forEach(item => {
    item.addEventListener('click', closeMenu);
});

updateRealTimeClock();
setInterval(updateRealTimeClock, 1000);
updateTimerDisplay();
renderTasks();
