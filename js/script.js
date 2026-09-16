// Obtenemos el elemento canvas del HTML por su id
const canvas = document.getElementById("game");

// Obtenemos el contexto para dibujar gráficos en 2D
const ctx = canvas.getContext("2d");

// Creamos un objeto de imagen para el fondo (tierra / hierba)
const ground = new Image();
ground.src = "img/ground.png"; // Ruta a la imagen del fondo

// Creamos un objeto de imagen para la comida
const foodImg = new Image();
foodImg.src = "img/food.png"; // Ruta a la imagen de la comida

// Tamaño de una celda del campo de juego (en píxeles)
let box = 32;

// Contador de comida ingerida / puntuación
let score = 0;

// Coordenadas de la comida (un objeto con x e y)
// Posición aleatoria: x — de la celda 1 a la 17, y — de la celda 3 a la 17
let food = {
  x: Math.floor((Math.random() * 17 + 1)) * box,
  y: Math.floor((Math.random() * 15 + 3)) * box,
};

// Array donde se guarda toda la serpiente (cada elemento es un objeto {x, y})
let snake = [];
// Posición inicial de la cabeza de la serpiente — más o menos en el centro del campo
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

// Variable que guarda la dirección actual del movimiento
let dir; // undefined → la serpiente todavía no se mueve

// Escuchamos las teclas pulsadas en toda la página
document.addEventListener("keydown", direction);

// Función que decide hacia dónde se mueve la serpiente ahora
function direction(event) {
  // 37 = ←, 38 = ↑, 39 = →, 40 = ↓
  // No permitimos girar 180° (no se puede ir de "derecha" a "izquierda" directamente)
  if      (event.keyCode == 37 && dir != "right") dir = "left";
  else if (event.keyCode == 38 && dir != "down")  dir = "up";
  else if (event.keyCode == 39 && dir != "left")  dir = "right";
  else if (event.keyCode == 40 && dir != "up")    dir = "down";
}

// Comprobamos si la cabeza de la serpiente choca con algún segmento de su cuerpo
function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    // Si las coordenadas de la cabeza coinciden con cualquier parte del cuerpo → el jugador pierde
    if (head.x == arr[i].x && head.y == arr[i].y)
      clearInterval(game); // Paramos el juego
  }
}

// Función principal del juego — se llama cada 100 ms
function drawGame() {
  // Dibujamos el fondo (cubre todo lo que había antes)
  ctx.drawImage(ground, 0, 0);

  // Dibujamos la comida en sus coordenadas actuales
  ctx.drawImage(foodImg, food.x, food.y);

  // Dibujamos la serpiente
  for (let i = 0; i < snake.length; i++) {
    // La cabeza es verde, el cuerpo es rojo
    ctx.fillStyle = i == 0 ? "green" : "red";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Mostramos la puntuación en la esquina superior izquierda
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7);

  // Coordenadas actuales de la cabeza (antes de moverse)
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Si la cabeza está en la misma celda que la comida
  if (snakeX == food.x && snakeY == food.y) {
    score++;  // +1 punto

    // Creamos nueva comida en un lugar aleatorio
    food = {
      x: Math.floor((Math.random() * 17 + 1)) * box,
      y: Math.floor((Math.random() * 15 + 3)) * box,
    };
    // Importante: la serpiente NO se hace más corta (no se ejecuta pop)
  } else {
    // Eliminamos el último segmento de la cola (la serpiente se mueve)
    snake.pop();
  }

  // Comprobamos si la serpiente ha salido del campo de juego
  if (snakeX < box || snakeX > box * 17 ||
      snakeY < 3 * box || snakeY > box * 17) {
    clearInterval(game); // El juego ha terminado
  }

  // Cambiamos las coordenadas de la cabeza según la dirección
  if (dir == "left")  snakeX -= box;
  if (dir == "right") snakeX += box;
  if (dir == "up")    snakeY -= box;
  if (dir == "down")  snakeY += box;

  // Creamos un objeto con la nueva posición de la cabeza
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // Comprobamos si la nueva cabeza choca con el cuerpo
  eatTail(newHead, snake);

  // Añadimos la nueva cabeza al principio del array (la serpiente "avanza")
  snake.unshift(newHead);
}

// Iniciamos el bucle del juego — llamamos a drawGame() cada 100 ms
let game = setInterval(drawGame, 100);