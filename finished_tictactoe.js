const canvasWidth = 500,
  canvasHeight = 500;

//true means X, false means O
let turn = true;

//Used for checking for a draw
let tiles_taken = 0;

//condition: 0 is empty, 1 is X, 2 is O
let topLeft = {
  condition: 0,
  xPosition: 0,
  yPosition: 0,
};
let topMiddle = {
  condition: 0,
  xPosition: canvasWidth / 3,
  yPosition: 0,
};
let topRight = {
  condition: 0,
  xPosition: (2 * canvasWidth) / 3,
  yPosition: 0,
};
let middleLeft = {
  condition: 0,
  xPosition: 0,
  yPosition: canvasHeight / 3,
};
let middleMiddle = {
  condition: 0,
  xPosition: canvasWidth / 3,
  yPosition: canvasHeight / 3,
};
let middleRight = {
  condition: 0,
  xPosition: (2 * canvasWidth) / 3,
  yPosition: canvasHeight / 3,
};
let bottomLeft = {
  condition: 0,
  xPosition: 0,
  yPosition: (2 * canvasHeight) / 3,
};
let bottomMiddle = {
  condition: 0,
  xPosition: canvasWidth / 3,
  yPosition: (2 * canvasHeight) / 3,
};
let bottomRight = {
  condition: 0,
  xPosition: (2 * canvasWidth) / 3,
  yPosition: (2 * canvasHeight) / 3,
};

let canvas = document.createElement("canvas");
canvas.height = canvasHeight;
canvas.width = canvasWidth;
document.body.appendChild(canvas);
let drawContext = canvas.getContext("2d");
let clear = () => {
  drawContext.fillStyle = "#ffffff";
  drawContext.fillRect(0, 0, canvasWidth, canvasHeight);
};

function drawGrid() {
  drawContext.lineWidth = 5;
  drawContext.beginPath();
  drawContext.moveTo(canvasWidth / 3, 0);
  drawContext.lineTo(canvasWidth / 3, canvasHeight);
  drawContext.stroke();

  drawContext.beginPath();
  drawContext.moveTo((canvasWidth * 2) / 3, 0);
  drawContext.lineTo((canvasWidth * 2) / 3, canvasHeight);
  drawContext.stroke();

  drawContext.beginPath();
  drawContext.moveTo(0, canvasHeight / 3);
  drawContext.lineTo(canvasWidth, canvasHeight / 3);
  drawContext.stroke();

  drawContext.beginPath();
  drawContext.moveTo(0, (canvasHeight * 2) / 3);
  drawContext.lineTo(canvasWidth, (canvasHeight * 2) / 3);
  drawContext.stroke();
}


function onClick(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  function tryMark(square) {
    if (square.condition === 0) {
      tiles_taken += 1;
      square.condition = turn ? 1 : 2;
      turn = !turn;

      let centerX = square.xPosition + canvasWidth / 6;
      let centerY = square.yPosition + canvasHeight / 6;

      if (square.condition === 1) drawX(centerX, centerY);
      else drawO(centerX, centerY);

      // CHECK FOR WIN
      let winner = checkWin();
      if (winner === 1) {
        winnerScreen("X Wins!");
      } else if (winner === 2) {
        winnerScreen("O Wins!");
      } else if (winner === 3) {
        winnerScreen("Draw!");
      }
    }
  }

  // TOP ROW
  if (mouseX < canvasWidth / 3 && mouseY < canvasHeight / 3) {
    tryMark(topLeft);
  } else if (mouseX < (2 * canvasWidth) / 3 && mouseY < canvasHeight / 3) {
    tryMark(topMiddle);
  } else if (mouseX < canvasWidth && mouseY < canvasHeight / 3) {
    tryMark(topRight);
  }

  // MIDDLE ROW
  else if (mouseX < canvasWidth / 3 && mouseY < (2 * canvasHeight) / 3) {
    tryMark(middleLeft);
  } else if (
    mouseX < (2 * canvasWidth) / 3 &&
    mouseY < (2 * canvasHeight) / 3
  ) {
    tryMark(middleMiddle);
  } else if (mouseX < canvasWidth && mouseY < (2 * canvasHeight) / 3) {
    tryMark(middleRight);
  }

  // BOTTOM ROW
  else if (mouseX < canvasWidth / 3 && mouseY < canvasHeight) {
    tryMark(bottomLeft);
  } else if (mouseX < (2 * canvasWidth) / 3 && mouseY < canvasHeight) {
    tryMark(bottomMiddle);
  } else if (mouseX < canvasWidth && mouseY < canvasHeight) {
    tryMark(bottomRight);
  }
}

function winnerScreen(winScreenText) {
  clear();
  drawContext.fillStyle = "#ffffff"; // WHITE
  drawContext.textAlign = "center";
  drawContext.fillRect(0, 0, canvasWidth, canvasHeight); // blocks screen
  drawContext.fillStyle = "#000000"; // BLACK
  drawContext.font = "100px roboto";
  drawContext.fillText(winScreenText, canvasWidth / 2, canvasHeight / 2 + 50);
}

function drawX(startX, startY) {
  let size = canvasWidth / 6;
  drawContext.lineWidth = 3;
  drawContext.beginPath();
  drawContext.moveTo(startX - size, startY - size);
  drawContext.lineTo(startX + size, startY + size);
  drawContext.stroke();

  drawContext.beginPath();
  drawContext.moveTo(startX + size, startY - size);
  drawContext.lineTo(startX - size, startY + size);
  drawContext.stroke();
}

function drawO(centerX, centerY) {
  drawContext.fillStyle = "#000000"; // BLACK
  drawContext.beginPath();
  drawContext.arc(centerX, centerY, canvasWidth / 6, 0, 2 * Math.PI, false);
  drawContext.fill();
  drawContext.fillStyle = "#ffffff"; // WHITE
  drawContext.beginPath();
  drawContext.arc(centerX, centerY, canvasWidth / 8, 0, 2 * Math.PI, false);
  drawContext.fill();
}

function checkWin() {
  function isLine(a, b, c) {
    return (
      a.condition != 0 &&
      a.condition === b.condition &&
      b.condition === c.condition
    );
  }
  // ROWS
  if (isLine(topLeft, topMiddle, topRight)) return topLeft.condition;
  if (isLine(middleLeft, middleMiddle, middleRight))
    return middleLeft.condition;
  if (isLine(bottomLeft, bottomMiddle, bottomRight))
    return bottomLeft.condition;

  // COLUMNS
  if (isLine(topLeft, middleLeft, bottomLeft)) return topLeft.condition;
  if (isLine(topMiddle, middleMiddle, bottomMiddle)) return topMiddle.condition;
  if (isLine(topRight, middleRight, bottomRight)) return topRight.condition;

  // DIAGONALS
  if (isLine(topLeft, middleMiddle, bottomRight)) return topLeft.condition;
  if (isLine(topRight, middleMiddle, bottomLeft)) return topRight.condition;

  if (tiles_taken == 9) {
    return 3;
  }

  return 0; // no winner
}


clear();
drawGrid();
window.addEventListener("click", onClick);
