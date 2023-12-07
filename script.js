/**
 * Current game status.
 * @type {string}
 */
let status = 'waiting';

/**
 * Timestamp of the last frame.
 * @type {number|undefined}
 */
let lastTimestamp;

/**
 * Current X position of the student.
 * @type {number}
 */
let studentPositionX;

/**
 * Current Y position of the student.
 * @type {number}
 */
let studentPositionY;

/**
 * Translation of the game scene.
 * @type {number}
 */
let sceneTranslation;

/**
 * Array storing platform objects.
 * @type {Array}
 */
let platforms = [];

/**
 * Array storing stick objects.
 * @type {Array}
 */
let sticks = [];

/**
 * Array storing tree objects.
 * @type {Array}
 */
let trees = [];

/**
 * Current player's points.
 * @type {number}
 */
let points = 0;

/**
 * Height of the first hill.
 * @const {number}
 */
const HILL1_HEIGHT = 200;

/**
 * Maximum height of the first hill.
 * @const {number}
 */
const HILL1_MAX_HEIGHT = 25;

/**
 * Frequency of the first hill.
 * @const {number}
 */
const HILL1_FREQUENCY = 1;

/**
 * Height of the second hill.
 * @const {number}
 */
const HILL2_HEIGHT = 125;

/**
 * Maximum height of the second hill.
 * @const {number}
 */
const HILL2_MAX_HEIGHT = 20;

/**
 * Frequency of the second hill.
 * @const {number}
 */
const HILL2_FREQUENCY = 0.7;

/**
 * Width of the student.
 * @const {number}
 */
const STUDENT_WIDTH = 17;

/**
 * Height of the student.
 * @const {number}
 */
const STUDENT_HEIGHT = 30;

/**
 * Width of the game canvas.
 * @const {number}
 */
const CANVAS_WIDTH = 375;

/**
 * Height of the game canvas.
 * @const {number}
 */
const CANVAS_HEIGHT = 375;

/**
 * Height of the platform.
 * @const {number}
 */
const PLATFORM_HEIGHT = 100;

/**
 * Bonus size on the platform.
 * @const {number}
 */
const PLATFORM_BONUS_SIZE = 10;

/**
 * Reference to the game canvas element.
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('game');

/**
 * Set canvas width to match window width.
 */
canvas.width = window.innerWidth;

/**
 * Set canvas height to match window height.
 */
canvas.height = window.innerHeight;

/**
 * 2D rendering context of the canvas.
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

/**
 * Reference to the instruction element.
 * @type {HTMLElement}
 */
const instructionEl = document.getElementById('instruction');

/**
 * Reference to the bonus element.
 * @type {HTMLElement}
 */
const bonusEl = document.getElementById('bonus');

/**
 * Reference to the restart button.
 * @type {HTMLButtonElement}
 */
const restartButton = document.getElementById('restart');

/**
 * Reference to the points element.
 * @type {HTMLElement}
 */
const pointsEl = document.getElementById('points');

/**
 * Prototype method for accessing the last element in an array.
 * @returns {*} The last element in the array.
 */
Array.prototype.last = function() {
    return this[this.length - 1];
};

/**
 * Function to reset the game state.
 */
resetGame();

/**
 * Resets the game state.
 */
function resetGame() {
    status = 'waiting';
    lastTimestamp = undefined;
    sceneTranslation = 0;
    points = 0;
    pointsEl.innerText = points;
    platforms = [{ x: 50, w: 50 }];

    // Generate initial platforms
    for (let i = 0; i < 4; ++i)
        generatePlatform();

    sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
    trees = [];

    // Generate initial trees
    for (let i = 0; i < 10; ++i)
        generateTree();

    studentPositionX = platforms[0].x + platforms[0].w - 10;
    studentPositionY = 0;
    draw();
}

/**
 * Generates a tree and adds it to the trees array.
 */
function generateTree() {
    const minimumGap = 50;
    const maximumGap = 170;

    const lastTree = trees[trees.length - 1];
    let furthestX = lastTree ? lastTree.x : 0;

    const x = furthestX +
        minimumGap +
        Math.floor(Math.random() * (maximumGap - minimumGap));
    const treeColors = ["#558b2f", "#43a047", "#76ff03"];
    const color = treeColors[Math.floor(Math.random() * 3)];
    trees.push({ x, color });
}
/**
 * Generates a new platform and adds it to the platforms array.
 */
