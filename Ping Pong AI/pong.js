// Get the canvas and context
const canvas = document.getElementById("pingPong");
const ctx = canvas.getContext("2d");

// Define the paddles and ball
const paddleWidth = 10, paddleHeight = 100;
let player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "white", score: 0 };
let ai = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "white", score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speed: 5, velocityX: 5, velocityY: 5, color: "white" };

// Draw objects on the canvas
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px Arial";
    ctx.fillText(text, x, y);
}

// Control the player's paddle
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}

// Reset the ball after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Detect collision with paddles
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Update game objects
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI paddle movement
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.1;

    // Collision detection on top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Check for collision with paddles
    let playerPaddle = (ball.x < canvas.width / 2) ? player : ai;
    if (collision(ball, playerPaddle)) {
        let collidePoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
        collidePoint = collidePoint / (playerPaddle.height / 2);

        let angleRad = collidePoint * (Math.PI / 4);
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
}

// Render game objects on the canvas
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(player.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(ai.score, 3 * canvas.width / 4, canvas.height / 5, "white");
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// The game loop
function gameLoop() {
    update();
    render();
}

// Call the game loop 60 times per second
let fps = 60;
setInterval(gameLoop, 1000 / fps);
