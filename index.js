const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

var seconds = 0;
var minutes = 0;
var hours = 0;
var secondsDom = document.getElementById("numSeconds");
var minutesDom = document.getElementById("numMinutes");
var hoursDom = document.getElementById("numHours");
isTimerRunning = false;

// Timer logic

document.addEventListener('keydown', function(event) {
    event.preventDefault();
    if (event.code === 'Space' || event.key === ' ') {
        if (!isTimerRunning) {
            isTimerRunning = !isTimerRunning;
            timer();
        } else {
            isTimerRunning = !isTimerRunning;
            completeTimer();
        }
    }
})

function timer() {
    if (isTimerRunning) {
        seconds++
        secondsDom.innerText = formatTwoDigits(seconds);
        if (seconds > 60) {
            minutes++;
            minutesDom.innerText = formatTwoDigits(minutes);
            seconds = 0;
        }
        if (minutes > 60) {
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

// Drawing completion dialogue
function completeTimer() {
    let canvas = document.getElementById("dialogue");
    console.log(canvas);
    /** @type {CanvasRenderingContext2D} */
    let ctx = canvas.getContext("2d");
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    drawBox(canvas.width, canvas.height);
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



