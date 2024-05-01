const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const SECONDS_IN_A_DAY = 86400;
const SECONDS_IN_AN_HOUR = 3600;
const SECONDS_IN_A_MINUTE = 60;
const TRANSLATE_TIMER_VERTICAL = -200;
const TRANSLATE_TIMER_HORIZONTAL = 145;
let seconds = 0;
let minutes = 0;
let hours = 0;
const numSeconds = document.getElementById("numSeconds");
const numMinutes = document.getElementById("numMinutes");
const numHours = document.getElementById("numHours");
let activeTimerDom;
const dialogue = document.getElementsByClassName("dialogue")[0];
const timerDiv = document.getElementById("timer");
const textInput = document.getElementById("textInput");
let settingTimer = false;
let timerToggle = -1;
let keyHoldDuration = 0;
let setTimerInterval = 1;
let isTimerRunning = false;
let timerMode = false;
const tasks = {}

function focus(dom) {
    dom.style.transform = `translateX(${TRANSLATE_TIMER_HORIZONTAL}px)`;
    return dom;
}

function unfocus(dom) {
    dom.style.transform = "";
}

document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'ArrowUp':
            if (!isTimerRunning) {
                if (timerToggle === -1) {
                    timerToggle = 0;
                    timerMode = true;
                    activeTimerDom = focus(document.getElementById('seconds'));
                } else if (timerToggle === 0) {
                    timerToggle = 1;
                    unfocus(activeTimerDom);
                    activeTimerDom = focus(document.getElementById('minutes'));
                } else { 
                    timerToggle = 2;
                    unfocus(activeTimerDom);
                    activeTimerDom = focus(document.getElementById('hours'));
                }
            }
            break;
        case 'ArrowDown':
            if (!isTimerRunning) {
                if (timerToggle === 2) {
                    timerToggle = 1;
                    unfocus(activeTimerDom);
                    activeTimerDom = focus(document.getElementById('minutes'));
                } else if (timerToggle === 1) {
                    timerToggle = 0;
                    unfocus(activeTimerDom);
                    activeTimerDom = focus(document.getElementById('seconds'));
                } else if (timerToggle === 0) {
                    timerToggle = -1;
                    timerMode = false;
                    unfocus(activeTimerDom);
                    activeTimerDom = undefined;
                }
            }
            break;
        case 'Space':
            event.preventDefault();
            if (!timerMode && dialogue.style.display === "" || dialogue.style.display === "none") { // only run if not in completion stage
                if (isTimerRunning) {
                    isTimerRunning = !isTimerRunning;
                    showCompletionDialogue();
                } else {
                    isTimerRunning = !isTimerRunning;
                    startTimer()
                }
            }
            break;
        case 'Enter':
            if (textInput.value.length > 0) {
                if (Object.keys(tasks).length === 0) {
                    document.getElementById("times").style.display = "flex";
                }
                const taskName = textInput.value.toUpperCase();
                const numHours = document.getElementById("numHours").innerText;
                const numMinutes = document.getElementById("numMinutes").innerText;
                const numSeconds = document.getElementById("numSeconds").innerText;
                dialogue.style.display = "none";
                tasks[taskName] = convertToSeconds(numHours, numMinutes, numSeconds)

                // Container div for a new time block
                const newTaskContainerDiv = document.createElement("div");
                newTaskContainerDiv.className = "taskContainer";
                newTaskContainerDiv.id = taskName;

                // Creating task block overlay
                const newTaskNameDiv = document.createElement("div");
                newTaskNameDiv.className = "taskName";
                newTaskNameDiv.innerText = taskName;
                newTaskNameDiv.style.width = `${getTaskWidth(tasks[taskName], 86400, 80, 620)}px`;
                
                newTaskContainerDiv.appendChild(newTaskNameDiv);
                
                // Creating duration text (under task block for hover)
                const newDurationDiv = document.createElement("div");
                const durationStringArray = convertToStringArray(tasks[taskName])
                newDurationDiv.className = "taskDuration";
                newDurationDiv.innerText = `${durationStringArray[0]}:${durationStringArray[1]}:${durationStringArray[2]}`;
                // Adding date to underlay
                const newTaskDateDiv = document.createElement("div");
                newTaskDateDiv.className = "taskDate";
                const currentTime = new Date();
                const month = formatTwoDigits(currentTime.getMonth() + 1);
                const day = formatTwoDigits(currentTime.getDate());
                const year = currentTime.getFullYear().toString().substring(2);
                newTaskDateDiv.innerText = `${month}/${day}/${year}`;
                newDurationDiv.appendChild(newTaskDateDiv);
                
                newTaskNameDiv.appendChild(newDurationDiv); 

                document.getElementById("times").appendChild(newTaskContainerDiv);
                textInput.value = "";
                resetTimer();
            }
            break;
        case "Escape":
            if (dialogue.style.display === "block") {
                dialogue.style.display = "none";
                textInput.innerText = "";
            } 
            break;
    }
})


