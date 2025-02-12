// ✅ Adapter le canvas à l'écran
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 500);
    canvas.height = Math.min(window.innerHeight * 0.8, 600);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Exécuter au chargement
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 600;

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
let enemyDirection = 1; // 1 = droite, -1 = gauche

let score = 0;
let gameOver = false;

// 🎯 Générer les ennemis
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

// 🎮 Gestion du joueur
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && playerX > 0) {
        playerX -= playerSpeed;
    } else if (event.key === "ArrowRight" && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    } else if (event.key === " ") {
        bullets.push({ x: playerX + playerWidth / 2, y: canvas.height - 50, speed: 5 });
    }
});
// ✅ Sélection des boutons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

// ✅ Déplacer à gauche
leftBtn.addEventListener("touchstart", () => {
    playerX -= playerSpeed;
});

// ✅ Déplacer à droite
rightBtn.addEventListener("touchstart", () => {
    playerX += playerSpeed;
});

// ✅ Tirer
shootBtn.addEventListener("touchstart", () => {
    bullets.push({ x: playerX + playerWidth / 2, y: canvas.height - 50, speed: 5 });
});

// 🖌️ Dessiner le joueur
function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(playerX, canvas.height - 50, playerWidth, playerHeight);
}

// 🏹 Dessiner et gérer les tirs
function drawBullets() {
    ctx.fillStyle = "red";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x - 2, bullets[i].y, 4, 10);
        bullets[i].y -= bullets[i].speed;
    }
    // Supprimer les balles hors écran
    bullets = bullets.filter(bullet => bullet.y > 0);
}

// 👾 Dessiner et déplacer les ennemis
function drawEnemies() {
    ctx.fillStyle = "green";
    let shiftDown = false;
    
    for (let enemy of enemies) {
        if (enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
            enemy.x += enemySpeed * enemyDirection;

            // Si un ennemi touche les bords, on change de direction
            if (enemy.x + enemyWidth >= canvas.width || enemy.x <= 0) {
                shiftDown = true;
            }
        }
    }

    if (shiftDown) {
        enemyDirection *= -1;
        for (let enemy of enemies) {
            enemy.y += enemyHeight;
            // Game Over si un ennemi atteint le bas
            if (enemy.y + enemyHeight >= canvas.height - 50) {
                gameOver = true;
            }
        }
    }
}

// 🎯 Gérer les collisions
function checkCollisions() {
    for (let bullet of bullets) {
        for (let enemy of enemies) {
            if (
                enemy.alive &&
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemyWidth &&
                bullet.y < enemy.y + enemyHeight
            ) {
                enemy.alive = false;
                bullet.y = -10; // Supprime la balle
                score += 10;
            }
        }
    }
}

// 🕹️ Mettre à jour le jeu
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
    drawEnemies();
    checkCollisions();

    // 🎯 Vérifier si tous les ennemis sont morts
    if (enemies.every(enemy => !enemy.alive)) {
        ctx.fillStyle = "yellow";
        ctx.font = "30px Arial";
        ctx.fillText("VICTOIRE !", canvas.width / 3, canvas.height / 2);
        return;
    }

    // 🏆 Afficher le score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score : " + score, 20, 30);

    requestAnimationFrame(updateGame);
}

updateGame();
