// ✅ Sélection du canvas et du contexte 2D
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ✅ Ajustement du canvas pour mobile et desktop
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 500);
    canvas.height = Math.min(window.innerHeight * 0.6, 400);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ✅ Variables principales du jeu
const playerWidth = 40;
const playerHeight = 20;
let playerX = (canvas.width / 2) - (playerWidth / 2);
const playerSpeed = 5;
let bullets = [];
let enemies = [];
const enemyRows = 3;
const enemyCols = 6;
const enemyWidth = 40;
const enemyHeight = 30;
const enemyGap = 20;
const enemySpeed = 1;
let enemyDirection = 1;
let score = 0;
let gameOver = false;

// ✅ Générer les ennemis
function createEnemies() {
    enemies = [];
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({
                x: col * (enemyWidth + enemyGap) + 50,
                y: row * (enemyHeight + enemyGap) + 50,
                alive: true
            });
        }
    }
}
createEnemies();

// ✅ Gestion du clavier pour PC
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && playerX > 0) {
        playerX -= playerSpeed;
    } else if (event.key === "ArrowRight" && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    } else if (event.key === " ") {
        shootBullet();
    }
});

// ✅ Sélection des boutons tactiles
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

let moveLeft = false;
let moveRight = false;

// ✅ Boutons pour mobile (iPhone et iPad)
leftBtn.addEventListener("touchstart", () => moveLeft = true);
leftBtn.addEventListener("touchend", () => moveLeft = false);

rightBtn.addEventListener("touchstart", () => moveRight = true);
rightBtn.addEventListener("touchend", () => moveRight = false);

shootBtn.addEventListener("touchstart", () => shootBullet());

// ✅ Fonction pour tirer un projectile
function shootBullet() {
    bullets.push({ x: playerX + playerWidth / 2, y: canvas.height - 50, speed: 5 });
}

// ✅ Mouvement fluide du joueur
function updateMovement() {
    if (moveLeft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (moveRight && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    requestAnimationFrame(updateMovement);
}
updateMovement();

// ✅ Dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(playerX, canvas.height - 50, playerWidth, playerHeight);
}

// ✅ Dessiner et gérer les tirs
function drawBullets() {
    ctx.fillStyle = "red";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x - 2, bullets[i].y, 4, 10);
        bullets[i].y -= bullets[i].speed;
    }
    bullets = bullets.filter(bullet => bullet.y > 0);
}

// ✅ Vérifier les collisions entre les balles et les ennemis
function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            let bullet = bullets[i];
            let enemy = enemies[j];

            if (
                enemy.alive &&
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemyWidth &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemyHeight
            ) {
                enemy.alive = false;
                bullets.splice(i, 1);
                score += 10;
                i--;
                break;
            }
        }
    }
}

// ✅ Dessiner et déplacer les ennemis
function drawEnemies() {
    ctx.fillStyle = "green";
    let shiftDown = false;

    for (let enemy of enemies) {
        if (enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
            enemy.x += enemySpeed * enemyDirection;

            if (enemy.x + enemyWidth >= canvas.width || enemy.x <= 0) {
                shiftDown = true;
            }
        }
    }

    if (shiftDown) {
        enemyDirection *= -1;
        for (let enemy of enemies) {
            enemy.y += enemyHeight;
            if (enemy.y + enemyHeight >= canvas.height - 50) {
                gameOver = true;
            }
        }
    }
}

// ✅ Gérer le jeu
function updateGame() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 3, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    checkCollisions();
    drawEnemies();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score : " + score, 20, 30);

    requestAnimationFrame(updateGame);
}
updateGame();

// ✅ Convertisseur BTC/USD/Satoshis (Correctif Final)
const btcInput = document.getElementById("btcInput");
const usdInput = document.getElementById("usdInput");
const satsInput = document.getElementById("satsInput");
const convertBtn = document.getElementById("convertBtn");
const exchangeRateText = document.getElementById("exchangeRate");

// ✅ Fonction pour récupérer le taux de change BTC/USD
async function fetchExchangeRate() {
    try {
        let response = await fetch("https://api.coindesk.com/v1/bpi/currentprice/USD.json");
        let data = await response.json();
        return data.bpi.USD.rate_float;
    } catch (error) {
        console.error("Erreur lors de la récupération du taux BTC/USD :", error);
        return null;
    }
}

// ✅ Fonction de conversion
async function updateConversion() {
    let exchangeRate = await fetchExchangeRate();
    if (!exchangeRate) {
        exchangeRateText.textContent = "Erreur de récupération du taux.";
        return;
    }
    exchangeRateText.textContent = `Taux BTC/USD : ${exchangeRate.toFixed(2)} USD`;

    let btc = parseFloat(btcInput.value) || 0;
    let usd = parseFloat(usdInput.value) || 0;
    let sats = parseFloat(satsInput.value) || 0;

    if (btc > 0) {
        usdInput.value = (btc * exchangeRate).toFixed(2);
        satsInput.value = (btc * 100000000).toFixed(0);
    } else if (usd > 0) {
        btcInput.value = (usd / exchangeRate).toFixed(8);
        satsInput.value = ((usd / exchangeRate) * 100000000).toFixed(0);
    } else if (sats > 0) {
        btcInput.value = (sats / 100000000).toFixed(8);
        usdInput.value = ((sats / 100000000) * exchangeRate).toFixed(2);
    }
}

// ✅ Mise à jour au clic sur "Convertir"
convertBtn.addEventListener("click", updateConversion);

// ✅ Chargement du taux BTC/USD dès l'ouverture
fetchExchangeRate().then(rate => {
    if (rate) {
        exchangeRateText.textContent = `Taux BTC/USD : ${rate.toFixed(2)} USD`;
    } else {
        exchangeRateText.textContent = "Erreur de récupération du taux.";
    }
});
