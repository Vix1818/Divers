// ✅ Sélection du canvas et du contexte 2D
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 400;

const player = { x: 225, y: 370, width: 50, height: 20, speed: 10 };
const bullets = [];
const enemies = [];
const enemySize = 30;
const enemyRows = 3;
const enemyCols = 6;

// ✅ Création des ennemis
function createEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({ x: col * 50 + 50, y: row * 50 + 20, alive: true });
        }
    }
}
createEnemies();

// ✅ Dessin du jeu
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    bullets.forEach((bullet, index) => {
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    enemies.forEach(enemy => {
        if (enemy.alive) {
            ctx.fillStyle = "green";
            ctx.fillRect(enemy.x, enemy.y, enemySize, enemySize);
        }
    });

    requestAnimationFrame(draw);
}
draw();

// ✅ Gestion du clavier
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += player.speed;
    if (e.key === " ") bullets.push({ x: player.x + 22, y: player.y, speed: 5 });
});

// ✅ Gestion des boutons tactiles
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");

let moveLeft = false;
let moveRight = false;

leftBtn.addEventListener("touchstart", () => moveLeft = true);
leftBtn.addEventListener("touchend", () => moveLeft = false);
rightBtn.addEventListener("touchstart", () => moveRight = true);
rightBtn.addEventListener("touchend", () => moveRight = false);
shootBtn.addEventListener("touchstart", () => bullets.push({ x: player.x + 22, y: player.y, speed: 5 }));

// ✅ Mouvement fluide du joueur
function updateMovement() {
    if (moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    requestAnimationFrame(updateMovement);
}
updateMovement();
