const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

var seconds = 0;
var minutes = 0;
var hours = 0;
var secondsDom = document.getElementById("numSeconds");
var minutesDom = document.getElementById("numMinutes");
var hoursDom = document.getElementById("numHours");
isTimerRunning = false;

// Storing time chunks { name: timeinSeconds }
var times = {}

// Timer logic

document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            if (!isTimerRunning) {
                isTimerRunning = !isTimerRunning;
                timer();
            } else {
                isTimerRunning = !isTimerRunning;
                // completeTimer();
                showCompletionDialogue();
            }
            break;
        case 'Enter':
            let textInput = document.getElementById("textInput");
            if (textInput.value.length > 0) {
                taskName = textInput.value.toUpperCase();
                let numHours = (document.getElementById("numHours").innerText);
                let numMinutes = document.getElementById("numMinutes").innerText;
                let numSeconds = document.getElementById("numSeconds").innerText;
                console.log(numHours);
                console.log("neter");
                let dialogue = document.getElementsByClassName("dialogue")[0];
                dialogue.style.display = "none";
                times[taskName] = convertToSeconds(numHours, numMinutes, numSeconds)
                console.log(times[taskName]);

                //Container div for overlaid div elements
                let newTaskContainerDiv = document.createElement("div");
                newTaskContainerDiv.className = "taskContainer";
                newTaskContainerDiv.id = taskName;

                let newTaskNameDiv = document.createElement("div");
                newTaskNameDiv.className = "taskName";
                newTaskNameDiv.innerText = taskName;

                let newDurationDiv = document.createElement("div");
                let durationStringArray = convertToStringArray(times[taskName])
                console.log(durationStringArray);
                newDurationDiv.className = "taskDuration";
                newDurationDiv.innerText = `${durationStringArray[0]}:${durationStringArray[1]}:${durationStringArray[2]}`;

                newTaskContainerDiv.appendChild(newTaskNameDiv);
                newTaskNameDiv.appendChild(newDurationDiv);

                console.log(newTaskContainerDiv)
                let timesDiv = document.getElementById("times");
                timesDiv.appendChild(newTaskContainerDiv);
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
    console.log(canvas);
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
    let dialogue = document.getElementsByClassName("dialogue")[0];
    dialogue.style.display = "block";
    dialogue.style.position = "fixed";
    document.getElementById("numHoursSummary").innerText = document.getElementById("numHours").innerText;
    document.getElementById("numMinutesSummary").innerText = document.getElementById("numMinutes").innerText;
    document.getElementById("numSecondsSummary").innerText = document.getElementById("numSeconds").innerText;
}

// Conversion of seconds to hours, minutes and seconds and vice versa

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
    console.log(totalSeconds);
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


