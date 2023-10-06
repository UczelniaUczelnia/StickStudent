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

platforms = [{ xPosition: PLATFORM_POSITION_START, width: PLATFORM_WIDTH_START }];

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

generatePlatforms(5)

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