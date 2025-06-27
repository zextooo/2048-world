const gridContainer = document.getElementById("grid-container");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");

let grid = [];
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;

function createGrid() {
  grid = new Array(4).fill(null).map(() => new Array(4).fill(0));
  updateBoard();
}

function updateBoard() {
  gridContainer.innerHTML = "";
  grid.flat().forEach((value, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = value === 0 ? "" : value;
    tile.dataset.index = index;
    gridContainer.appendChild(tile);
  });
  scoreDisplay.textContent = "Score: " + score;
  bestScoreDisplay.textContent = "Best: " + bestScore;
}

function placeRandomTile() {
  const empty = [];
  grid.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 0) empty.push([i, j]);
    });
  });
  if (empty.length === 0) return;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  grid[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function move(direction) {
  let moved = false;

  function moveRow(row) {
    let newRow = row.filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
        }
        newRow[i + 1] = 0;

        // mark merged
        let flatIndex = grid.flat().indexOf(newRow[i]);
        setTimeout(() => {
          const tile = gridContainer.querySelectorAll(".tile")[flatIndex];
          if (tile) tile.classList.add("merged");
        }, 50);
      }
    }
    return newRow.filter(val => val !== 0).concat(new Array(4).fill(0)).slice(0, 4);
  }

  if (direction === "left") {
    for (let i = 0; i < 4; i++) {
      const newRow = moveRow(grid[i]);
      if (!arraysEqual(grid[i], newRow)) moved = true;
      grid[i] = newRow;
    }
  }

  if (direction === "right") {
    for (let i = 0; i < 4; i++) {
      const reversed = [...grid[i]].reverse();
      const newRow = moveRow(reversed).reverse();
      if (!arraysEqual(grid[i], newRow)) moved = true;
      grid[i] = newRow;
    }
  }

  if (direction === "up") {
    for (let col = 0; col < 4; col++) {
      let column = grid.map(row => row[col]);
      let newCol = moveRow(column);
      for (let row = 0; row < 4; row++) {
        if (grid[row][col] !== newCol[row]) moved = true;
        grid[row][col] = newCol[row];
      }
    }
  }

  if (direction === "down") {
    for (let col = 0; col < 4; col++) {
      let column = grid.map(row => row[col]).reverse();
      let newCol = moveRow(column).reverse();
      for (let row = 0; row < 4; row++) {
        if (grid[row][col] !== newCol[row]) moved = true;
        grid[row][col] = newCol[row];
      }
    }
  }

  if (moved) {
    placeRandomTile();
    updateBoard();
    if (isGameOver()) alert("Game Over!");
  }
}

function isGameOver() {
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false;
      if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
      if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
    }
  return true;
}

function arraysEqual(a, b) {
  return a.every((val, index) => val === b[index]);
}

function startGame() {
  score = 0;
  createGrid();
  placeRandomTile();
  placeRandomTile();
  updateBoard();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
  }
});

window.onload = startGame;
