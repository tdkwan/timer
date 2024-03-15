const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MIN_TASK_WIDTH = 80;
const MAX_TASK_WIDTH = 200;
var seconds = 0;
var minutes = 0;
var hours = 0;
var secondsDom = document.getElementById("numSeconds");
var minutesDom = document.getElementById("numMinutes");
var hoursDom = document.getElementById("numHours");
// global DOM objects for completing tasks
var dialogue = document.getElementsByClassName("dialogue")[0];
let textInput = document.getElementById("textInput");
isTimerRunning = false;

// Storing time chunks { name: timeinSeconds }
var tasks = {}

// Timer logic

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
                    timer()
                }
            }
            break;
        case 'Enter':
            if (textInput.value.length > 0) {
                taskName = textInput.value.toUpperCase();
                let numHours = (document.getElementById("numHours").innerText);
                let numMinutes = document.getElementById("numMinutes").innerText;
                let numSeconds = document.getElementById("numSeconds").innerText;
                dialogue.style.display = "none";
                tasks[taskName] = convertToSeconds(numHours, numMinutes, numSeconds)

                //Container div for a new time block
                let newTaskContainerDiv = document.createElement("div");
                newTaskContainerDiv.className = "taskContainer";
                newTaskContainerDiv.id = taskName;

                let newTaskNameDiv = document.createElement("div");
                newTaskNameDiv.className = "taskName";
                newTaskNameDiv.innerText = taskName;
                newTaskNameDiv.style.width = `${MIN_TASK_WIDTH + scaleToRange(100)}px`;
                newTaskContainerDiv.appendChild(newTaskNameDiv);
                
                let newDurationDiv = document.createElement("div");
                let durationStringArray = convertToStringArray(tasks[taskName])
                newDurationDiv.className = "taskDuration";
                newDurationDiv.innerText = `${durationStringArray[0]}:${durationStringArray[1]}:${durationStringArray[2]}`;
                newTaskNameDiv.appendChild(newDurationDiv);

                let newTaskDateDiv = document.createElement("div");
                newTaskDateDiv.className = "taskDate";
                let currentTime = new Date();
                let month = formatTwoDigits(currentTime.getMonth());
                let day = formatTwoDigits(currentTime.getDate());
                let year = currentTime.getFullYear().toString().substring(2);
                newTaskDateDiv.innerText = `${month}/${day}/${year}`;
                newDurationDiv.appendChild(newTaskDateDiv);

                let timesDiv = document.getElementById("times");
                timesDiv.appendChild(newTaskContainerDiv);

                textInput.value = "";
                resetTimer();
            }
            break;
        case "Escape":
            console.log("hello");
            if (dialogue.style.display === "block") {
                dialogue.style.display = "none";
                textInput.innerText = "";
            } 
            break;
    }
})

function timer() {
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
        setTimeout(timer, 1000);
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
    setTimeout(getCurrentTime, 1000);
}

// Drawing completion dialogue animation test
function completeTimer() {
    let canvas = document.getElementById("dialogue");
    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    // drawBox(canvas.width, canvas.height);
}

function drawBox(width, height) {
    let borderWidth = 40;
    const startX = borderWidth;
    const startY = borderWidth;
    const endX = width - borderWidth;
    const endY = borderWidth;

    let currentX = startX;
    let currentY = startY;
    const steps = 100;
    let stepCount = 0;

    function animateLine() {
        let ctx = document.getElementById("dialogue").getContext("2d");
        // Calculate the position of the line for the current step using easing function
        const t = easeOutQuad(stepCount / steps);
        const x = startX + (endX - startX) * t;
        const y = startY + (endY - startY) * t;
    
        // Draw the line up to the current position
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    
        // Increment step count
        stepCount++;
    
        // Check if animation is complete
        if (stepCount <= steps) {
            // Continue animating
            requestAnimationFrame(animateLine);
        }
    }

    // Start the animation
    animateLine();
}

// Number of steps to complete the line drawing

// Easing function to gradually slow down the animation
function easeOutQuad(t) {
    return t * (2 - t);
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
function scaleToRange(rangeSize) {
    return Math.random() * rangeSize;
    // const maxValue = Number.POSITIVE_INFINITY; // Represents positive infinity
    // const scaleFactor = rangeSize / maxValue;
    // console.log(Math.floor(x * scaleFactor));
    // return Math.floor(x * scaleFactor);
}

function compareByDuration(a, b) {
    return a - b;
}


