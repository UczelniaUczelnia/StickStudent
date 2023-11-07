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
const NUMBER_OF_PLATFORMS = 5

const HERO_WIDTH = 17; 
const HERO_HEIGHT = 25;

const STICK_WIDTH = 3;

platforms = [{ xPosition: PLATFORM_POSITION_START, width: PLATFORM_WIDTH_START }];  // [początek platformy w osi X, szerokość platformy]

const x = PLATFORM_POSITION_START + (PLATFORM_WIDTH_START / 2);
const y = x  - PLATFORM_POSITION_START;
const PLATFORM_POSITION_START_SMAL = PLATFORM_POSITION_START + y;
const PLATFORM_WIDTH_START_Smal = PLATFORM_WIDTH_START / 2;
const PLATFORM_HEIGHT_Point_end = 400;
const PLATFORM_HEIGHT_Point_Start = 395
platformsPoint = [{ xPosition: PLATFORM_POSITION_START_SMAL, width: PLATFORM_WIDTH_START_Smal}];


studentX = platforms[0].xPosition + platforms[0].width / 2
studentY = 0;
currentPlatformIndex = 0;  // indeks platformy, na której aktualnie będzie rysowana belka

pointStudnet = 0;
indexStudentInPlatform = 0;

let stickStartX = PLATFORM_POSITION_START + PLATFORM_WIDTH_START - 1
let stickStartY = PLATFORM_POSITION_HEIGHT
let stickEndX
let stickEndY
let isDrawingRising = false;
let isDrawingRotate = false;
let isDrawingFalling = false;
let stickLength = 0;
let stickRotationAngle = 0;
let xRange = 0;
let intervalID;

sticks = [{ xPosition: PLATFORM_POSITION_START + PLATFORM_WIDTH_START, width: stickLength}]



function generatePlatformPoint() 
{
  console.log( platforms.length);
  for(let i = 1; i < platforms.length; ++i)
  {
    let platform = platforms[i];
    
    
    let polowa = platform.xPosition + (platform.width / 2);
    let polowa2 = polowa  - platform.xPosition;
    const platformPossion = platform.xPosition + polowa2;
    const platformWidt = platform.width / 2;
    platformsPoint.push({ platformPossion, platformWidt });
    console.log(platformsPoint);
  }
}

function generatePlatformsPoint() 
{

  generatePlatformPoint();
  for (let i = 0; i < platformsPoint.length; ++i)
    ctx.fillRect(platformsPoint[i].xPosition, 380, platformsPoint[i].width, 10);
}

function regeneratePlatformsPoint() 
{
  ctx.beginPath();
  for (let i = 0; i < platformsPoint.length; ++i)
    ctx.fillRect(platformsPoint[i].xPosition, 380, platformsPoint[i].width, 10);
    ctx.stroke();
}

function checkUserAlive()
{
	 if(studentX + stickLength >= platforms[indexStudentInPlatform + 1].xPosition && studentX + stickLength <= platforms[indexStudentInPlatform + 1].xPosition + platforms[indexStudentInPlatform + 1].width)
	 {
		 indexStudentInPlatform++;
		 pointStudnet += 10;
		 return true;
	 } 
	 return false;
}

function checkUserAlive1()
{
	for(let i = indexStudentInPlatform; i < platforms.length() - 1; ++i)
	{
	 if(studentX + stickLength >= platforms[i + 1].xPosition && studentX + stickLength <= platforms[i + 1].xPosition + platforms[i + 1].width)
	 {
		 indexStudentInPlatform += i;
		 pointStudnet += 10 * i;
		 return true;
	 }
	}
	return false;
}

function draw() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = STICK_WIDTH;
  regeneratePlatforms();
  regeneratePlatformsPoint();
  drawStudent(xRange);
  drawSticks()
}

function drawSticks() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < sticks.length; ++i) {
    ctx.beginPath();
    ctx.moveTo(sticks[i].xPosition, stickStartY);
    ctx.lineTo(sticks[i].xPosition + sticks[i].width, stickStartY);
    ctx.stroke();
  }
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

function regeneratePlatforms() {
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

function ifStickTouchPlatform() {
  if (currentPlatformIndex < NUMBER_OF_PLATFORMS)
    if (platforms[currentPlatformIndex].xPosition <= stickEndX &&
    platforms[currentPlatformIndex].xPosition + platforms[currentPlatformIndex].width >= stickEndX &&
    stickEndY.toFixed(2) == PLATFORM_POSITION_HEIGHT)  // stickEndY ostatecznie wynosi np. 400.00000000000017, więc toFixed()
      return true
      
  return false
}

function drawLine(before = false) { // before oznacza, że odnosimy się do poprzedniej platformy
  if (before && currentPlatformIndex > 0)
    stickStartX = platforms[currentPlatformIndex - 1].xPosition + platforms[currentPlatformIndex - 1].width - 1
  else
    stickStartX = platforms[currentPlatformIndex].xPosition + platforms[currentPlatformIndex].width - 1
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(stickStartX, stickStartY);
  ctx.lineTo(stickEndX, stickEndY);
  ctx.stroke();
}

function animateStudent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // drawLine();
  drawSticks()
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

  if (isDrawingRising)
    requestAnimationFrame(animateStickRising);
}

function animateStickRotating() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stickRotationAngle += Math.PI / 180 * 2;  // obrot o 2 stopnie
  
  stickEndX = stickStartX + Math.sin(stickRotationAngle) * stickLength;
  stickEndY = stickStartY + (-Math.cos(stickRotationAngle)) * stickLength;

  drawLine();
  draw();
  
  if (stickRotationAngle > Math.PI / 2) // stickRotationAngle > 90 stopni
    isDrawingRotate = false;

  if (isDrawingRotate)
    requestAnimationFrame(animateStickRotating);
  else {
    isDrawingFalling = true
    requestAnimationFrame(animateStickFalling)
    if (currentPlatformIndex < NUMBER_OF_PLATFORMS - 1 && stickEndY.toFixed(2) == PLATFORM_POSITION_HEIGHT) {
      // isDrawingFalling = true;
      currentPlatformIndex++
    }
  }

  if (ifStickTouchPlatform()) {
    len = platforms[currentPlatformIndex - 1].xPosition + platforms[currentPlatformIndex - 1].width - 1
    sticks.push({ xPosition: len, width: stickEndX - stickStartX });
    isDrawingFalling = false;
    drawSticks()
  }
}

function animateStickFalling() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stickRotationAngle += Math.PI / 180 * 2;  // obrot o 2 stopnie
  
  stickEndX = stickStartX + Math.sin(stickRotationAngle) * stickLength;
  stickEndY = stickStartY + (-Math.cos(stickRotationAngle)) * stickLength;

  if (currentPlatformIndex < NUMBER_OF_PLATFORMS - 1)  // belka rysowana na poprzedniej platformie, gdyż currentPlatformIndex została zwiększona o 1
    drawLine(true);  // currentPlatformIndex została zwiększona o 1, więc przekazujemy wartość true, by się odnieść do poprzedniej platformy
  else
    drawLine()  // belka rysowana na ostatniej platformie się nie cofa 

  draw();

  if (stickRotationAngle > Math.PI)  // stickRotationAngle > 180 stopni
    isDrawingFalling = false;
  
  if (isDrawingFalling)
    requestAnimationFrame(animateStickFalling);
  else
    stickLength = 0
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
  intervalID = setInterval(animateStudent, 10);
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});


generatePlatforms(NUMBER_OF_PLATFORMS);
generatePlatformPoint();
draw();