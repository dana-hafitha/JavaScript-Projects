import { Player } from "./player.js";
import { EntityFactory } from "./factory.js";
import { ASSETS, loadAllAssets, playSound } from "./assestLoading.js";
import { Subject, ScoreObserver, LevelObserver } from "./observer.js";


// -------------------------- define variables --------------------------

const canvas = document.getElementById('gameCanvas');

//The string '2d' is passed as a parameter indicating you want a two-dimensional rendering context. 
// This context provides methods for drawing and manipulating shapes, text, images, and other graphics in a 2D space.
let context = canvas.getContext('2d');

// define keys.
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

// define enemies
let enemies = [];
let lastEnemyAppeared = 0;

// define the player
const player = new Player(100, 400, 20, 'blue', 5);


let currentLevel = 0;

// define the game started signal 
let gameStarted = false;
let gameOver = false;
let loading = true;

let powerUps = [];
let lastPowerUpTime = 0; // spawn timer

const scoreSubject = new Subject();
const scoreObserver = new ScoreObserver();
const levelObserver = new LevelObserver();

scoreSubject.subscribe(scoreObserver);
scoreSubject.subscribe(levelObserver);


let bgm = null; // background music 

// creating the scores and the lives DOM elements 
const div = document.createElement("div");
document.body.prepend(div);

const scoreDisplay = document.createElement("p");
div.appendChild(scoreDisplay);

const livesDisplay = document.createElement("p");
div.appendChild(livesDisplay);

const highestScoreDisplay = document.createElement("p");
div.appendChild(highestScoreDisplay);

// ---------------------------- Defining functions -------------------------

// in order to initialize the game
async function initGame() {
    try {
        await loadAllAssets();
        // assign the levels array to the observer 
        levelObserver.levels = ASSETS.levels || [];
        // ensure currentLevel/last spawn timestamp align with loaded levels
        currentLevel = levelObserver.getCurrentLevelIndex() || 0;
        lastEnemyAppeared = Date.now();
        loading = false;
        setInterval(gameloop, 1000 / 60);
    } catch (err) {
        console.error("Error loading assets:", err);
    }
}
initGame();

// a function to draw a make a new enemy
function newEnemy() {

    const lvl = ASSETS.levels[currentLevel] || {};
    const radius = 20;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = -20;
    const color = "red";
    const velocity = lvl.enemySpeed || 2;

    // create enemy via the EntityFactory
    let enemy = EntityFactory.createEntity("enemy", { x, y, radius, color, velocity });
    enemies.push(enemy);

}

function createPowerUp() {
    const x = Math.random() * (canvas.width - 30) + 15;
    const powerUp = EntityFactory.createEntity("powerup", { x, y: -20, radius: 15, color: "gold", effect: "doubleScore", duration: 5000 });
    powerUps.push(powerUp);
} 

function resetGame() {
    scoreObserver.reset();
    // ensure multiplier is reset and observers are updated
    scoreSubject.notify({ type: "multiplier", value: 1 });

    // reset level observer and current level when restarting
    levelObserver.reset();
    levelObserver.levels = ASSETS.levels || [];
    currentLevel = levelObserver.getCurrentLevelIndex();

    player.lives = 3; // or whatever you want
    enemies = [];
    player.bullets = [];
    player.bulletColor = "#6eaed3ff";
    player.scoreMultiplier = 1;

    // remove any falling powerups and reset spawn timer
    powerUps = [];
    lastPowerUpTime = Date.now();

    player.x = canvas.width / 2; // reset player position
    player.y = canvas.height - 50;
    lastEnemyAppeared = Date.now();
}