// Timer logic for mobile interactions
timerDiv.addEventListener('mousedown', () => {
    if (!timerMode && dialogue.style.display === "" || dialogue.style.display === "none") {
        if (!isTimerRunning) {
            isTimerRunning = !isTimerRunning;
            startTimer()
        } else {
            isTimerRunning = !isTimerRunning;
            showCompletionDialogue();
        }
    }
    
})

dialogue.addEventListener('mousedown', () => {
    dialogue.style.display = "none";
})

textInput.addEventListener('mousedown', function(event) {
    event.stopPropagation();
})

window.addEventListener('scroll', function(event) {

    if (isOnMobile() && Object.keys(tasks).length > 0) {
        if (window.scrollY > 10) {
            timerDiv.style.transform = `translateY(${TRANSLATE_TIMER_VERTICAL}px)`;
        } else {
            timerDiv.style.transform = "";
        }
    } else {
        
    }
})

let up = 0;
let down = 0;
let motionStarted = false;
let lastDelta = 0;
const SECONDS_BUFFER_SIZE = 4;
const SECONDS_REDUCER = 4;
const MINUTES_BUFFER_SIZE = 4;
const MINUTES_REDUCER = 4;
const HOURS_BUFFER_SIZE = 8;
const HOURS_REDUCER = 20;
const HOURS_INTERVAL = 1;
let eventBuffer = [];

