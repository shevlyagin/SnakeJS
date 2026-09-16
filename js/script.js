const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const statusText = document.getElementById("game-status");
const restartButton = document.getElementById("restart-button");

const groundImage = new Image();
groundImage.src = "img/ground.png";

const foodImage = new Image();
foodImage.src = "img/food.png";

const box = 32;
const speed = 100;
const directions = {
  ArrowLeft: { x: -1, y: 0, name: "left" },
  a: { x: -1, y: 0, name: "left" },
  ArrowUp: { x: 0, y: -1, name: "up" },
  w: { x: 0, y: -1, name: "up" },
  ArrowRight: { x: 1, y: 0, name: "right" },
  d: { x: 1, y: 0, name: "right" },
  ArrowDown: { x: 0, y: 1, name: "down" },
  s: { x: 0, y: 1, name: "down" },
};

const opposite = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};

let snake;
let food;
let score;
let direction;
let gameInterval;
let gameOver;
let canTurn;

function resetGame() {
  clearInterval(gameInterval);

  snake = [{ x: 9 * box, y: 10 * box }];
  score = 0;
  direction = null;
  gameInterval = null;
  gameOver = false;
  canTurn = true;
  food = generateFood();

  statusText.textContent = "Use the arrow keys or WASD to start.";
  drawGame();
}

function generateFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } while (snake.some((part) => part.x === newFood.x && part.y === newFood.y));

  return newFood;
}

function changeDirection(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const newDirection = directions[key];

  if (!newDirection || gameOver || !canTurn) {
    return;
  }

  event.preventDefault();

  if (direction && opposite[direction.name] === newDirection.name) {
    return;
  }

  direction = newDirection;
  canTurn = false;

  if (!gameInterval) {
    statusText.textContent = "Game in progress.";
    gameInterval = setInterval(updateGame, speed);
  }
}

function updateGame() {
  const head = snake[0];
  const newHead = {
    x: head.x + direction.x * box,
    y: head.y + direction.y * box,
  };

  const ateFood = newHead.x === food.x && newHead.y === food.y;
  const body = ateFood ? snake : snake.slice(0, -1);
  const hitBody = body.some((part) => part.x === newHead.x && part.y === newHead.y);
  const hitWall =
    newHead.x < box ||
    newHead.x > 17 * box ||
    newHead.y < 3 * box ||
    newHead.y > 17 * box;

  if (hitWall || hitBody) {
    finishGame();
    return;
  }

  snake.unshift(newHead);

  if (ateFood) {
    score += 1;
    food = generateFood();
  } else {
    snake.pop();
  }

  canTurn = true;
  drawGame();
}

function finishGame() {
  clearInterval(gameInterval);
  gameOver = true;
  statusText.textContent = `Game over. Your score: ${score}.`;
  drawGame();
  drawMessage("GAME OVER", `Score: ${score}`);
}

function drawGame() {
  if (groundImage.complete && groundImage.naturalWidth > 0) {
    context.drawImage(groundImage, 0, 0);
  } else {
    context.fillStyle = "#4f8435";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (foodImage.complete && foodImage.naturalWidth > 0) {
    context.drawImage(foodImage, food.x, food.y);
  }

  for (let i = 0; i < snake.length; i += 1) {
    context.fillStyle = i === 0 ? "green" : "red";
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }

  context.fillStyle = "white";
  context.font = "50px Arial";
  context.fillText(score, box * 2.5, box * 1.7);

  if (!direction && !gameOver) {
    drawMessage("READY?", "Press an arrow key or WASD");
  }
}

function drawMessage(title, subtitle) {
  context.fillStyle = "rgba(0, 0, 0, 0.65)";
  context.fillRect(box, box * 7, box * 17, box * 4);

  context.textAlign = "center";
  context.fillStyle = "white";
  context.font = "bold 36px Arial";
  context.fillText(title, canvas.width / 2, box * 8.5);
  context.font = "20px Arial";
  context.fillText(subtitle, canvas.width / 2, box * 9.6);
  context.textAlign = "left";
}

document.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", resetGame);
groundImage.addEventListener("load", drawGame);
foodImage.addEventListener("load", drawGame);

resetGame();
