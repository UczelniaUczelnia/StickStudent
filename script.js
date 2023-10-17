const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const PLATFORM_HEIGHT = 200
const PLATFORM_POSITION_HEIGHT = 400
const PLATFORM_MIN_GAP = 40;
const PLATFORM_MAX_GAP = 200;
const PLATFORM_MIN_WIDTH = 20;
const PLATFORM_MAX_WIDTH = 100;
const PLATFORM_POSITION_START = 50
const PLATFORM_WIDTH_START = 50

const HERO_WIDTH = 17; 
const HERO_HEIGHT = 25;

const STICK_WIDTH = 3;

platforms = [{ xPosition: PLATFORM_POSITION_START, width: PLATFORM_WIDTH_START }];

studentX = platforms[0].xPosition + platforms[0].width / 2
studentY = 0;

generatePlatforms(5);

function draw() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  regeneratePlatforms();
  drawStudent(xRange);
}

function generatePlatform() {
  const lastPlatform = platforms[platforms.length - 1];
  let furthestX = lastPlatform.xPosition + lastPlatform.width;

  const xPosition = furthestX + PLATFORM_MIN_GAP + Math.floor(Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP));
  const width = PLATFORM_MIN_WIDTH + Math.floor(Math.random() * (PLATFORM_MAX_WIDTH - PLATFORM_MIN_WIDTH));

  platforms.push({ xPosition, width });
}

function generatePlatforms(number) {
  for (let i = 0; i < number - 1; ++i)
    generatePlatform()

  for (let i = 0; i < platforms.length; ++i)
    ctx.fillRect(platforms[i].xPosition, PLATFORM_POSITION_HEIGHT, platforms[i].width, PLATFORM_HEIGHT);
}

function regeneratePlatforms(number) {
  for (let i = 0; i < platforms.length; ++i)
    ctx.fillRect(platforms[i].xPosition, PLATFORM_POSITION_HEIGHT, platforms[i].width, PLATFORM_HEIGHT);
}

function drawStudent(xRange) {
 
  ctx.save();
  ctx.fillStyle = "black";
  ctx.translate(studentX + xRange,PLATFORM_POSITION_HEIGHT - 28 );

  // Body
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.roundRect(0, 0, HERO_WIDTH, HERO_HEIGHT, 5);
  ctx.fill();
  ctx.stroke();

  // Legs
  const LEG_DISTANCE = 3;
  ctx.beginPath();
  ctx.arc(LEG_DISTANCE, HERO_HEIGHT, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(HERO_WIDTH - LEG_DISTANCE, HERO_HEIGHT, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(HERO_WIDTH - LEG_DISTANCE, HERO_HEIGHT-(HERO_HEIGHT-5), 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.stroke();

  // Band
  ctx.fillStyle = "blue";
  ctx.fillRect(-1, 2, HERO_WIDTH, 4);
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(-9, -6);
  ctx.lineTo(-6, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-1, 2);
  ctx.lineTo(-8, 10);
  ctx.lineTo(2, 6);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
  
}


let stickStartX = PLATFORM_POSITION_START + PLATFORM_WIDTH_START - 1, stickStartY = PLATFORM_POSITION_HEIGHT, stickEndX, stickEndY;
let isDrawingRising = false;
let isDrawingRotate = false;
let stickLength = 0;
let stickRotationAngle = 0;
let xRange = 0;
let intervalID;

function drawLine() {
  ctx.lineWidth = STICK_WIDTH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(stickStartX, stickStartY);
  ctx.lineTo(stickEndX, stickEndY);
  ctx.stroke();
}

function animateStudent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLine();
  draw();
  drawStudent(xRange);
  xRange++; 
  if (studentX + xRange + HERO_WIDTH >= stickEndX){
    clearInterval(intervalID)
  }
}
function animateStickRising() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stickLength += 1;

  stickEndX = stickStartX;
  stickEndY = stickStartY - stickLength;

  drawLine();
  draw();

  if (isDrawingRising) {
    requestAnimationFrame(animateStickRising);
  }
}

function animateStickRotating() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stickRotationAngle += Math.PI / 180 * 2;  // obrot o 2 stopnie
  
  stickEndX = stickStartX + Math.sin(stickRotationAngle) * stickLength;
  stickEndY = stickStartY + (-Math.cos(stickRotationAngle)) * stickLength;

  drawLine();
  draw();
  
  if (stickRotationAngle > Math.PI / 2)  // stickRotationAngle > 90 stopni
    isDrawingRotate = false;

  if (isDrawingRotate) {
    requestAnimationFrame(animateStickRotating);
  }

}

canvas.addEventListener('mousedown', () => {
  isDrawingRising = true;
  animateStickRising();
});

canvas.addEventListener('mouseup', () => {
  stickRotationAngle = 0;
  isDrawingRising = false;
  isDrawingRotate = true;
  animateStickRotating();
  intervalID = setInterval(animateStudent, 60);
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});


draw();