window.addEventListener('wheel', function (event) {
    let deltaY = event.deltaY;
    eventBuffer.push(deltaY);
    if (timerMode) {
        if (!motionStarted) {
            lastDelta = deltaY;
            motionStarted = true;
        }
        if (deltaY > 0) { // scroll direction 
            if (eventBuffer.length === SECONDS_BUFFER_SIZE && activeTimerDom.id === "seconds") {
                if (eventBuffer.every(val => val === deltaY)) { // constant increase
                    seconds += deltaY;
                    activeTimerDom.children[0].innerText = formatTwoDigits(seconds);
                } else { // depending on the rate of change we can determine the rate of increase
                    let diff = Math.abs(eventBuffer[eventBuffer.length - 1] - eventBuffer[0]);
                    seconds += Math.round(diff / SECONDS_REDUCER);
                }
                seconds = Math.min(seconds, 60);
                activeTimerDom.children[0].innerText = formatTwoDigits(seconds);
                eventBuffer = [];
            } else if (activeTimerDom.id === "minutes" && eventBuffer.length === MINUTES_BUFFER_SIZE) {
                if (eventBuffer.every(val => val === deltaY)) { // constant increase
                    minutes += deltaY;
                    activeTimerDom.children[0].innerText = formatTwoDigits(minutes);
                } else { // depending on the rate of change we can determine the rate of increase
                    let diff = Math.abs(eventBuffer[eventBuffer.length - 1] - eventBuffer[0]);
                    minutes += Math.round(diff / MINUTES_REDUCER);
                }
                minutes = Math.min(minutes, 60);
                activeTimerDom.children[0].innerText = formatTwoDigits(minutes);
                eventBuffer = [];
            } else if (activeTimerDom.id === "hours" && eventBuffer.length === HOURS_BUFFER_SIZE) {
                if (eventBuffer.every(val => val === deltaY)) { // constant increase
                    hours += HOURS_INTERVAL;
                    activeTimerDom.children[0].innerText = formatTwoDigits(hours);
                } else { // depending on the rate of change we can determine the rate of increase
                    let diff = Math.abs(eventBuffer[eventBuffer.length - 1] - eventBuffer[0]);
                    hours += Math.round(diff / HOURS_REDUCER);
                }
                hours = Math.min(hours, 24);
                activeTimerDom.children[0].innerText = formatTwoDigits(hours);
                eventBuffer = [];
            }
        } else if (deltaY < 0) { // reducing time can likely remove this if statement and opt for a smaller one
            if (activeTimerDom.id === "seconds" && eventBuffer.length === SECONDS_BUFFER_SIZE) {
                if (eventBuffer.every(val => val === deltaY)) { // constant decrease
                    seconds -= Math.abs(deltaY);
                    activeTimerDom.children[0].innerText = formatTwoDigits(seconds);
                } else { // depending on the rate of change we can determine the rate of decrease
                    let diff = Math.abs(Math.abs(eventBuffer[eventBuffer.length - 1]) - Math.abs(eventBuffer[0]));
                    seconds -= Math.round(diff / 5);
                }
                seconds = Math.max(seconds, 0);
                activeTimerDom.children[0].innerText = formatTwoDigits(seconds);
                eventBuffer = [];
            } else if (activeTimerDom.id === "minutes" && eventBuffer.length === MINUTES_BUFFER_SIZE) {
                if (eventBuffer.every(val => val === deltaY)) { // constant decrease
                    minutes -= Math.abs(deltaY);
                    activeTimerDom.children[0].innerText = formatTwoDigits(minutes);
                } else { // depending on the rate of change we can determine the rate of increase
                    let diff = Math.abs(Math.abs(eventBuffer[eventBuffer.length - 1]) - Math.abs(eventBuffer[0]));
                    minutes -= Math.round(diff / 5);
                }
                minutes = Math.max(minutes, 0);
                activeTimerDom.children[0].innerText = formatTwoDigits(minutes);
                eventBuffer = [];
            } else if (activeTimerDom.id === "hours" && eventBuffer.length === HOURS_BUFFER_SIZE) {
                if (eventBuffer.every(val => val === deltaY)) { // constant increase
                    hours -= HOURS_INTERVAL;
                    activeTimerDom.children[0].innerText = formatTwoDigits(hours);
                } else { // depending on the rate of change we can determine the rate of increase
                    let diff = Math.abs(Math.abs(eventBuffer[eventBuffer.length - 1]) - Math.abs(eventBuffer[0]));
                    hours -= Math.round(diff / HOURS_REDUCER);
                }
                hours = Math.max(hours, 0);
                activeTimerDom.children[0].innerText = formatTwoDigits(hours);
                eventBuffer = [];
            }

        }
    }
})

window.addEventListener("touchstart", (event) => {
    console.log("something was... touched?");
});
window.addEventListener("touchend", (event) => {
    console.log(event);
})



// MEDIA QUERIES
const mobileMediaQuery = window.matchMedia("(max-width: 620px)");

function isOnMobile() {
    return window.matchMedia("(max-width:620px)").matches;
}

function startTimer() {
    if (isTimerRunning) {
        seconds++
        numSeconds.innerText = formatTwoDigits(seconds);
        if (seconds >= 60) {
            minutes++;
            numMinutes.innerText = formatTwoDigits(minutes);
            seconds = 0;
        }
        if (minutes >= 60) {
            hours++;
            minutes = 0;
        }
        setTimeout(startTimer, 1000);
    }
}