// the main game loop function .
function gameloop() {

    // draw the score system
    scoreDisplay.textContent = `Score: ${scoreObserver.score}`;
    livesDisplay.textContent = `Lives: ${player.lives}`;
    highestScoreDisplay.textContent = `Highest Score: ${scoreObserver.getHighest()}`;

    if (loading) { // the assets is not loaded yet...
        context.fillStyle = "black";
        context.font = "28px Arial";
        context.textAlign = "center";
        context.fillText("Loading...", canvas.width / 2, canvas.height / 2);
        return;
    }

    const bg = ASSETS.images.bg;  // loaded background image
    if (bg) {
        context.drawImage(bg, 0, 0, canvas.width, canvas.height);
    } else { // if there is no image in the assets 
        context.fillStyle = "#d6cacaff";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    // for starting the game
    if (!gameStarted) {
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.textAlign = "center";
        context.fillText("Press ENTER to start", canvas.width / 2, canvas.height / 2);
        return; // stop drawing game objects
    }

    // If a level-up just happened, show the level-up screen (pause game for a short time)
    if (!gameOver && levelObserver.isLevelUpActive()) {
        // apply the new level so new enemies spawned after the pause use the faster settings
        currentLevel = levelObserver.getCurrentLevelIndex();

        context.fillStyle = "rgba(0,0,0,0.6)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "yellow";
        context.font = "40px Arial";
        context.textAlign = "center";
        const displayLevel = currentLevel + 1;
        context.fillText(`LEVEL UP! Level ${displayLevel}`, canvas.width / 2, canvas.height / 2 - 20);
        
        context.fillStyle = "white";
        context.font = "18px Arial";
        context.fillText(`Get ready — enemies are faster now`, canvas.width / 2, canvas.height / 2 + 20);

        return; // stop the game loop.
    }

    if (gameOver) {
        // Draw game over screen
        context.fillStyle = "red";
        context.font = "40px Arial";
        context.textAlign = "center";
        context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
        context.fillStyle = "white";
        context.font = "20px Arial";
        context.fillText(`Final Score: ${scoreObserver.score}`, canvas.width / 2, canvas.height / 2 + 20);
        context.fillText("Press ENTER to restart", canvas.width / 2, canvas.height / 2 + 60);
        return; // stop the rest of the game loop
    }


    player.move(upPressed, downPressed, leftPressed, rightPressed, canvas);
    player.updateBullets(context);
    player.draw(context);

    let currentTime = Date.now();

    // if a spawn rate time has passed since the last enemy appeared create a new one
    if (gameStarted && currentTime - lastEnemyAppeared > ASSETS.levels[currentLevel].spawnRate) {
        newEnemy();
        lastEnemyAppeared = currentTime;
    }

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        enemy.draw(context);

        // Check collision with player
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + enemy.radius) {
            // player hit
            player.lives -= 1;
            enemies.splice(enemyIndex, 1); // remove enemy
            if (player.lives <= 0) {
                gameOver = true; // trigger game over
                scoreObserver.persistIfHigher();
            }
        }
    });

    // Track which bullets hit an enemy
    const bulletsHit = new Set();

    // Filter enemies: remove enemies that are hit
    enemies = enemies.filter(enemy => {
        let hit = false;

        player.bullets.forEach((bullet) => {
            let dx = bullet.x - enemy.x;
            let dy = bullet.y - enemy.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < enemy.radius) {
                hit = true;
                bulletsHit.add(bullet); // mark bullet for removal
            }
        });

        return !hit; // remove enemy if hit
    });

    // Remove bullets that hit an enemy
    player.bullets = player.bullets.filter(bullet => !bulletsHit.has(bullet));

    // Increase score
    if (bulletsHit.size > 0) {
        const basePoints = 5;
        const total = bulletsHit.size * basePoints * scoreObserver.getMultiplier();
        scoreSubject.notify({ type: "score", value: total });
    }


    if (Date.now() - lastPowerUpTime > 20000) { // every 20 seconds create a power-up
        createPowerUp();
        lastPowerUpTime = Date.now();
    }

    // update and draw power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const p = powerUps[i];
        context.fillStyle = "gold";
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        context.fill();

        // update position
        p.y += p.velocity;

        // remove if it goes off screen
        if (p.y > canvas.height + p.radius) {
            powerUps.splice(i, 1);
            continue;
        }

        // collision with player
        let dx = player.x - p.x;
        let dy = player.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + p.radius) {
            p.applyEffect(player, scoreSubject); // pass subject
            powerUps.splice(i, 1);
        }
    }

}

// ---------------------------- Defining Event listeners -------------------

// detect the keys pressing
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!gameStarted) {
            // start for the first time
            gameStarted = true;
            gameOver = false;
            resetGame();
            if (bgm) bgm.pause();
            bgm = playSound("level1", { loop: true, volume: 0.5 });
        } else if (gameOver) {
            // restart after game over
            gameOver = false;
            resetGame();
            if (bgm) bgm.pause();
            bgm = playSound("level1", { loop: true, volume: 0.5 });
        }

    }
    else if (e.key === 'ArrowUp' || e.key == "Up") {
        upPressed = true;
    }
    else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
    }
    else if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key === " ") {
        player.shoot();
        playSound("shoot");
    }
});

// detect the keys unpressing
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key == "Up") {
        upPressed = false;
    }
    else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
    }
    else if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }

});

