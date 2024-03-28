const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const SECONDS_IN_A_DAY = 86400;
const SECONDS_IN_AN_HOUR = 3600;
const SECONDS_IN_A_MINUTE = 60;
const TRANSLATE_TIMER = -200;
let seconds = 0;
let minutes = 0;
let hours = 0;
const secondsDom = document.getElementById("numSeconds");
const minutesDom = document.getElementById("numMinutes");
const hoursDom = document.getElementById("numHours");
const dialogue = document.getElementsByClassName("dialogue")[0];
const timerDiv = document.getElementById("timer");
const textInput = document.getElementById("textInput");
let settingTimer = false;
let keyHoldDuration = 0;
let setTimerInterval = 1;
let isTimerRunning = false;
const tasks = {}

document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            if (dialogue.style.display === "" || dialogue.style.display === "none") { // only run if not in completion stage
                if (isTimerRunning) {
                    isTimerRunning = !isTimerRunning;
                    showCompletionDialogue();
                } else {
                    isTimerRunning = !isTimerRunning;
                    startTimer()
                }
            }
            break;
        case 'ArrowUp':
            if (event.repeat) {
                keyHoldDuration++;
                if (keyHoldDuration > 30) { // increase by the minut
                    setTimerInterval += SECONDS_IN_A_MINUTE;
                } else if (keyHoldDuration > 50) {
                    setTimerInterval += SECONDS_IN_AN_HOUR;
                }
            }
            setTimer();
            // while the key is held down increase the scale at which the timer increases in time
            // 0 - 5 seconds single seconds to by 5's
            // after about 5 seconds - increase by the minute
            // once we hit 60 minutes - increase by hour
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

document.addEventListener("keyup", function(event) {
    switch(event.code) {
        case "ArrowUp":
            console.log("released");
            setTimerInterval = 1;
            keyHoldDuration = 0;
            break;

    }
})

// Timer logic for mobile interactions
timerDiv.addEventListener('mousedown', () => {
    if (dialogue.style.display === "" || dialogue.style.display === "none") {
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
    console.log(`window.innerHeight = ${window.innerHeight}`);
    console.log(`window.scrollY = ${window.scrollY}`);
    console.log(`document.body.scrollHeight = ${document.body.scrollHeight}`)

    if (window.scrollY > 10) {
        if (isOnMobile() && Object.keys(tasks).length > 0) {
            console.log("translate");
            timerDiv.style.transform = `translateY(${TRANSLATE_TIMER}px)`;
        }
    } else {
        if (isOnMobile() && Object.keys(tasks).length > 0) {
            console.log("reset");
            timerDiv.style.transform = "";
        }
    }
})

addEventListener('wheel', function (event) {
    console.log("test");
    console.log(`delta.x ${event.deltaX}`); // swipe left
    console.log(`delta.y ${event.deltaY}`); // swipe up ++ // swipe down --
    console.log(`delta.z ${event.deltaZ}`);
})

// MEDIA QUERIES
const mobileMediaQuery = window.matchMedia("(max-width: 620px)");

function isOnMobile() {
    return window.matchMedia("(max-width:620px)").matches;
}

function startTimer() {
    if (isTimerRunning) {
        seconds++
        secondsDom.innerText = formatTwoDigits(seconds);
        if (seconds >= 60) {
            minutes++;
            minutesDom.innerText = formatTwoDigits(minutes);
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
        console.log(`Seconds before ${seconds}`);
        if (seconds >= SECONDS_IN_AN_HOUR) {
            hours = Math.floor(seconds / SECONDS_IN_AN_HOUR);
            console.log(`hours ${hours}`);
            hoursDom.innerText = formatTwoDigits(hours);
            seconds = seconds % SECONDS_IN_AN_HOUR;
        }
        if (seconds >= SECONDS_IN_A_MINUTE) {
            minutes = Math.floor(seconds / SECONDS_IN_A_MINUTE);
            console.log(`minutes ${minutes}`);
            minutesDom.innerText = formatTwoDigits(minutes);
            seconds = seconds % SECONDS_IN_A_MINUTE;
        }
        secondsDom.innerText = formatTwoDigits(seconds);
        console.log(seconds);
    }

}

function resetTimer() {
    hours = 0;
    hoursDom.innerText = formatTwoDigits(hours);
    minutes = 0;
    minutesDom.innerText = formatTwoDigits(minutes);
    seconds = 0;
    secondsDom.innerText = formatTwoDigits(seconds);
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
    document.getElementById("currentTimeId").innerText = `${dateString} ${timeString}`;
    setTimeout(() => {getCurrentTime}, 1000);
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




