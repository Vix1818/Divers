// ✅ Gestion du jeu
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

function createEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({ x: col * 50 + 50, y: row * 50 + 20, alive: true });
        }
    }
}
createEnemies();

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

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += player.speed;
    if (e.key === " ") bullets.push({ x: player.x + 22, y: player.y, speed: 5 });
});

// ✅ Convertisseur
const btcInput = document.getElementById("btcInput");
const usdInput = document.getElementById("usdInput");
const satsInput = document.getElementById("satsInput");
const convertBtn = document.getElementById("convertBtn");
const exchangeRateText = document.getElementById("exchangeRate");

async function fetchExchangeRate() {
    try {
        let response = await fetch("https://api.coindesk.com/v1/bpi/currentprice/USD.json");
        let data = await response.json();
        return data.bpi.USD.rate_float;
    } catch {
        return null;
    }
}

async function updateConversion() {
    let rate = await fetchExchangeRate();
    if (!rate) return;
    exchangeRateText.textContent = `Taux BTC/USD : ${rate.toFixed(2)} USD`;
    let btc = parseFloat(btcInput.value) || 0;
    usdInput.value = (btc * rate).toFixed(2);
    satsInput.value = (btc * 100000000).toFixed(0);
}

convertBtn.addEventListener("click", updateConversion);
fetchExchangeRate().then(rate => exchangeRateText.textContent = `Taux BTC/USD : ${rate.toFixed(2)} USD`);