function setTimer() {
    if (!settingTimer && seconds === 0 && minutes === 0 && hours === 0) {
        settingTimer = true;
    } else if (settingTimer) {
        // Seconds is how we set the timer and we let the number of seconds define the timer
        seconds += setTimerInterval;
        if (seconds >= SECONDS_IN_AN_HOUR) {
            hours = Math.floor(seconds / SECONDS_IN_AN_HOUR);
            numHours.innerText = formatTwoDigits(hours);
            seconds = seconds % SECONDS_IN_AN_HOUR;
        }
        if (seconds >= SECONDS_IN_A_MINUTE) {
            minutes = Math.floor(seconds / SECONDS_IN_A_MINUTE);
            numMinutes.innerText = formatTwoDigits(minutes);
            seconds = seconds % SECONDS_IN_A_MINUTE;
        }
        numSeconds.innerText = formatTwoDigits(seconds);
    }

}

function resetTimer() {
    hours = 0;
    numHours.innerText = formatTwoDigits(hours);
    minutes = 0;
    numMinutes.innerText = formatTwoDigits(minutes);
    seconds = 0;
    numSeconds.innerText = formatTwoDigits(seconds);
}

function formatTwoDigits(num) {
    return num < 10 ? "0" + num : num;
}

getCurrentTime();
// Setting the current time
function getCurrentTime() {
    let currentTime = new Date();
    let dateString = 
    `${MONTHS[currentTime.getMonth()]} ${formatTwoDigits(currentTime.getDate())} ${currentTime.getFullYear()}`
    let timeString = 
    `${formatTwoDigits(currentTime.getHours())}:${formatTwoDigits(currentTime.getMinutes())}:${formatTwoDigits(currentTime.getSeconds())}`;
    document.getElementById("currentTimeId").textContent = `${dateString} ${timeString}`;
    setTimeout(getCurrentTime, 1000);
}

// Dialogue input
function showCompletionDialogue() {
    dialogue.style.display = "block";
    dialogue.style.position = "fixed";
    document.getElementById("numHoursSummary").innerText = document.getElementById("numHours").innerText;
    document.getElementById("numMinutesSummary").innerText = document.getElementById("numMinutes").innerText;
    document.getElementById("numSecondsSummary").innerText = document.getElementById("numSeconds").innerText;
}

/**
 * Conversion of seconds to hours, minutes and seconds and vice versa
 **/

// Takes an array in the form of ["hours", "mins", "seconds"]
function convertToSeconds(numHours, numMinutes, numSeconds) {
    console.log("Converting " + numHours + " " + numMinutes + " " + numSeconds);
    let hours = parseInt(numHours, 10);
    let mins = parseInt(numMinutes, 10);
    let seconds = parseInt(numSeconds, 10);
    let totalSeconds = hours * 3600 + mins * 60 + seconds;
    return totalSeconds;
}

function convertToStringArray(totalSeconds) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (totalSeconds > 3600) {
        hours = Math.floor(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
    }
    if (totalSeconds > 60) {
        minutes = Math.floor(totalSeconds / 60); // this makes "infinity" lol
        totalSeconds = totalSeconds % 60;
    }
    seconds = totalSeconds;
    return [formatTwoDigits(hours), formatTwoDigits(minutes), formatTwoDigits(seconds)];
}

/**
 *  * Calculate width of task box eventually add functionality to determine widths relative to
 * the rest of the times of each task.
 * @param {object} times An object with all the tasks where {[task]: durationOfTask}
 */

function getTaskWidth(taskDuration, maxDuration, minimumWidth, maximumWidth) {
    return mapToLogarithmicRange(taskDuration, maxDuration, minimumWidth, maximumWidth);
}

function mapToLogarithmicRange(taskDuration, maxDuration, minimumWidth, maximumWidth) {
    // Ensure positive inputs
    value = Math.max(0, taskDuration); // duration in seconds of the ask
    maxDuration = Math.max(0, maxDuration); // being the max width of the box

    // Fitting a natural log curve to our two endpoints duration:1 width: 80 & duration:86400 width: 620
    const scaleFactor = ((maximumWidth - minimumWidth) / Math.log(maxDuration));

    // Map the value to the range
    const mappedValue = minimumWidth + (Math.log(taskDuration) * scaleFactor);

    // Ensure the result is within the range
    return mappedValue;
}

function compareByDuration(a, b) {
    return a - b;
}




