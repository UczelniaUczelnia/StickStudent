const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const CANVAS_HEIGHT = 1000;
const CANVAS_WIDTH = 1000;

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

platforms = [{ xPosition: PLATFORM_POSITION_START, width: PLATFORM_WIDTH_START }];

studentX = platforms[0].xPosition + platforms[0].width / 2
studentY = 0;

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

function drawStudent() {
 
  ctx.save();
  ctx.fillStyle = "black";
  ctx.translate(studentX,PLATFORM_POSITION_HEIGHT - 28 );

  // Body
  ctx.fillStyle = "black";
  ctx.roundRect(0, 0, HERO_WIDTH, HERO_HEIGHT, 5);
  ctx.fill();

  // Legs
  const LEG_DISTANCE = 3;
  ctx.beginPath();
  ctx.arc(LEG_DISTANCE, HERO_HEIGHT, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(HERO_WIDTH - LEG_DISTANCE, HERO_HEIGHT, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Eye
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(HERO_WIDTH - LEG_DISTANCE, HERO_HEIGHT-(HERO_HEIGHT-5), 3, 0, Math.PI * 2, false);
  ctx.fill();

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

  ctx.restore();
  
}

generatePlatforms(5)
drawStudent()
// ctx.beginPath();
// ctx.lineWidth = 2;
// ctx.moveTo(PLATFORM_POSITION_START + PLATFORM_WIDTH_START - 1, PLATFORM_POSITION_HEIGHT);
// ctx.lineTo(PLATFORM_POSITION_START + PLATFORM_WIDTH_START - 1, PLATFORM_POSITION_HEIGHT - 100);
// ctx.stroke();


let drawing = false;
let startX = PLATFORM_POSITION_START + PLATFORM_WIDTH_START - 1, startY = PLATFORM_POSITION_HEIGHT;

// Obsługa zdarzeń
canvas.addEventListener("mousedown", function(e) {
    drawing = true;
      
    // startX = e.clientX - canvas.offsetLeft;
    // startY = e.clientY - canvas.offsetTop;
    if (!drawing) return;
    
    const currentX = startX;
    const currentY = startY;

    while (startY > 100)
    {
      // Rysuj linię
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Zaktualizuj pozycję początkową
      startX = currentX;
      startY--;
      console.log(startY)
    }
});

canvas.addEventListener("mousemove", function(e) {
    
});

canvas.addEventListener("mouseup", function() {
    drawing = false;
});

canvas.addEventListener("mouseleave", function() {
    drawing = false;
});