function generatePlatform() {
    const platformMinGap = 40;
    const platformMaxGap = 200;
    const minWidth = 20;
    const maxWidth = 100;

    const lastPlatform = platforms[platforms.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x = furthestX + platformMinGap + Math.floor(Math.random() * (platformMaxGap - platformMinGap));
    const w = minWidth + Math.floor(Math.random() * (maxWidth - minWidth));

    platforms.push({ x, w });
}

/**
 * Handles the keydown event for the spacebar, resetting the game when pressed.
 * @param {Event} event - The keydown event.
 */
window.addEventListener('keydown', (event) => {
    if (event.key == " ") {
        resetGame();
        restartButton.style.display = "none";
        return;
    }
});

/**
 * Handles the mousedown event, initiating the stretching phase of the game.
 */
window.addEventListener('mousedown', () => {
    if (status == "waiting") {
        lastTimestamp = undefined;
        instructionEl.style.opacity = 0;
        status = 'stretching';
        window.requestAnimationFrame(animate);
    }
});

/**
 * Handles the mouseup event, transitioning to the turning phase of the game.
 */
window.addEventListener('mouseup', () => {
    if (status == "stretching") {
        status = "turning";
    }
});

/**
 * Handles the resize event, adjusting the canvas size and redrawing the game.
 */
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

/**
 * Animates the game based on the current game status.
 * @param {number} timestamp - The current timestamp for smooth animation.
 */
function animate(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
    }

    switch (status) {
        case "waiting":
            return;
        case "stretching": {
            sticks.last().length += (timestamp - lastTimestamp) / 4;
            break;
        }

        case 'turning': {
            sticks.last().rotation += (timestamp - lastTimestamp) / 4;

            if (sticks.last().rotation > 90) {
                sticks.last().rotation = 90;

                const [nextPlatform, bonusHit] = platformHit();
                if (nextPlatform) {

                    if (bonusHit) {
                        points += 2
                        bonusEl.style.opacity = 1;
                        setTimeout(() => (bonusEl.style.opacity = 0), 1000);
                    }
                    else
                        points += 1

                    pointsEl.innerText = points;
                    generatePlatform();
                    generateTree();
                    generateTree();
                }
                status = 'walking';
            }
            break;
        }
        case 'walking': {
            studentPositionX += (timestamp - lastTimestamp) / 4;
            const [nextPlatform] = platformHit();
            if (nextPlatform) {
                const maxHeroX = nextPlatform.x + nextPlatform.w - 10;
                if (studentPositionX > maxHeroX) {
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
            if (sticks.last().rotation < 180)
                sticks.last().rotation += (timestamp - lastTimestamp) / 4;
            studentPositionY += (timestamp - lastTimestamp) / 2;
            const maxStudentFallingY = PLATFORM_HEIGHT + 100 + (window.innerHeight - CANVAS_HEIGHT) / 2;
            if (studentPositionY > maxStudentFallingY) {
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

/**
 * Checks for a collision between the stick and a platform.
 * @returns {Array.<undefined, boolean>} - The hit platform and a boolean indicating bonus hit.
 */
function platformHit() {
    const stickFarX = sticks.last().x + sticks.last().length;
    const platformHit = platforms.find((platform) => {
        const platformFarX = platform.x + platform.w;
        return platform.x < stickFarX && stickFarX < platformFarX;
    });

    if (platformHit && isStickInBonusArea(platformHit, stickFarX)) {
        return [platformHit, true];
    }
    return [platformHit, false];
}

/**
 * Checks if the stick is in the bonus area of a platform.
 * @param {Object} platform - The platform object.
 * @param {number} stickFarX - The far x-coordinate of the stick.
 * @returns {boolean} - True if the stick is in the bonus area, false otherwise.
 */
function isStickInBonusArea(platform, stickFarX) {
    const bonusAreaStartX = platform.x + platform.w / 2 - PLATFORM_BONUS_SIZE / 2;
    const bonusAreaEndX = platform.x + platform.w / 2 + PLATFORM_BONUS_SIZE / 2;
    return bonusAreaStartX < stickFarX && stickFarX < bonusAreaEndX;
}

/**
 * Draws the entire game on the canvas.
 */
function draw() {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawBackground();
    ctx.translate(
        (window.innerWidth - CANVAS_WIDTH) / 2 - sceneTranslation,
        (window.innerHeight - CANVAS_HEIGHT) / 2
    );
    drawPlatforms();
    drawStudent();
    drawSticks();
    ctx.restore();
}

/**
 * Handles the click event on the restart button, resetting the game.
 * @param {Event} event - The click event.
 */
restartButton.addEventListener('click', (event) => {
    resetGame();
    restartButton.style.display = 'none';
});

/**
 * Draws the platforms on the canvas, including bonus areas.
 */
function drawPlatforms() {
    platforms.forEach(({ x, w }) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(x, CANVAS_HEIGHT - PLATFORM_HEIGHT, w, PLATFORM_HEIGHT + (window.innerHeight - CANVAS_HEIGHT) / 2);

        if (sticks.last().x < x) {
            ctx.fillStyle = 'red';
            ctx.fillRect(x + w / 2 - PLATFORM_BONUS_SIZE / 2, CANVAS_HEIGHT - PLATFORM_HEIGHT, PLATFORM_BONUS_SIZE, PLATFORM_BONUS_SIZE);
        }
    });
}

/**
 * Draws the student character on the canvas.
 */
function drawStudent() {
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.translate(studentPositionX - STUDENT_WIDTH / 2, studentPositionY + CANVAS_HEIGHT - PLATFORM_HEIGHT - STUDENT_HEIGHT / 2);

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
    ctx.arc(1.5, -7.5, 1.7, 0, Math.PI * 2, false);
    ctx.arc(6, -7.4, 1.5, 0, Math.PI * 2, false);
    ctx.fill()
    ctx.fillStyle = "black";

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, -20);
    ctx.lineTo(-14, -13);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, -20);   // prawy
    ctx.lineTo(0, -13);    // dolny
    ctx.lineTo(-12, -20);  // lewy
    ctx.lineTo(-2, -25);   // górny
    ctx.fill()

    ctx.fillStyle = "#2A2828";
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.lineTo(-6, -14);
    ctx.lineTo(0, -14);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -18);
    ctx.lineTo(6, -14);
    ctx.lineTo(0, -14);
    ctx.fill();

    ctx.restore();
}

/**
 * Draws a rounded rectangle representing the body of the character.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {number} radius - The radius of the rounded corners.
 */
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

/**
 * Draws the sticks on the canvas.
 */
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

/**
 * Draws the background of the game, including hills and trees.
 */
function drawBackground() {
    // Sky color gradient
    var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, "#8ad5f4");
    gradient.addColorStop(1, "#adedf5");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw hills
    drawHill(HILL1_HEIGHT, HILL1_MAX_HEIGHT, HILL1_FREQUENCY, "#68da27");
    drawHill(HILL2_HEIGHT, HILL2_MAX_HEIGHT, HILL2_FREQUENCY, "#3f9534");

    // Draw trees
    trees.forEach((tree) => drawTree(tree.x, tree.color));
}

/**
 * Draws a tree on the canvas.
 * @param {number} x - The x-coordinate of the tree.
 * @param {string} color - The color of the tree.
 */
function drawTree(x, color) {
    ctx.save();

    const sinY = window.innerHeight - HILL1_HEIGHT;
    ctx.translate(
        (-sceneTranslation + x) * HILL1_FREQUENCY, Math.sin((x / 180) * Math.PI) * HILL1_MAX_HEIGHT + sinY
    );

    const treeTrunkHeight = 13;
    const treeTrunkWidth = 4;
    const treeCrownHeight = 55;
    const treeCrownWidth = 30;

    // Trunk
    ctx.fillStyle = "#777c3e";
    ctx.fillRect(
        -treeTrunkWidth / 2,
        -treeTrunkHeight,
        treeTrunkWidth,
        treeTrunkHeight
    );

    ctx.beginPath();
    ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
    ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
    ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

/**
 * Draws a hill on the canvas.
 * @param {number} height - The base height of the hill.
 * @param {number} maxHeight - The maximum height of the hill.
 * @param {number} frequency - The frequency of the hill's oscillation.
 * @param {string} color - The color of the hill.
 */
function drawHill(height, maxHeight, frequency, color) {
    ctx.beginPath();
    ctx.moveTo(0, window.innerHeight);

    let sinY = window.innerHeight - height;
    let hillY = Math.sin(((sceneTranslation) * frequency / 180) * Math.PI) * maxHeight + sinY
    ctx.lineTo(0, hillY);

    for (let i = 0; i < window.innerWidth; i++) {
        sinY = window.innerHeight - height;
        hillY = Math.sin(((sceneTranslation + i) * frequency / 180) * Math.PI) * maxHeight + sinY
        ctx.lineTo(i, hillY);
    }
    ctx.lineTo(window.innerWidth, window.innerHeight);
    ctx.fillStyle = color;
    ctx.fill();
}