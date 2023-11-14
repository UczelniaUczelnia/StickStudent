let status = 'waiting';
let lastTimestamp;
let studentPositionX;
let studentPositionY;
let sceneTranslation;
let platforms = [];
let sticks = [];
let points = 0;

const STUDENT_WIDTH = 17;
const STUDENT_HEIGHT = 30;

const CANVAS_WIDTH = 375;
const CANVAS_HEIGHT = 375;
const PLATFORM_HEIGHT = 100;
const PLATFORM_BONUS_SIZE = 10;
const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const instructionEl = document.getElementById('instruction');
const bonusEl = document.getElementById('bonus');
const restartButton = document.getElementById('restart');
const pointsEl = document.getElementById('points');

Array.prototype.last = function() {
    return this[this.length - 1];
};


resetGame();


function resetGame() {
    status = 'waiting';
    lastTimestamp = undefined;
    sceneTranslation = 0;
    points = 0;
    pointsEl.innerText = points;
    platforms = [{x: 50, w: 50}];
    for (let i = 0; i < 4; ++i)
        generatePlatform();

    sticks = [{x: platforms[0].x + platforms[0].w, length: 0, rotation: 0}];

    studentPositionX = platforms[0].x + platforms[0].w - 10;
    studentPositionY = 0;
    draw()
}

function generatePlatform() {
    const platformMinGap = 40;
    const platformMaxGap = 200;
    const minWidth = 20;
    const maxWidth = 100;

    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x = furthestX + platformMinGap + Math.floor(Math.random() * (platformMaxGap - platformMinGap));
    const w = minWidth + Math.floor(Math.random() * (maxWidth - minWidth));

    platforms.push({x, w});
}

window.addEventListener('mousedown', () => {
    if (status == "waiting") {
        lastTimestamp = undefined;
        instructionEl.style.opacity = 0;
        status = 'stretching';
        window.requestAnimationFrame(animate);
    }
});


window.addEventListener('mouseup', () => {
    if (status == "stretching") {
        status = "turning";
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

function animate(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
    }

    switch (status) {
        case "waiting":
            return;
        case "stretching":{
            sticks.last().length += (timestamp - lastTimestamp) / 4;
            break;
        }

        case 'turning': {
            sticks.last().rotation += (timestamp - lastTimestamp) / 4;

            if (sticks.last().rotation > 90) {
                sticks.last().rotation = 90;

                const [nextPlatform, bonusHit] = platformHit();
                if (nextPlatform) {
                    points += 1
                    pointsEl.innerText = points;
                    generatePlatform();
                }
                status = 'walking';
            }
            break;
        }
        case 'walking': {
            studentPositionX += (timestamp - lastTimestamp) / 4;
            const [nextPlatform] = platformHit();
            if(nextPlatform) {
                const maxHeroX = nextPlatform.x + nextPlatform.w - 10;
                if(studentPositionX > maxHeroX) {
                    studentPositionX = maxHeroX;
                    status = "transitioning";
                }
            } else {
                const maxHeroX = sticks.last().x + sticks.last().length + STUDENT_WIDTH;
                if (studentPositionX > maxHeroX) {
                    studentPositionX = maxHeroX;
                    status = 'falling';
                }
            }
            break;
        }
        case "transitioning": {
            sceneTranslation += (timestamp - lastTimestamp) / 3;
            const [nextPlatform] = platformHit();
            if (sceneTranslation > nextPlatform.x + nextPlatform.w - 100) {
                sticks.push({
                    x: nextPlatform.x + nextPlatform.w,
                    length: 0,
                    rotation: 0
                });
                status = "waiting";
            }
            break;
        }
        case "falling": {
            if(sticks.last().rotation < 180)
            sticks.last().rotation += (timestamp - lastTimestamp) / 4;
            studentPositionY += (timestamp - lastTimestamp) / 2;
            const maxStudentFallingY = PLATFORM_HEIGHT + 100 + (window.innerHeight - CANVAS_HEIGHT) / 2;
            if(studentPositionY > maxStudentFallingY) {
                restartButton.style.display = "block";
                return;
            }
            break;
        }
    }

    draw();
    window.requestAnimationFrame(animate);
    lastTimestamp = timestamp;
}

function platformHit() {
    const stickFarX = sticks.last().x + sticks.last().length;
    const platformHit = platforms.find((platform) => {
        const platformFarX = platform.x + platform.w;
        return platform.x < stickFarX && stickFarX < platformFarX;
    });

    if ( platformHit && isStickInBonusArea(platformHit, stickFarX) ) {
        return [platformHit, true];
    }
    return [platformHit, false];
}

function isStickInBonusArea(platform, stickFarX) {
    const bonusAreaStartX = platform.x + platform.w / 2 - PLATFORM_BONUS_SIZE / 2;
    const bonusAreaEndX = platform.x + platform.w / 2 + PLATFORM_BONUS_SIZE / 2;
    return bonusAreaStartX < stickFarX && stickFarX < bonusAreaEndX;
}

function draw() {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawPlatforms();
    drawStudent();
    drawSticks();
    ctx.restore();
}

restartButton.addEventListener('click', () => {
    resetGame();
    restartButton.style.display = 'none';
});

function drawPlatforms() {
    platforms.forEach(({x, w}) =>{
        ctx.fillStyle = 'black';
        ctx.fillRect(x, CANVAS_HEIGHT - PLATFORM_HEIGHT, w, PLATFORM_HEIGHT + (window.innerHeight - CANVAS_HEIGHT) / 2);
    });
}

function drawStudent() {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.translate(studentPositionX - STUDENT_WIDTH / 2 , studentPositionY + CANVAS_HEIGHT - PLATFORM_HEIGHT - STUDENT_HEIGHT / 2);

    drawBody(-STUDENT_WIDTH / 2, -STUDENT_HEIGHT / 2, STUDENT_WIDTH, STUDENT_HEIGHT - 4, 5);
    const legDistance = 5;
    ctx.beginPath();
    ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(5, -7, 3, 0, Math.PI * 2 , false);
    ctx.fill()
    ctx.fillStyle = "red";
    ctx.fillRect(-STUDENT_WIDTH / 2 - 1, -12, STUDENT_WIDTH + 2, 4.5);
    ctx.beginPath();
    ctx.moveTo(-9, -14.5);
    ctx.lineTo(-17, -18.5);
    ctx.lineTo(-14, -8.5);
    ctx.fill()
    ctx.beginPath();
    ctx.moveTo(-10, -10.5);
    ctx.lineTo(-15, -3.5);
    ctx.lineTo(-5, -7);
    ctx.fill();
    ctx.restore();
}

function drawBody(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.lineTo(x + width, y + radius)
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
}

function drawSticks() {
    sticks.forEach((stick) => {
        ctx.save();
        ctx.translate(stick.x, CANVAS_HEIGHT - PLATFORM_HEIGHT);
        ctx.rotate((Math.PI / 180) * stick.rotation);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -stick.length);
        ctx.stroke();
        ctx.restore();
    });
}